# ĆAAM — site boutique

Boutique en ligne de la maison de parfum ĆAAM : Next.js 16 + paiement Stripe Checkout,
livraison internationale et prix affichés dans la devise du client (Adaptive Pricing).

## Lancer le site en local

```powershell
npm install
copy .env.example .env.local   # puis renseigner la clé Stripe
npm run dev                    # http://localhost:3000
```

## Où modifier quoi

| Je veux changer…                         | Fichier                                   |
| ---------------------------------------- | ----------------------------------------- |
| Les parfums, descriptions, notes, prix   | `src/lib/catalog.ts` (prix en centimes)   |
| Les zones, tarifs et délais de livraison | `src/lib/shipping.ts`                     |
| E-mail, Instagram, nom, accroche         | `src/lib/site.ts`                         |
| Couleurs, typographies, espacements      | `src/app/globals.css` (bloc `:root`)      |
| Textes de l'accueil / de La Maison       | `src/app/page.tsx`, `src/app/maison/page.tsx` |
| Pages légales                            | `src/app/mentions-legales`, `cgv`, `confidentialite` |

### Ajouter les photos des parfums

1. Déposer les photos dans `public/parfums/` (format portrait 4:5 conseillé, ex. 1600×2000).
2. Dans `src/lib/catalog.ts`, ajouter `image: "/parfums/nuit-d-ambre.jpg"` au parfum concerné.

Tant qu'un parfum n'a pas de photo, un flacon dessiné à sa couleur (`tint`) s'affiche.

### Mettre le logo officiel

Déposer le fichier dans `public/` (idéalement `logo.svg`) puis remplacer le contenu de
`src/components/Wordmark.tsx` par une balise `<Image>` pointant vers ce fichier.

## Paiement (Stripe)

1. Créer un compte sur https://dashboard.stripe.com et récupérer la **clé secrète de test** (`sk_test_…`).
2. La coller dans `.env.local` → `STRIPE_SECRET_KEY=sk_test_…`
3. Tester un paiement avec la carte `4242 4242 4242 4242`, date future, CVC quelconque.
4. Dans le tableau de bord Stripe :
   - **Paramètres → E-mails clients** : activer l'envoi des reçus de paiement ;
   - **Paramètres → Adaptive Pricing** : vérifier qu'il est activé (prix en devise locale) ;
   - **Paramètres → Moyens de paiement** : activer Apple Pay / Google Pay et autres moyens souhaités.
5. Au lancement : remplacer par la clé **live** (`sk_live_…`) sur l'hébergeur.

Les commandes (articles, adresse de livraison, téléphone) apparaissent dans Stripe → **Paiements**.

## Mise en ligne (Vercel conseillé)

1. Pousser le projet sur GitHub, puis l'importer sur https://vercel.com.
2. Ajouter les variables d'environnement `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_SITE_URL`
   (ex. `https://caam.com`).
3. Relier le nom de domaine dans Vercel → Settings → Domains.

## Reste à faire avant le lancement

- [ ] Vrais parfums, prix et photos (`catalog.ts`)
- [ ] Logo officiel
- [ ] E-mail et Instagram réels (`site.ts`)
- [ ] Tarifs et pays de livraison validés (`shipping.ts`)
- [ ] Histoire du couple (page La Maison, champs « [À compléter] »)
- [ ] Mentions légales, CGV et confidentialité complétées et validées
- [ ] Compte Stripe activé (vérification d'identité de l'entreprise)
