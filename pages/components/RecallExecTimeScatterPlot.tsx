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

const options: {
  scales: {
    y: {
      type: 'linear',
    },
    x: {
      type: 'linear',
      beginAtZero: true,
    },
  },
} = {
  scales: {
    y: {
      type: 'linear',
    },
    x: {
      type: 'linear',
      beginAtZero: true,
    },
  },
};


const RecallExecTimeScatterPlot: React.FC<RecallExecTimeScatterPlotProps> = ({
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
        backgroundColor: 'rgba(53, 162, 235, 1)',
        pointRadius: 10
    },
    {
        label: 'pgvector',
        data: pgvectorData.execTimes.map((execTime, index) => ({
            x: pgvectorData.recalls[index],
            y: execTime,
        })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 10
      },
    ],
  };

  return <Scatter options={options} data={data} />;
};

export default RecallExecTimeScatterPlot;
