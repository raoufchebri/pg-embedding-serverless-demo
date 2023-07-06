import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

type Data = {
    execTime: number,
    recall: number,
    execTimes: number[],
    recalls: number[]
};

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type RecallExecTimeScatterPlotProps = {
  hnswData: Data;
  pgvectorData: Data;
};

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};


export const RecallExecTimeScatterPlot: React.FC<RecallExecTimeScatterPlotProps> = ({
  hnswData,
  pgvectorData,
}) => {
  const data = {
    datasets: [
      {
        label: 'pg_embedding',
        data: hnswData.execTimes.map((execTime, index) => ({
          x: hnswData.recalls[index],
          y: execTime,
        })),
        backgroundColor: 'rgba(240, 240, 117, 1)',
        pointRadius: 10
    },
    {
        label: 'pgvector',
        data: pgvectorData.execTimes.map((execTime, index) => ({
            x: pgvectorData.recalls[index],
            y: execTime,
        })),
        backgroundColor: 'rgba(0, 229, 153, 1)',
        pointRadius: 10
      },
    ],
  };

  return <Scatter options={options} data={data} />;
};