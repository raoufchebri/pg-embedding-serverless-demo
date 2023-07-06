import { ChartProps } from "@/types";
import { createHistogramData } from "@/utils";
import { Bar } from 'react-chartjs-2';

const execTimeOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: false,
        },
    },
};

const ExecTimeChart: React.FC<ChartProps> = ({ hnswData, pgvectorData }) => {
    const binWidth = 10; // You can adjust this value
    const minValue = 0;
    // const maxExecTime = Math.max(
    //     ...hnswData.execTimes,
    //     ...pgvectorData.execTimes
    // );
    const maxExecTime = 1000;
    const maxValue = Math.ceil(maxExecTime / binWidth) * binWidth;

    const hnswHistogramData = createHistogramData(hnswData.execTimes, binWidth, minValue, maxValue, true);
    const pgvectorHistogramData = createHistogramData(pgvectorData.execTimes, binWidth, minValue, maxValue, true);
    

    const chartData = {
        labels: hnswHistogramData.labels,
        datasets: [
            {
                label: 'pg_embedding',
                data: hnswHistogramData.bins,
                backgroundColor: 'rgba(53, 162, 235, 1)',
            },
            {
                label: 'pgVector',
                data: pgvectorHistogramData.bins,
                backgroundColor: 'rgba(255, 99, 132, 1)',
            }
        ],
    };

    return (
        <div>
            <h2>Execution Time Distribution</h2>
            <Bar options={execTimeOptions} data={chartData} />
        </div>
    );
};

export default ExecTimeChart;