# Vidzo Movies

Attractive movie discovery website built with React, Vite, Express, and MongoDB.

## Features

- Search by title, actor, platform, language, genre, and year
- Trending catalog with poster cards and detail preview
- Genre, year, quality, and type filters
- Watchlist interaction in the UI
- Express API backed by MongoDB with local demo fallback
- Seed script for starter movie data

## Setup

```bash
npm install
copy .env.example .env
```

Update `.env` if you use MongoDB Atlas:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER/vidzo
```

For local MongoDB, keep:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/vidzo
```

## Seed MongoDB

Start MongoDB first, then run:

```bash
npm run seed
```

## Run

Open two terminals:

```bash
npm run server
```

```bash
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:4000/api/movies`
