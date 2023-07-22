import React, { useEffect, useState, useRef } from 'react';
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
import { LatencyChart } from '@/components/LatencyChart';


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
    // const [pgvectorData, setPgvectorData] = useState<Data | null>(null);
    const [pineconeData, setPineconeData] = useState<Data | null>(null);
    const [cpuData, setCpuData] = useState<number | null>(null);

    console.log(hnswData);
    console.log(pineconeData);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async () => {
        const hnswResponse = await fetch(`/api/embedding`);
        // const pgvectorResponse = await fetch(`/api/vector`);
        const pineconeResponse = await fetch(`/api/pinecone`);

        const hnswData = await hnswResponse.json();
        // const pgvectorData = await pgvectorResponse.json();
        const pineconeData = await pineconeResponse.json();

        setHnswData(hnswData);
        // setPgvectorData(pgvectorData);
        setPineconeData(pineconeData);
    };

    const fetchCpuData = async () => {
        const response = await fetch('/api/cpu');
        const data = await response.json();
        setCpuData(data.numCpus);
    };

    useEffect(() => {
        fetchData(); // fetch data initially when component mounts

        // Fetch CPU data every second
        intervalRef.current = setInterval(() => {
            fetchCpuData();
        }, 1000);

        // Cleanup the setInterval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
      <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                  <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>pg_embedding vs. pgvector performance using GIST-960 dataset 1M rows</h2>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ marginRight: '20px' }}>
                        <strong>pg_embedding:</strong><br />
                        Execution Time: {hnswData && hnswData.execTime.toFixed(2)} ms<br />
                        Recall: {hnswData && hnswData.recall.toFixed(3)}<br />
                        Average Latency: {hnswData && (hnswData.latencies.reduce((a, b) => a + b, 0) / hnswData.latencies.length).toFixed(2)} ms
                    </div>
                    {/* <div>
                        <strong>pgvector:</strong><br />
                        Execution Time: {pgvectorData && pgvectorData.execTime.toFixed(2)} ms<br />
                        Recall: {pgvectorData && pgvectorData.recall.toFixed(3)}<br />
                        Average Latency: {pgvectorData && (pgvectorData.latencies.reduce((a, b) => a + b, 0) / pgvectorData.latencies.length).toFixed(2)} ms
                    </div> */}
                    <div>
                        <strong>Pinecone:</strong><br />
                        Execution Time: N/A<br />
                        Recall: {pineconeData && pineconeData.recall.toFixed(3)}<br />
                        Average Latency: {pineconeData && (pineconeData.latencies.reduce((a, b) => a + b, 0) / pineconeData.latencies.length).toFixed(2)} ms
                    </div>
                    {cpuData !== null && (
                        <div style={{ marginLeft: '20px' }}>
                            <strong>Number of CPUs:</strong><br />
                            {cpuData}
                        </div>
                    )}
                </div>
                {hnswData && pineconeData ? (
                    <>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <LatencyChart hnswData={hnswData} pgvectorData={pineconeData} />
                        </div>
                        {/* <div style={{ width: '100%', marginBottom: '20px' }}>
                            <ExecTimeChart hnswData={hnswData} pgvectorData={pgvectorData} />
                        </div>
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <RecallChart hnswData={hnswData} pgvectorData={pgvectorData} />
                        </div>
                        <div style={{ width: '100%' }}>
                            <RecallExecTimeScatterPlot hnswData={hnswData} pgvectorData={pgvectorData} />
                        </div> */}
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-xl">Loading...</div>
                    </div>
                )}
          </div>
      </>
  );
  
  
  
  
};

export default App;

