# Nullify  
Your personal music streaming & social experience, built with the modern **MERN** stack.

<p align="center">
  <img src="./frontend/public/spotify.png" alt="Nullify logo" width="120" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/dubstabber/nullify?style=for-the-badge" />
  <img src="https://img.shields.io/github/last-commit/dubstabber/nullify?style=for-the-badge" />
</p>

---

## ✨ Demo

Live demo: **https://nullify-pj97.onrender.com** 

---

## Table of contents
1. [About the project](#about-the-project)
2. [Key features](#key-features)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Local setup](#local-setup)
6. [Running tests](#running-tests)
7. [Folder structure](#folder-structure)
8. [Environment variables](#environment-variables)
9. [Roadmap](#roadmap)
10. [License](#license)

---

## About the project
`Nullify` is a full-stack Spotify-inspired application that lets users **stream music, chat in real-time and manage a library of songs & albums**.  
The goal of this project is to showcase production-ready code, modern tooling and clean UI/UX – while keeping the stack lean and developer-friendly.

---

## Key features

### 🎧 End-user experience
* Responsive, accessible UI built with **React + Tailwind CSS**
* Sign-in & sign-up via **OAuth / SSO** powered by **Clerk**
* Discover music: _Featured_, _Trending_ and _Made For You_ sections
* Seamless playback queue with play / pause / skip controls
* View album details & track lists
* Dark theme that mirrors the original Spotify look & feel

### 💬 Social layer
* **Socket.io** powered real-time chat
* Online / offline presence & live activity updates ( _Typing…_ , _Listening…_ etc.)

### 🛡️ Authentication & authorization
* Secure session management via Clerk JWTs
* Role-based access – email-gated **Admin** role

### 🛠️ Admin dashboard
* CRUD operations for songs & albums (file uploads handled by **Cloudinary**)
* At-a-glance statistics: total songs, albums, artists & registered users

### 📈 DevX / Ops
* Fully-typed codebase ( **TypeScript** front-end, **ESM** back-end )
* **Vitest + React Testing Library** on the front-end, **Jest + Supertest + Mongo-Memory-Server** on the back-end
* 100% lint & format coverage ( **ESLint**, **Prettier** )
* Ready for one-click deploy to **Vercel** (front-end) & **Render / Railway** (back-end)

---

## Tech stack

| Layer              | Tech                                                     |
| ------------------ | -------------------------------------------------------- |
| Front-end          | React • Vite • TypeScript • Zustand • Tailwind CSS       |
| Back-end           | Node.js • Express • Socket.io • Mongoose (MongoDB)       |
| Auth               | Clerk (OAuth & JWT)                                      |
| Storage / CDN      | Cloudinary (image & audio uploads)                       |
| Testing            | Vitest • Jest • Supertest                                |
| Tooling            | ESLint • Prettier • Husky • Lint-staged                  |


> The **monorepo** is divided into two top-level folders: `frontend/` and `backend/` – each can run & deploy independently.

---

## Local setup

### Prerequisites
* Node.js ≥ 18
* PNPM / NPM ≥ 9
* Docker (optional – for MongoDB)

### 1️⃣ Clone & install
```bash
$ git clone https://github.com/dubstabber/nullify.git && cd nullify
# install root deps + workspaces
$ npm install
```

### 2️⃣ Configure environment variables
Create **two** files based on the samples below.

`backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nullify
ADMIN_EMAIL=your.email@example.com
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLERK_SECRET_KEY=xxx
NODE_ENV=development
```

`frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=xxx
```

### 3️⃣ Seed example data (optional)
```bash
# in a separate terminal
$ npm run seed:albums --prefix backend   # seeds albums
$ npm run seed:songs  --prefix backend   # seeds songs
```

### 4️⃣ Start dev servers
```bash
$ npm run dev     --prefix backend   # http://localhost:5000
$ npm run dev     --prefix frontend  # http://localhost:3000
```

### 5️⃣ Open your browser
Visit **http://localhost:3000** and sign-in with Google OAuth provider.  
The first account whose email matches `ADMIN_EMAIL` automatically gets admin privileges.

---

## Running tests

```bash
# Front-end (Vitest)
$ npm test --prefix frontend

# Back-end (Jest)
$ npm test --prefix backend
```

Test coverage reports are generated in `coverage/` folders.

---

## Folder structure

```text
├─ backend/           # Express API & Socket.io server
│  ├─ src/
│  │  ├─ controller/
│  │  ├─ routes/
│  │  ├─ models/
│  │  ├─ middleware/
│  │  ├─ lib/        # Cloudinary, DB & Socket helpers
│  │  └─ index.js
│  └─ tests/         # Jest + Supertest suites
│
├─ frontend/          # React client
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ components/
│  │  ├─ stores/     # Zustand stores
│  │  ├─ lib/        # Axios, utilities
│  │  └─ index.css   # Tailwind entry
│  └─ vitest.config.ts
│
└─ README.md
```

---

## Environment variables

| Variable | Description |
| -------- | ----------- |
| `PORT` | Port on which Express listens |
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_EMAIL` | Email granted admin role |
| `CLOUDINARY_*` | Cloudinary credentials for media uploads |
| `CLERK_SECRET_KEY` | Clerk backend API key |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |