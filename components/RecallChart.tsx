import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { createHistogramData } from '@/utils';
import { ChartProps } from '@/types';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const recallOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: false,
        },
    },
};

export const RecallChart: React.FC<ChartProps> = ({ hnswData, pgvectorData }) => {
    const binWidth = 0.02; // You can adjust this value
    const minValue = 0;
    const maxValue = 1.0; // max recall value is 1.0

    const hnswHistogramData = createHistogramData(hnswData.recalls, binWidth, minValue, maxValue);
    const pgvectorHistogramData = createHistogramData(pgvectorData.recalls, binWidth, minValue, maxValue);

    const chartData = {
        labels: hnswHistogramData.labels,
        datasets: [
            {
                label: 'pg_embedding',
                data: hnswHistogramData.bins,
                backgroundColor: 'rgba(240, 240, 117, 1)',
            },
            {
                label: 'pgvector',
                data: pgvectorHistogramData.bins,
                backgroundColor: 'rgba(0, 229, 153, 1)',
            }
        ],
    };

    return (
        <div>
            <h2>Recall Distribution</h2>
            <Bar options={recallOptions} data={chartData} />
        </div>
    );
};