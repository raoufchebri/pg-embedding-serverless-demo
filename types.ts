
export type Data = {
    execTime: number,
    recall: number,
    execTimes: number[],
    recalls: number[],
    latencies: number[]
};

export type ChartProps = {
    hnswData: Data,
    pgvectorData?: Data
    pineconeData: Data
};
