import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {RecallExecTimeScatterPlot} from '../components/RecallExecTimeScatterPlot'; // Import the component
import {RecallChart} from '../components/RecallChart';
import {ExecTimeChart} from '../components/ExecTimeChart';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


type Data = {
    execTime: number,
    recall: number,
    execTimes: number[],
    recalls: number[],
    latencies: number[]
};

const App: React.FC = () => {
    const [hnswData, setHnswData] = useState<Data | null>(null);
    const [pgvectorData, setPgvectorData] = useState<Data | null>(null);

    const fetchData = async () => {
        const hnswResponse = await fetch(`api/embedding`);
        const pgvectorResponse = await fetch(`api/vector`);
        const hnswData = await hnswResponse.json();
        const pgvectorData = await pgvectorResponse.json();
        setHnswData(hnswData);
        setPgvectorData(pgvectorData);
    };

    useEffect(() => {
        fetchData(); // fetch data initially when component mounts
    }, []);

    return (
      <>
          {hnswData && pgvectorData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                  <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>pg_embedding vs. pgvector performance using GIST-960 dataset 1M rows</h2>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ marginRight: '20px' }}>
                        <strong>pg_embedding:</strong><br />
                        Execution Time: {hnswData.execTime.toFixed(2)} ms<br />
                        Recall: {hnswData.recall.toFixed(3)}<br />
                        Average Latency: {(hnswData.latencies.reduce((a, b) => a + b, 0) / hnswData.latencies.length).toFixed(2)} ms
                    </div>
                    <div>
                        <strong>pgvector:</strong><br />
                        Execution Time: {pgvectorData.execTime.toFixed(2)} ms<br />
                        Recall: {pgvectorData.recall.toFixed(3)}<br />
                        Average Latency: {(pgvectorData.latencies.reduce((a, b) => a + b, 0) / pgvectorData.latencies.length).toFixed(2)} ms
                    </div>
                </div>


  
                  <div style={{ width: '100%', marginBottom: '20px' }}>
                      <ExecTimeChart hnswData={hnswData} pgvectorData={pgvectorData} />
                  </div>
                  <div style={{ width: '100%', marginBottom: '20px' }}>
                      <RecallChart hnswData={hnswData} pgvectorData={pgvectorData} />
                  </div>
                  <div style={{ width: '100%' }}>
                      <RecallExecTimeScatterPlot hnswData={hnswData} pgvectorData={pgvectorData} />
                  </div>
              </div>
          ) : (
              <div className="flex items-center justify-center min-h-screen">
                  <div className="text-xl">Loading...</div>
              </div>
          )}
      </>
  );
  
  
  
  
};

export default App;

