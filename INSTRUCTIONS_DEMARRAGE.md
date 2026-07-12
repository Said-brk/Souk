# 🚀 Instructions de démarrage - Carreau Market

## Étape 1 : Télécharger/Cloner le projet

Télécharge tous les fichiers du projet. Tu dois avoir une structure comme ça :

```
carreau-market/
├── src/
│   ├── components/
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddProduct.jsx
│   │   ├── OrderBook.jsx
│   │   ├── ClientHistory.jsx
│   │   └── DailySummary.jsx
│   ├── services/
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.local.example
├── vercel.json
├── .gitignore
├── README.md
└── INSTRUCTIONS_DEMARRAGE.md
```

## Étape 2 : Créer le fichier .env.local

1. Crée un fichier `.env.local` à la racine du projet (copie `.env.local.example`)
2. Remplis-le avec tes credentials Supabase :

```
VITE_SUPABASE_URL=https://cutlvohurcypanviwgaz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_F0CXtYvj-6b9LkH-ZXsyjA_VlZpbgnj
```

## Étape 3 : Installer les dépendances

Ouvre un terminal à la racine du projet et tape :

```bash
npm install
```

Cela va télécharger React, Supabase, Tailwind, etc. (ça peut prendre 2-3 min)

## Étape 4 : Démarrer l'app en développement

```bash
npm run dev
```

L'app devrait s'ouvrir automatiquement sur http://localhost:5173

Si ça ne s'ouvre pas, copie-colle l'URL dans ton navigateur.

## Étape 5 : Tester l'app

### 1. Créer un compte
- Clique sur "Pas encore de compte ? S'inscrire"
- Remplis les champs :
  - Email : un email (ex: test@test.com)
  - Mot de passe : au moins 6 caractères
  - Nom du grossiste : ton nom
  - Téléphone : optionnel
  - Catégorie : sélectionne une catégorie
- Clique "S'inscrire"

### 2. Ajouter un produit
- Tu arrives au Dashboard
- Clique sur l'onglet "➕ Ajouter produit"
- Remplis le formulaire :
  - Produit : "Tomate"
  - Quantité : 80
  - Unité : "kg"
  - Prix : 7.50
  - Heure limite : 11:00
- Clique "Ajouter le produit"

### 3. Générer la feuille de prix
- Clique "📋 Générer ma feuille de prix"
- Ça copie la feuille au clipboard
- Tu peux la coller n'importe où (WhatsApp, Notes, etc.)

### 4. Ajouter une commande
- Va à l'onglet "📋 Commandes"
- Clique "➕ Nouvelle commande"
- Sélectionne le produit, le client, la quantité
- Clique "Ajouter la commande"

### 5. Changer le statut
- La commande apparaît dans la liste
- Clique "✓ Retiré" pour marquer comme retirée

### 6. Voir l'historique clients
- Va à l'onglet "👥 Clients"
- Tu vois tous tes clients avec le montant dépensé

### 7. Bilan du jour
- Va à l'onglet "📊 Bilan du jour"
- Rentre le montant encaissé
- Clique "Enregistrer le bilan"

## Étape 6 (Optionnel) : Ouvrir dans Claude Code Desktop

Si tu veux travailler avec Claude Code Desktop :

1. Ouvre Claude Code Desktop
2. File → Open Folder
3. Sélectionne le dossier `carreau-market`
4. Tu peux maintenant éditer les fichiers dans Claude Code et itérer avec moi

## Étape 7 (Optionnel) : Déployer sur Vercel

Une fois que tu es content du MVP, tu peux le mettre en ligne :

1. Crée un repo GitHub (voir README.md)
2. Va sur https://vercel.com
3. Connecte ton repo GitHub
4. Ajoute les variables d'environnement
5. Deploy!

---

## 🐛 Si ça ne marche pas

### Erreur "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### Erreur "Cannot read property 'supabaseUrl' of undefined"
→ Vérifier que .env.local existe et a les bonnes valeurs

### L'app charge mais ne se connecte pas à Supabase
→ Vérifier que tes credentials Supabase sont correctes

### Questions?
Pose-moi les questions, on debuggera ensemble!

---

**Tu es prêt? Commence par l'Étape 1! 🚀**
