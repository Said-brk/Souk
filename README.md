# 🛒 Carreau Market MVP

Application de gestion simplifiée du marché de gros. Outil terrain pour grossistes, vendeurs et acheteurs.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+
- npm ou yarn
- Git (optionnel, pour le versionning)

### Installation

```bash
# 1. Cloner ou télécharger le projet
cd carreau-market

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env.local avec tes credentials Supabase
cp .env.local.example .env.local

# Puis éditer .env.local avec tes valeurs :
# VITE_SUPABASE_URL=https://cutlvohurcypanviwgaz.supabase.co
# VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Démarrer en développement

```bash
npm run dev
```

L'app s'ouvrira sur http://localhost:5173

### Build pour la production

```bash
npm run build
npm run preview
```

---

## 📱 Fonctionnalités du MVP

### 1. **Authentification**
- Inscription / Connexion simple
- Profil grossiste (nom, catégorie, téléphone)

### 2. **Ajouter un produit**
- Formulaire rapide (nom, quantité, unité, prix, deadline)
- Photo optionnelle
- **Générer une feuille de prix** à copier sur WhatsApp

### 3. **Carnet de commandes**
- Ajouter une commande rapidement
- Voir tous les clients qui ont commandé
- Changer le statut : Réservé → Retiré → Annulé

### 4. **Historique clients**
- Liste des clients réguliers
- Montant total dépensé par client
- Nombre de commandes
- Tri par montant ou nombre de commandes

### 5. **Bilan du jour**
- Encaissement du jour
- Statistiques rapides
- Historique des commandes retirée

---

## 🗄️ Structure Supabase

Les tables suivantes sont nécessaires (crées via SQL dans Supabase) :

```
- users (profil des grossistes)
- products (produits du jour)
- orders (commandes)
- daily_summaries (bilan du jour)
```

Pour les créer, va à **SQL Editor** dans Supabase et copie-colle le SQL fourni au départ.

---

## 🔧 Déploiement sur Vercel

### Étape 1 : Créer un repo GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/carreau-market.git
git push -u origin main
```

### Étape 2 : Connecter à Vercel
1. Va sur https://vercel.com/new
2. Sélectionne "Import Git Repository"
3. Ajoute ton repo GitHub
4. Ajoute tes variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique "Deploy"

C'est live! 🎉

---

## 📝 Variables d'environnement

Crée un fichier `.env.local` à la racine du projet :

```
VITE_SUPABASE_URL=https://cutlvohurcypanviwgaz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_F0CXtYvj-6b9LkH-ZXsyjA_VlZpbgnj
```

⚠️ **Attention** : Ceci sont des clés publiques (safe), mais ne commit jamais `.env.local` sur GitHub (c'est dans `.gitignore`).

---

## 🎨 Personnalisation

- **Couleurs** : Modifier `tailwind.config.js` (couleur `market`)
- **Logo** : Remplacer l'emoji 🛒 par ton logo
- **Noms** : Remplacer "Carreau Market" par ton nom d'app

---

## 🐛 Troubleshooting

### "Erreur Supabase URL et clé anon sont requis"
→ Vérifier que `.env.local` existe et contient les bonnes valeurs

### "Network error" au login
→ Vérifier que la connexion Internet fonctionne
→ Vérifier que Supabase est accessible

### Les produits n'apparaissent pas
→ S'assurer que les tables Supabase sont créées
→ Vérifier les permissions RLS dans Supabase

---

## 📞 Support

Si tu as des questions sur le code ou Supabase, pose-moi les questions directement.

---

## 📦 Stack tech
- **React** 18.2.0
- **Vite** 5.0
- **Supabase** (Backend as a Service)
- **Tailwind CSS** (Styling)
- **Vercel** (Hosting)

---

**Bon développement! 🚀**
