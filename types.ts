
export type Data = {
    execTime: number,
    recall: number,
    execTimes: number[],
    recalls: number[]
};

export type ChartProps = {
    hnswData: Data,
    pgvectorData: Data
};
