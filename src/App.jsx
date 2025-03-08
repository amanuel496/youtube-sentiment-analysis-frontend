import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import './index.css';

/**
 * YouTube Sentiment Analysis App
 * Allows users to run an ETL pipeline on YouTube comments for sentiment analysis.
 */
export default function App() {
  const [videoId, setVideoId] = useState('');
  const [outputFormat, setOutputFormat] = useState('json');
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const handleSubmit = async () => {
    if (!videoId) {
        alert('Please enter a YouTube video ID.');
        return;
    }
    setIsLoading(true);
    setResultMessage('');

    try {
        const url = `${import.meta.env.VITE_API_URL}/run-etl?videoId=${videoId}&outputFormat=${outputFormat}`;
        console.log('API Call URL:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            setResultMessage(`Success: ETL completed. Output saved to: ${data.output_file}`);
        } else {
            setResultMessage(`Error: ${data.error}. Response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        setResultMessage(`Failed to execute ETL pipeline. Error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="bg-card">
      <h2>YouTube Sentiment Analysis</h2>

      <input
        type="text"
        placeholder="Enter YouTube video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
      />

      <select
        onChange={(e) => setOutputFormat(e.target.value)}
        defaultValue="json"
      >
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Run ETL Pipeline'}
      </button>

      {resultMessage && (
        <p>{resultMessage}</p>
      )}
    </div>
  );
}