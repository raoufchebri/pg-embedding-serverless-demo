# pg_embedding vs. pgvector
This app compares `pg_embedding` and `pgvector` extensions for Postgres.
This app uses `pg_embedding` index `HNSW`, and `pgvector` index `IVFFlat.

## Getting started
1. Install dependencies
```
npm install
```

2. Create a `.env.local` file:
```
touch .env.local
```

3. Add your DATABASE_URL to `.env.local`

## Run the app
```
npm run dev
```