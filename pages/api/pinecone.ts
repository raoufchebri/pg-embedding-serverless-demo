// pinecone.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
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

const url = process.env.PINECONE_URL ?? '';
const apiKey = process.env.PINECONE_API_KEY ?? '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query)
  const limit = parseInt(req.query.limit as string) || 100
  const testLimit = parseInt(req.query.testLimit as string) || 10

  console.log(`Running test with limit ${limit} and testLimit ${testLimit}`)

  const testVectors = testSet.slice(0, testLimit)

  const recalls = []
  const execTimes = []
  const latencies = []

  for (let i = 0; i < testVectors.length; i++) {

    console.log(`Running test ${i + 1} of ${testVectors.length}`)

    const vector = testVectors[i]

    const startTime = new Date().getTime();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify({
        "vector": vector,
        "topK": limit,
        "includeMetadata": true,
        "includeValues": true,
        "namespace": "p"
      })
    })

    const endTime = new Date().getTime();

    latencies.push(endTime - startTime);

    const { matches } = await response.json()

    const searchRows = matches.map(({_id}: {_id: string}) => _id)

    const index: IndexType = i.toString() as keyof typeof resultData || '0'

    const resultIds = resultData[index].slice(0, limit)

    recalls.push(searchRows.filter((id: string) => resultIds.includes(id)).length / limit)
    execTimes.push(endTime - startTime)
  }

  const recall = recalls.reduce((a, b) => a + b, 0) / recalls.length
  const execTime = latencies.reduce((a, b) => a + b, 0) / latencies.length


  res.status(200).json({ execTime, recall, recalls, execTimes: latencies, latencies })
}
