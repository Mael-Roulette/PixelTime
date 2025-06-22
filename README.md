# 🎩 PixelTime — Timeline sur le thème du jeu vidéo

**PixelTime** est un jeu en ligne inspiré du jeu de société **Timeline**, mais centré sur le **jeu vidéo**.

Le but ? Classer des événements vidéoludiques (sorties de jeux, inventions majeures…) dans le bon ordre chronologique. Le tout est enrichi de fonctionnalités sociales et d’un système de progression !

---

## 🧹 Fonctionnalités principales

### 🎮 Pour les joueurs

- 📚 **Catalogue de cartes** pour s’entraîner à classer les jeux par date
- 👤 **Profil joueur** avec :
  - Score général
  - Niveau débloqué
  - Argent virtuel accumulé
- 🔹 **Trois modes de jeu différents** pour varier les défis
- 🔐 Système de **réinitialisation de mot de passe**

### 🛠️ Pour les administrateurs

- 👥 Suppression et gestion des utilisateurs
- 🃏 Visualisation et ajout de cartes depuis une interface dédiée
- 📈 Visualisation des niveaux et du nombre de joueurs dans chaque niveau

---

## ⚙️ Stack technique

- **Frontend** : React + i18next (traduction)
- **Backend** : Symfony + Doctrine ORM
- **Base de données** : MySQL
- **Authentification** : JWT
- **Email** : Symfony Mailer

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/pixeltime.git
cd pixeltime
```

### 2. Backend (Symfony)

```bash
cd backend
composer install
mkdir config/jwt
php bin/console lexik:jwt:generate-keypair
```

Crée un fichier `.env.local` avec ta configuration :

```dotenv
DATABASE_URL="mysql://user:password@127.0.0.1:3306/pixeltime"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=pixeltime
```

Puis :

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 3. Frontend (React)

```bash
cd frontend
npm install
```

Pour lancer le frontend :

```bash
npm start
```
