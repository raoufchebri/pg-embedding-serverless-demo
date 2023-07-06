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

## Run autoscaling test
Run the following command:
```
pgbench -f test.sql -c 64 -T 10000 -P 1 <DATABASE_DIRECT_URL>
```
You will see sth like this (~8 TPS) if the maximum number of CU was 8.
```
progress: 40.0 s, 8.0 tps, lat 1832.261 ms stddev 27.660
progress: 41.0 s, 2.0 tps, lat 1823.852 ms stddev 16.804
progress: 42.0 s, 6.0 tps, lat 1858.655 ms stddev 32.797
progress: 43.0 s, 5.0 tps, lat 1806.463 ms stddev 32.330
progress: 44.0 s, 3.0 tps, lat 1853.339 ms stddev 15.384
progress: 45.0 s, 6.0 tps, lat 1813.598 ms stddev 52.211
progress: 46.0 s, 2.0 tps, lat 1859.142 ms stddev 13.280
progress: 47.0 s, 8.0 tps, lat 1869.698 ms stddev 50.031
```