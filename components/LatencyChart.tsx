import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartProps } from "@/types";

import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);


const latencyOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Latency Chart',
        },
    },
};

export const LatencyChart: React.FC<ChartProps> = ({ hnswData, pgvectorData }) => {
    const labels = hnswData.latencies.map((_, index) => `Latency ${index + 1}`);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'pg_embedding',
                data: hnswData.latencies,
                borderColor: 'rgba(240, 240, 117, 1)',
                backgroundColor: 'rgba(240, 240, 117, 0.5)',
                fill: false,
            },
            {
                label: 'pgvector',
                data: pgvectorData.latencies,
                borderColor: 'rgba(0, 229, 153, 1)',
                backgroundColor: 'rgba(0, 229, 153, 0.5)',
                fill: false,
            }
        ],
    };

    return (
        <div>
            <h2>Latency Chart</h2>
            <Line options={latencyOptions} data={chartData} />
        </div>
    );
};
