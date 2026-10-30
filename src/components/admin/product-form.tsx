"use client";

import { AlertCircle, ExternalLink, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Field, inputClass } from "@/components/checkout/field";
import { Button } from "@/components/ui/button";
import {
  hasErrors,
  parseNotes,
  slugify,
  suggestSku,
  validateProduct,
  type ProductErrors,
  type ProductInput,
  type VariantInput,
} from "@/lib/admin/product-input";
import { collections, families } from "@/lib/catalog/taxonomy";
import type { CollectionId, FamilyId } from "@/lib/catalog/types";
import { XOF_PER_EUR } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { deleteProduct, saveProduct } from "@/server/admin/products";
import { ImageManager } from "./image-manager";

const sectionTitle = "eyebrow mb-5 text-gold-deep";
const toNumber = (value: string) => (value.trim() === "" ? Number.NaN : Number(value.replace(",", ".")));
const shown = (n: number) => (Number.isNaN(n) ? "" : String(n));

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 border border-ink/15 bg-paper px-4 py-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-ink" />
      <span>
        <span className="block text-[15px]">{label}</span>
        <span className="block text-[13px] text-stone">{hint}</span>
      </span>
    </label>
  );
}

function VariantRow({
  index,
  variant,
  errors,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  variant: VariantInput;
  errors?: Partial<Record<keyof VariantInput, string>>;
  onChange: (v: VariantInput) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [eur, setEur] = useState(() => (Number.isNaN(variant.priceXof) ? "" : (variant.priceXof / XOF_PER_EUR).toFixed(2)));
  const id = `variant-${index}`;
  const cell = (error?: string) => cn(inputClass, "h-11", error ? "border-danger" : "border-ink/20");

  return (
    <li className="grid grid-cols-2 gap-3 border border-ink/15 bg-paper p-4 sm:grid-cols-[90px_1fr_1fr_90px_1.2fr_auto] sm:items-end">
      <label className="flex flex-col gap-1.5 text-[12px] text-stone">
        Contenance (ml)
        <input
          id={`${id}-size`}
          inputMode="numeric"
          value={shown(variant.sizeMl)}
          onChange={(e) => onChange({ ...variant, sizeMl: toNumber(e.target.value) })}
          className={cell(errors?.sizeMl)}
          aria-invalid={!!errors?.sizeMl}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[12px] text-stone">
        Prix (FCFA)
        <input
          inputMode="numeric"
          value={shown(variant.priceXof)}
          onChange={(e) => {
            const xof = toNumber(e.target.value);
            onChange({ ...variant, priceXof: xof });
            setEur(Number.isNaN(xof) ? "" : (xof / XOF_PER_EUR).toFixed(2));
          }}
          className={cell(errors?.priceXof)}
          aria-invalid={!!errors?.priceXof}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[12px] text-stone">
        ou prix (€)
        <input
          inputMode="decimal"
          value={eur}
          onChange={(e) => {
            setEur(e.target.value);
            const value = toNumber(e.target.value);
            onChange({ ...variant, priceXof: Number.isNaN(value) ? Number.NaN : Math.round(value * XOF_PER_EUR) });
          }}
          className={cell(errors?.priceXof)}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[12px] text-stone">
        Stock
        <input
          inputMode="numeric"
          value={shown(variant.stock)}
          onChange={(e) => onChange({ ...variant, stock: toNumber(e.target.value) })}
          className={cell(errors?.stock)}
          aria-invalid={!!errors?.stock}
        />
      </label>
      <label className="col-span-2 flex flex-col gap-1.5 text-[12px] text-stone sm:col-span-1">
        Référence
        <input
          value={variant.sku}
          onChange={(e) => onChange({ ...variant, sku: e.target.value.toUpperCase() })}
          className={cell(errors?.sku)}
          aria-invalid={!!errors?.sku}
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="col-span-2 inline-flex h-11 items-center justify-center gap-2 border border-ink/20 px-3 text-[13px] text-stone hover:border-danger hover:text-danger disabled:opacity-30 sm:col-span-1"
        aria-label={`Retirer la contenance ${index + 1}`}
      >
        <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
        <span className="sm:hidden">Retirer</span>
      </button>
      {errors && Object.values(errors).length > 0 && (
        <p className="col-span-2 text-sm text-danger sm:col-span-6">{Object.values(errors).join(" ")}</p>
      )}
    </li>
  );
}

export function ProductForm({ initial }: { initial: ProductInput }) {
  const router = useRouter();
  const [p, setP] = useState<ProductInput>(initial);
  const [notes, setNotes] = useState({
    top: initial.notesTop.join(", "),
    heart: initial.notesHeart.join(", "),
    base: initial.notesBase.join(", "),
  });
  // Clés stables des lignes de contenance (les nouvelles n'ont pas encore d'identifiant).
  const [rowKeys, setRowKeys] = useState(() => initial.variants.map((v, i) => v.id ?? `nouvelle-${i}`));
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [errors, setErrors] = useState<ProductErrors>({});
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isNew = !initial.id;

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof ProductErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function setName(name: string) {
    setP((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
      // Les références encore « automatiques » suivent le nom.
      variants: prev.variants.map((v) => (v.sku === "" || v.sku === suggestSku(prev.name, v.sizeMl) ? { ...v, sku: suggestSku(name, v.sizeMl) } : v)),
    }));
  }

  function setVariant(index: number, next: VariantInput) {
    setP((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => {
        if (i !== index) return v;
        const autoSku = v.sku === "" || v.sku === suggestSku(prev.name, v.sizeMl);
        return autoSku && next.sku === v.sku ? { ...next, sku: suggestSku(prev.name, next.sizeMl) } : next;
      }),
    }));
  }

  function payload(): ProductInput {
    return { ...p, notesTop: parseNotes(notes.top), notesHeart: parseNotes(notes.heart), notesBase: parseNotes(notes.base) };
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input = payload();
    const errs = validateProduct(input);
    setErrors(errs);
    if (hasErrors(errs)) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    startTransition(async () => {
      try {
        const result = await saveProduct(input);
        if (result.ok) {
          router.replace(`/admin/parfums/${result.id}?enregistre=${Date.now()}`);
        } else {
          setErrors(result.errors);
        }
      } catch {
        setErrors({ form: "L'enregistrement a échoué. Vérifiez votre connexion et réessayez." });
      }
    });
  }

  function remove() {
    if (!initial.id) return;
    startTransition(async () => {
      // En cas de succès, l'action redirige vers la liste des parfums.
      const result = await deleteProduct(initial.id!);
      if (result && !result.ok) setErrors({ form: result.message });
    });
  }

  const summary = errors.form ?? (hasErrors(errors) ? "Certains champs sont à corriger." : null);

  return (
    <form onSubmit={submit} noValidate className="space-y-12">
      <fieldset className="space-y-5">
        <legend className={sectionTitle}>Identité</legend>
        <Field id="p-name" label="Nom du parfum" required error={errors.name}>
          {(f) => <input {...f} className={cn(f.className, "h-12")} value={p.name} onChange={(e) => setName(e.target.value)} />}
        </Field>
        <Field id="p-slug" label="Adresse de la page" required error={errors.slug} hint={`caam-pi.vercel.app/parfums/${p.slug || "…"}`}>
          {(f) => (
            <input
              {...f}
              className={cn(f.className, "h-12")}
              value={p.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
              }}
            />
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="p-collection" label="Collection" required error={errors.collection}>
            {(f) => (
              <select {...f} className={cn(f.className, "h-12")} value={p.collection} onChange={(e) => set("collection", e.target.value as CollectionId)}>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id="p-family" label="Famille olfactive" required error={errors.family}>
            {(f) => (
              <select {...f} className={cn(f.className, "h-12")} value={p.family} onChange={(e) => set("family", e.target.value as FamilyId)}>
                {families.map((fam) => (
                  <option key={fam.id} value={fam.id}>
                    {fam.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id="p-brand" label="Marque" required error={errors.brand}>
            {(f) => <input {...f} className={cn(f.className, "h-12")} value={p.brand} onChange={(e) => set("brand", e.target.value)} />}
          </Field>
          <Field id="p-concentration" label="Concentration" required error={errors.concentration}>
            {(f) => <input {...f} className={cn(f.className, "h-12")} value={p.concentration} onChange={(e) => set("concentration", e.target.value)} />}
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className={sectionTitle}>Présentation</legend>
        <Field id="p-tagline" label="Phrase d'accroche" error={errors.tagline} hint="Affichée en italique sous le nom, ex. « Un parfum de grâce paisible »">
          {(f) => <input {...f} className={cn(f.className, "h-12")} value={p.tagline} onChange={(e) => set("tagline", e.target.value)} />}
        </Field>
        <Field id="p-description" label="Description" error={errors.description}>
          {(f) => <textarea {...f} className={cn(f.className, "min-h-36 py-3")} value={p.description} onChange={(e) => set("description", e.target.value)} />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          {(
            [
              ["top", "Notes de tête"],
              ["heart", "Notes de cœur"],
              ["base", "Notes de fond"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} id={`p-notes-${key}`} label={label} hint="Séparées par des virgules">
              {(f) => <input {...f} className={cn(f.className, "h-12")} value={notes[key]} onChange={(e) => setNotes((n) => ({ ...n, [key]: e.target.value }))} />}
            </Field>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className={sectionTitle}>Photos</legend>
        <ImageManager images={p.images} onChange={(images) => set("images", images)} folder={p.slug} error={errors.images} />
        <div className="flex items-center gap-4">
          <input
            id="p-tint"
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(p.tint) ? p.tint : "#b88a3e"}
            onChange={(e) => set("tint", e.target.value)}
            className="h-12 w-16 cursor-pointer border border-ink/20 bg-paper p-1"
          />
          <label htmlFor="p-tint" className="text-[13px] leading-relaxed text-stone">
            <span className="block text-ink">Couleur d&apos;ambiance</span>
            Utilisée pour les flacons dessinés (accueil, collections) et quand le parfum n&apos;a pas de photo.
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className={sectionTitle}>Contenances, prix et stock</legend>
        <ul className="space-y-3">
          {p.variants.map((v, i) => (
            <VariantRow
              key={rowKeys[i]}
              index={i}
              variant={v}
              errors={errors.variantRows?.[i]}
              canRemove={p.variants.length > 1}
              onChange={(next) => setVariant(i, next)}
              onRemove={() => {
                set("variants", p.variants.filter((_, j) => j !== i));
                setRowKeys((keys) => keys.filter((_, j) => j !== i));
                setErrors((e) => ({ ...e, variantRows: undefined }));
              }}
            />
          ))}
        </ul>
        {errors.variants && <p className="mt-3 text-sm text-danger">{errors.variants}</p>}
        <button
          type="button"
          onClick={() => {
            const size = p.variants.some((v) => v.sizeMl === 100) ? 30 : 100;
            set("variants", [...p.variants, { sizeMl: size, priceXof: Number.NaN, stock: 0, sku: suggestSku(p.name, size) }]);
            setRowKeys((keys) => [...keys, `nouvelle-${Date.now()}`]);
          }}
          className="mt-4 inline-flex h-11 items-center gap-2 border border-ink/30 px-4 text-[13px] hover:border-ink"
        >
          <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" /> Ajouter une contenance
        </button>
        <p className="mt-3 text-xs text-stone">Prix facturés en FCFA ; l&apos;équivalent en euros est calculé à la parité fixe 1 € = 655,957 FCFA.</p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className={sectionTitle}>Visibilité</legend>
        <Toggle label="Publié sur le site" hint="Décoché, le parfum reste enregistré mais n'apparaît pas dans la boutique." checked={p.isPublished} onChange={(v) => set("isPublished", v)} />
        <Toggle label="Mis en avant à l'accueil" hint="Photos qui défilent en haut de l'accueil (4 parfums au plus)." checked={p.featured} onChange={(v) => set("featured", v)} />
        <Toggle label="Badge « Nouveau »" hint="Affiché sur la carte du parfum." checked={p.isNew} onChange={(v) => set("isNew", v)} />
        <div className="grid gap-5 pt-2 sm:grid-cols-2">
          <Field id="p-rank" label="Classement « Meilleures ventes »" error={errors.bestSellerRank} hint="1 = le plus vendu. Vide = absent de la rubrique.">
            {(f) => (
              <input
                {...f}
                inputMode="numeric"
                className={cn(f.className, "h-12")}
                value={p.bestSellerRank === null ? "" : shown(p.bestSellerRank)}
                onChange={(e) => set("bestSellerRank", e.target.value.trim() === "" ? null : toNumber(e.target.value))}
              />
            )}
          </Field>
          <Field id="p-position" label="Ordre d'affichage" required error={errors.position} hint="Plus petit = plus haut dans la boutique.">
            {(f) => <input {...f} inputMode="numeric" className={cn(f.className, "h-12")} value={shown(p.position)} onChange={(e) => set("position", toNumber(e.target.value))} />}
          </Field>
        </div>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 border-t border-ink/10 bg-ivory/95 px-4 py-4 backdrop-blur">
        {summary && (
          <p role="alert" className="mb-3 flex items-start gap-3 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            {summary}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="ink" size="lg" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" /> Enregistrement…
              </>
            ) : isNew ? (
              "Créer le parfum"
            ) : (
              "Enregistrer"
            )}
          </Button>
          {!isNew && initial.isPublished && (
            <a href={`/parfums/${initial.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center gap-2 px-3 text-[13px] text-stone hover:text-ink">
              <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" /> Voir sur le site
            </a>
          )}
        </div>
      </div>

      {!isNew && (
        <section className="border border-danger/30 p-5">
          <h2 className="text-[15px] text-danger">Supprimer ce parfum</h2>
          <p className="mt-1 text-[13px] text-stone">
            Définitif : le parfum et ses contenances sont effacés. Pour le retirer temporairement de la boutique, décochez plutôt « Publié sur le site ».
          </p>
          {confirmDelete ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="danger" onClick={remove} disabled={pending}>
                Oui, supprimer définitivement
              </Button>
              <Button variant="outline-dark" onClick={() => setConfirmDelete(false)} disabled={pending}>
                Annuler
              </Button>
            </div>
          ) : (
            <Button variant="outline-dark" onClick={() => setConfirmDelete(true)} className="mt-4">
              Supprimer…
            </Button>
          )}
        </section>
      )}
    </form>
  );
}
