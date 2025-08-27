'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [playerData, setPlayerData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [battlesData, setBattlesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    
    try {
      const tag = 'U9UUCCQ';
      
      // Fetch all data
      const [playerRes, summaryRes, battlesRes] = await Promise.all([
        fetch(`/api/player/${tag}`),
        fetch(`/api/player/${tag}/summary?last=20`),
        fetch(`/api/player/${tag}/battles?last=20`)
      ]);

      if (!playerRes.ok) {
        throw new Error(`Player API error: ${playerRes.status} - ${await playerRes.text()}`);
      }
      if (!summaryRes.ok) {
        throw new Error(`Summary API error: ${summaryRes.status} - ${await summaryRes.text()}`);
      }
      if (!battlesRes.ok) {
        throw new Error(`Battles API error: ${battlesRes.status} - ${await battlesRes.text()}`);
      }

      const player = await playerRes.json();
      const summary = await summaryRes.json();
      const battles = await battlesRes.json();

      setPlayerData(player);
      setSummaryData(summary);
      setBattlesData(battles);

      console.log('Player Data:', player);
      console.log('Summary Data:', summary);
      console.log('Battles Data:', battles);

    } catch (err: any) {
      setError(err.message);
      console.error('Debug error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Debug API Data</h1>
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-royal text-white rounded-lg mb-6 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Data for U9UUCCQ'}
        </button>

        {error && (
          <div className="bg-rose-900/20 border border-rose-900/50 rounded-lg p-4 mb-6">
            <h2 className="text-rose-400 font-bold mb-2">Error:</h2>
            <pre className="text-rose-300 text-sm">{error}</pre>
          </div>
        )}

        {playerData && (
          <div className="bg-card-dark border border-border-dark rounded-lg p-4 mb-6">
            <h2 className="text-white font-bold mb-2">Player Data:</h2>
            <pre className="text-gray-300 text-xs overflow-auto">
              {JSON.stringify(playerData, null, 2)}
            </pre>
          </div>
        )}

        {summaryData && (
          <div className="bg-card-dark border border-border-dark rounded-lg p-4 mb-6">
            <h2 className="text-white font-bold mb-2">Summary Data:</h2>
            <pre className="text-gray-300 text-xs overflow-auto">
              {JSON.stringify(summaryData, null, 2)}
            </pre>
          </div>
        )}

        {battlesData && (
          <div className="bg-card-dark border border-border-dark rounded-lg p-4 mb-6">
            <h2 className="text-white font-bold mb-2">Battles Data (first 3):</h2>
            <pre className="text-gray-300 text-xs overflow-auto">
              {JSON.stringify(battlesData.slice(0, 3), null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-card-dark border border-border-dark rounded-lg p-4">
          <h2 className="text-white font-bold mb-2">Expected vs Actual Comparison:</h2>
          <div className="text-gray-300 text-sm space-y-2">
            <p><strong>StatsRoyale URL:</strong> https://statsroyale.com/br/profile/U9UUCCQ</p>
            <p><strong>Our API:</strong> /api/player/U9UUCCQ</p>
            <p><strong>Check for:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Player name, tag, trophies</li>
              <li>Arena information</li>
              <li>Win/loss counts</li>
              <li>Battle history accuracy</li>
              <li>Trophy changes in battles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}