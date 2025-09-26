// src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TradeForm from './TradeForm';
import TradeTable from './TradeTable';

const App = () => {
  const [activeTrades, setActiveTrades] = useState([]);
  const [cachedTrades, setCachedTrades] = useState([]);

  const fetchAllTrades = async () => {
    try {
      const [active, cached] = await Promise.all([
        axios.get('http://localhost:5000/active'),
        axios.get('http://localhost:5000/cache'),
      ]);
      setActiveTrades(active.data);
      setCachedTrades(cached.data);
    } catch (err) {
      alert('Failed to load trades');
    }
  };

  useEffect(() => {
    fetchAllTrades();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">💱 Crypto Trading Interface</h2>
      <TradeForm onTrade={fetchAllTrades} />
      <TradeTable title="📈 Active Trades" trades={activeTrades} showSell={true} onSell={fetchAllTrades} />
      <TradeTable title="📦 Cached (Sold) Trades" trades={cachedTrades} showSell={false} />
    </div>
  );
};

export default App;
