// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { neon, neonConfig } from '@neondatabase/serverless'
import resultData from '../../naive_results.json'
import testSet from '../../test_set.json'

type Data = {
  execTime: number,
  recall: number,
  execTimes: number[],
  recalls: number[],
  latencies: number[]
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
  console.log(req.query)
  // extract limit from request and parse it to int
  const limit = parseInt(req.query.limit as string) || 100
  // extract test limit from request and parse it to int
  const testLimit = parseInt(req.query.testLimit as string) || 10

  console.log(`Running test with limit ${limit} and testLimit ${testLimit}`)

  // extract 10 first vectors from test_set.json. test_set.json contains array of arrays of numbers
  const testVectors = testSet.slice(0, testLimit)

  const recalls = []
  const execTimes = []
  const latencies = []

  for (let i = 0; i < testVectors.length; i++) {

    console.log(`Running test ${i + 1} of ${testVectors.length}`)

    const vector = testVectors[i]

    // set enable_seqscan to off
    sql('SET enable_seqscan = off;')
    sql('SET ivfflat.probes = 100;')
    const searchQuery = `SELECT _id from documents order by openai_vector <-> '[${vector}]' LIMIT ${limit}`
    
    // run explain analyze query
    const explainAnalayzeSearchQuery = `EXPLAIN ANALYZE ${searchQuery}`
    const rows = await sql(explainAnalayzeSearchQuery)
    const execTime = rows[rows.length - 1]['QUERY PLAN'].split(' ')[2]

    // run search query
    const startTime = new Date().getTime();
    const searchRows  = await sql(searchQuery)
    const endTime = new Date().getTime();

    latencies.push(endTime - startTime);


    // create index of type index is object.keys(resultData) and it is string array
    const index: IndexType = i.toString() as keyof typeof resultData || '0'

    const resultIds = resultData[index].slice(0, limit)

    recalls.push(searchRows.filter((row) => resultIds.includes(row._id)).length / limit)
    execTimes.push(execTime)
  }

  const recall = recalls.reduce((a, b) => a + b, 0) / recalls.length
  const execTime = execTimes.reduce((a, b) => a + parseFloat(b), 0) / execTimes.length

  res.status(200).json({ execTime, recall, recalls, execTimes, latencies })
}
