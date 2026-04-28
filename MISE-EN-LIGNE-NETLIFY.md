# 🚀 Mise en ligne sur Netlify — Guide complet

## ÉTAPE 1 — Créer la base de données Supabase

1. Allez sur https://supabase.com → **Start your project**
2. Créez un compte puis cliquez **New project**
3. Remplissez :
   - **Name** : emploiplus
   - **Database Password** : notez-le bien
   - **Region** : West EU (Ireland)
4. Attendez ~2 minutes que le projet se crée
5. Allez dans **SQL Editor** → **New query**
6. Copiez-collez tout le contenu de `supabase-schema-DEFINITIF.sql`
7. Cliquez **Run** → vous devez voir "Success"

### Récupérer vos clés Supabase :
- Allez dans **Settings** (engrenage) → **API**
- Copiez **Project URL** → ex: `https://abcxyz.supabase.co`
- Copiez **service_role** (secret) → longue chaîne `eyJ...`

---

## ÉTAPE 2 — Mettre le code sur GitHub

1. Créez un compte sur https://github.com si vous n'en avez pas
2. Créez un nouveau repo : https://github.com/new
   - Name : `emploiplus`
   - Visibility : **Private** (recommandé)
   - Cliquez **Create repository**

3. Dans votre terminal Windows, dans le dossier `emploiplus` :
```bash
git init
git add .
git commit -m "Emploi Plus - version initiale"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/emploiplus.git
git push -u origin main
```

---

## ÉTAPE 3 — Déployer sur Netlify

1. Allez sur https://netlify.com → **Sign up** (avec votre compte GitHub)
2. Cliquez **Add new site** → **Import an existing project**
3. Choisissez **GitHub**
4. Sélectionnez votre repo `emploiplus`
5. Vérifiez les paramètres :
   - **Branch** : main
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
6. Cliquez **Add environment variables** et ajoutez :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votreID.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...votre_service_role_key` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `VotreMotDePasse` |

7. Cliquez **Deploy site**
8. Attendez 2-3 minutes → votre site est en ligne ! 🎉

---

## ÉTAPE 4 — Votre site est en ligne

- **URL publique** : `https://nom-aleatoire.netlify.app`
- **Tableau de bord** : `https://votre-site.netlify.app/admin`
- **Mot de passe** : celui que vous avez mis dans `NEXT_PUBLIC_ADMIN_PASSWORD`

### Domaine personnalisé (optionnel)
Dans Netlify → **Domain settings** → **Add custom domain**
Entrez : `emploiplus.cg` et suivez les instructions DNS.

---

## ❓ Problèmes fréquents

**Build échoue avec "Cannot find module '@supabase/supabase-js'"**
→ Vérifiez que `package.json` contient bien `"@supabase/supabase-js"` dans dependencies.

**"supabaseUrl is required"**
→ Les variables d'environnement ne sont pas configurées dans Netlify.
→ Allez dans : Site settings → Environment variables → vérifiez les 3 variables.

**Le site charge mais les données ne s'affichent pas**
→ Le SQL n'a pas été exécuté dans Supabase. Retournez à l'Étape 1.

**Après un changement de code**
→ Faites `git add . && git commit -m "update" && git push`
→ Netlify redéploie automatiquement en 2 minutes.
