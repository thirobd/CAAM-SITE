# ĆAAM — site e-commerce (phase 1 : prototype)

Boutique de la maison de parfum ĆAAM (extraits de parfum, Dakar · Europe).
Phase 1 : interface complète et fonctionnelle avec **données de démonstration**.
Aucun paiement réel, aucune commande transmise, aucune base de données.

**Stack** : Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Motion · Lucide React · ESLint 10.

---

## Lancer le site en local

Prérequis : Node.js 20.9 ou plus récent (testé avec Node 24).

```powershell
cd C:\dev\caam
npm install
npm run dev
```

Puis ouvrir **http://localhost:3000**.

Version de production (plus rapide, identique à la mise en ligne) :

```powershell
npm run build
npm start
```

Vérifications :

```powershell
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run build       # compilation de production
```

Aucune variable d'environnement n'est nécessaire en phase 1 (voir `.env.example`).

> Le projet est volontairement hors de OneDrive : la synchronisation restaurait des fichiers
> supprimés et bloquait la compilation. Ne pas remettre le dossier dans OneDrive ; utiliser git
> (GitHub) pour la sauvegarde.

---

## Où modifier quoi

| Je veux changer…                               | Fichier                                              |
| ---------------------------------------------- | ---------------------------------------------------- |
| Les parfums (noms, notes, prix FCFA, stocks)   | `src/lib/catalog/data.ts`                            |
| Collections, familles olfactives, tris         | `src/lib/catalog/taxonomy.ts`                        |
| Seuil « Plus que N », quantité max par commande | `src/lib/catalog/stock.ts`                           |
| Zones et frais de livraison (démo)             | `src/lib/delivery.ts`                                |
| Modes de paiement affichés, règles du formulaire | `src/lib/checkout.ts`                              |
| Réseaux sociaux, e-mail, téléphone             | `src/lib/site.ts`                                    |
| Couleurs et typographies                       | `src/app/globals.css` (bloc `@theme`) et `src/app/layout.tsx` |
| Logo                                           | `public/brand/caam-logo.png` et `caam-mark.png`      |
| Icônes d'onglet                                | `src/app/icon.png`, `src/app/apple-icon.png`         |

### Ajouter les vraies photos

1. Déposer les photos dans `public/parfums/` (format portrait 4:5 conseillé, ex. 1600 × 2000 px).
2. Dans `src/lib/catalog/data.ts`, renseigner `images: ["/parfums/ambre-souverain-1.jpg", "/parfums/ambre-souverain-2.jpg"]`.

Sans photo, un flacon dessiné (avec le logo ĆAAM) s'affiche dans la couleur du parfum (`tint`).
Si une photo ne se charge pas, le flacon dessiné prend automatiquement le relais.

### Logo

Le logo a été détouré à partir du JPG fourni (691 × 317 px). Pour une netteté parfaite sur grands
écrans, demander à ĆAAM une version **SVG** ou PNG haute définition et remplacer les fichiers de `public/brand/`.

---

## Ce qui fonctionne (implémenté et testé)

- **Accueil** : bandeau livraison, en-tête (logo, Boutique, Collections, Notre histoire, recherche, compte, panier),
  hero animé (titre révélé, flacons en fondu, volutes de fumée), signatures, collections, familles olfactives,
  meilleures ventes, histoire de la marque, newsletter, pied de page.
- **Boutique** : recherche (nom, notes, famille — sans tenir compte des accents), filtres collection et famille,
  tri (recommandés, nouveautés, prix, nom), « en stock uniquement », état vide ; filtres reflétés dans l'URL
  (liens partageables, ex. `/boutique?famille=boise`).
- **Recherche instantanée** dans l'en-tête (suggestions, résultats, Entrée → boutique filtrée).
- **Fiche produit** : galerie (3 vues, clavier ← →), contenances 50 / 100 ml, prix, stock par contenance
  (En stock / Plus que N / Épuisé), quantité plafonnée au stock, ajout au panier avec confirmation animée,
  pyramide olfactive, informations dépliables, suggestions.
- **Panier** (tiroir) : quantités, suppression, sous-total, conservé dans le navigateur et synchronisé entre onglets.
- **Devise** : FCFA par défaut ; € à titre indicatif via la parité fixe officielle 1 € = 655,957 FCFA (mémorisé).
- **Commande** : formulaire (nom, téléphone, pays, ville, adresse, instructions, paiement), validation
  champ par champ avec messages accessibles, estimation de livraison (Dakar / Sénégal / international).
- **Validation côté serveur** (`src/server/orders.ts`) : les prix et le stock sont revérifiés à partir du
  catalogue ; un panier modifié à la main (article épuisé, prix trafiqué) est refusé.
- **États** : chargement (squelettes), panier vide, recherche sans résultat, rupture de stock, erreur, 404.
- **Accessibilité** : HTML sémantique, libellés, navigation clavier, focus visibles, piège à focus dans le panier,
  lien d'évitement, respect de « réduire les animations ».
- **Responsive** : testé à 390 px (mobile) et 1440 px (ordinateur), sans défilement horizontal.

## Ce qui est en démonstration

- Les **10 parfums**, leurs prix et leurs stocks sont **fictifs** (`data.ts`).
- La **commande** génère une référence `CAAM-DEMO-XXXXXX` : rien n'est enregistré, envoyé ni débité.
- Les **modes de paiement** (paiement à la livraison, Mobile Money Wave / Orange Money, carte) sont affichés
  mais **non connectés**.
- Les **frais de livraison** (2 000 / 4 000 FCFA, international sur devis) sont indicatifs.
- La **newsletter** valide l'adresse mais ne l'enregistre pas.
- L'**espace client** est une page « bientôt disponible » (aucune fausse connexion).
- Les **pages légales** sont des modèles à compléter (`[À compléter]`).

## Pas encore implémenté (phases suivantes)

1. **Supabase** (base de données + stockage des photos) — remplacer le contenu de `src/lib/catalog/repository.ts`
   (les pages appellent déjà des fonctions asynchrones).
2. **Supabase Auth + tableau de bord propriétaire protégé** (rôles sécurisés).
3. **Gestion des produits et du stock** depuis le tableau de bord.
4. **Création réelle des commandes** avec vérification et décrément du stock côté serveur, dans une transaction
   — point d'entrée : `src/server/orders.ts`.
5. **Paiement** : prestataire pour le Sénégal (Wave, Orange Money…) et cartes internationales, avec vérification
   des paiements côté serveur (webhooks).
6. **Zones de livraison, tarifs et suivi de commande** gérés en base — remplacer `src/lib/delivery.ts`.

Autres éléments à prévoir avant la mise en ligne : e-mail et téléphone de contact, contenus réels
(histoire, photos), pages légales validées, nom de domaine et hébergement.

---

## Structure

```
src/
  app/                    Pages (App Router) : accueil, boutique, collections, parfums/[slug],
                          commande, maison, livraison, contact, compte, pages légales, 404, erreur
  components/
    brand/                Logo, pictogrammes réseaux
    cart/                 Tiroir du panier
    checkout/             Formulaire, récapitulatif, confirmation
    home/                 Sections de l'accueil
    layout/               Bandeau, en-tête, menu mobile, recherche, pied de page, devise
    motion/               Apparitions au défilement
    product/              Carte, galerie, achat, visuels, stock
    providers/            Panier, devise, configuration Motion
    shop/                 Explorateur de la boutique (recherche, filtres, tri)
    ui/                   Boutons, titres, champs, quantités
  lib/
    catalog/              Types, données démo, dépôt (repository), filtres, stock, taxonomie
    cart/store.ts         Panier (localStorage)
    checkout.ts           Types et validation de commande (partagés navigateur / serveur)
    currency.ts           FCFA / € (parité fixe)
    delivery.ts           Pays et zones de livraison (démo)
    site.ts               Informations de la marque
  server/orders.ts        Action serveur de commande (démo)
public/brand/             Logo détouré
```
