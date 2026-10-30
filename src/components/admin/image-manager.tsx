"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { imageUrl } from "@/lib/catalog/mapper";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const MAX_PHOTOS = 8;
const MAX_SIDE = 2000;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Réduit les photos trop grandes (souvent prises au téléphone) avant l'envoi. */
async function prepare(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  if (!ACCEPTED.includes(file.type)) throw new Error(`« ${file.name} » : format non pris en charge (JPEG, PNG, WebP).`);
  if (file.type === "image/avif") {
    if (file.size > 5_000_000) throw new Error(`« ${file.name} » dépasse 5 Mo.`);
    return { blob: file, ext: "avif", type: file.type };
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= 1_500_000) {
    bitmap.close();
    return { blob: file, ext: file.type.split("/")[1].replace("jpeg", "jpg"), type: file.type };
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(`« ${file.name} » n'a pas pu être préparée.`))), "image/jpeg", 0.88),
  );
  return { blob, ext: "jpg", type: "image/jpeg" };
}

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  /** Dossier de rangement dans le compartiment « products » (adresse du parfum). */
  folder: string;
  error?: string;
};

export function ImageManager({ images, onChange, folder, error }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_PHOTOS - images.length;
    const chosen = Array.from(files).slice(0, Math.max(0, room));
    const problems: string[] = files.length > room ? [`${MAX_PHOTOS} photos maximum par parfum.`] : [];
    const supabase = createBrowserSupabase();
    const added: string[] = [];
    setUploading(chosen.length);
    for (const file of chosen) {
      try {
        const { blob, ext, type } = await prepare(file);
        const path = `${folder || "nouveau"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(path, blob, { contentType: type });
        if (uploadError) throw new Error(`« ${file.name} » : ${uploadError.message}`);
        added.push(path);
      } catch (e) {
        problems.push(e instanceof Error ? e.message : `« ${file.name} » n'a pas pu être envoyée.`);
      }
      setUploading((n) => n - 1);
    }
    if (added.length > 0) onChange([...images, ...added]);
    setMessages(problems);
    if (input.current) input.current.value = "";
  }

  function move(index: number, delta: number) {
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  return (
    <div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((path, i) => (
          <li key={path} className="group relative aspect-[4/5] overflow-hidden border border-ink/15 bg-paper">
            <Image src={imageUrl(path)} alt={`Photo ${i + 1}`} fill sizes="160px" className="object-cover" />
            {i === 0 && <span className="absolute left-1.5 top-1.5 bg-ink px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ivory">Principale</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/75 text-ivory">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-9 flex-1 place-items-center disabled:opacity-30" aria-label={`Déplacer la photo ${i + 1} vers la gauche`}>
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="grid h-9 flex-1 place-items-center hover:text-champagne" aria-label={`Retirer la photo ${i + 1}`}>
                <Trash2 className="size-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="grid h-9 flex-1 place-items-center disabled:opacity-30" aria-label={`Déplacer la photo ${i + 1} vers la droite`}>
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </li>
        ))}
        {images.length < MAX_PHOTOS && (
          <li className="aspect-[4/5]">
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={uploading > 0}
              className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/30 text-[13px] text-stone transition-colors hover:border-ink hover:text-ink disabled:cursor-wait"
            >
              {uploading > 0 ? (
                <>
                  <LoaderCircle className="size-5 animate-spin" strokeWidth={1.5} aria-hidden="true" /> Envoi…
                </>
              ) : (
                <>
                  <ImagePlus className="size-5" strokeWidth={1.5} aria-hidden="true" /> Ajouter
                </>
              )}
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept={ACCEPTED.join(",")} multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => upload(e.target.files)} />
      <p className="mt-3 text-xs text-stone">
        La première photo est la photo principale. Format portrait (4:5) conseillé. Les photos trop lourdes sont réduites automatiquement.
      </p>
      {[...messages, ...(error ? [error] : [])].map((m) => (
        <p key={m} className="mt-2 text-sm text-danger">
          {m}
        </p>
      ))}
    </div>
  );
}
