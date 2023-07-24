// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { neon, neonConfig } from '@neondatabase/serverless'
import resultData from '../../naive_results.json'
import testSet from '../../test_set.json'

type Data = {
  numCpus: string
}

type IndexType = keyof typeof resultData;

neonConfig.fetchConnectionCache = true;
const sql = neon(
  process.env.VECTOR_DATABASE_URL!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const rows = await sql(`SELECT num_cpus();`);

  res.status(200).json({ numCpus: rows[0]['num_cpus']})
}
