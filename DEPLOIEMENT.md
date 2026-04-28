# 🚀 Guide de mise en ligne — Emploi Plus

## Étape 1 — Créer un compte Supabase (gratuit)

1. Allez sur **https://supabase.com**
2. Cliquez **Start your project** → créez un compte (GitHub ou email)
3. Cliquez **New project**
4. Remplissez :
   - **Name** : `emploiplus`
   - **Database Password** : choisissez un mot de passe fort (notez-le)
   - **Region** : choisissez la plus proche (Europe West)
5. Cliquez **Create new project** et attendez ~2 minutes

---

## Étape 2 — Créer les tables dans Supabase

1. Dans votre projet Supabase, cliquez sur **SQL Editor** (menu gauche)
2. Cliquez **New query**
3. Copiez-collez tout le contenu du fichier `supabase-schema.sql`
4. Cliquez **Run** (▶)
5. Vous devez voir **"Success. No rows returned"**

---

## Étape 3 — Récupérer vos clés Supabase

1. Dans Supabase, allez dans **Settings** (roue dentée) → **API**
2. Notez :
   - **Project URL** → ressemble à `https://abcdefghij.supabase.co`
   - **service_role** (secret key) → longue chaîne commençant par `eyJ...`
   ⚠️ Ne jamais partager la service_role key

---

## Étape 4 — Configurer les variables localement

Dans votre dossier `emploiplus`, créez un fichier `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=VotreMotDePasseAdmin
```

Remplacez les valeurs par celles de l'Étape 3.

---

## Étape 5 — Installer le package Supabase

Dans votre terminal, dans le dossier du projet :

```bash
npm install @supabase/supabase-js
```

---

## Étape 6 — Tester en local

```bash
npm run dev
```

Ouvrez http://localhost:3000 — le site doit fonctionner avec Supabase.
Testez en créant une offre dans le tableau de bord.

---

## Étape 7 — Mettre en ligne sur Vercel

### Option A — Via GitHub (recommandé)

1. Créez un repo GitHub : https://github.com/new
2. Dans votre terminal :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USER/emploiplus.git
   git push -u origin main
   ```
3. Allez sur **https://vercel.com** → **Add New Project**
4. Importez votre repo GitHub
5. Dans **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = votre service role key
   - `NEXT_PUBLIC_ADMIN_PASSWORD` = votre mot de passe admin
6. Cliquez **Deploy**
7. Votre site sera en ligne sur `emploiplus.vercel.app` ✅

### Option B — Via CLI Vercel

```bash
npm install -g vercel
vercel
# Suivez les instructions
# Ajoutez les env variables quand demandé
```

---

## Étape 8 — Domaine personnalisé (optionnel)

Sur Vercel → votre projet → **Settings** → **Domains**
Ajoutez votre domaine (ex: `emploiplus.cg`) et suivez les instructions DNS.

---

## 🔑 Accès tableau de bord

- URL : `https://votre-site.vercel.app/admin`
- Mot de passe : celui défini dans `NEXT_PUBLIC_ADMIN_PASSWORD`

---

## ❓ Problèmes fréquents

**"supabase is not defined"**
→ Vérifiez que `.env.local` existe et contient les bonnes valeurs. Redémarrez `npm run dev`.

**"relation does not exist"**
→ Le SQL n'a pas été exécuté. Retournez à l'Étape 2.

**Les données ne s'affichent pas sur Vercel**
→ Vérifiez les Environment Variables sur Vercel (Étape 7, point 5).
