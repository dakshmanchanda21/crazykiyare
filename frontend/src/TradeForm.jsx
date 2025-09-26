// src/components/TradeForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ASSETS = [
  "BTC", "ETH", "USDT", "BNB", "XRP", "SOL", "ADA", "DOGE", "DOT", "TRX",
  "AVAX", "SHIB", "LINK", "MATIC", "LTC", "BCH", "XLM", "ATOM", "ETC", "HBAR",
  "ICP", "FIL", "APT", "ARB", "QNT", "GOLD", "SILVER", "OIL", "EUR", "USD"
];

const TradeForm = ({ onTrade }) => {
  const [userId, setUserId] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [asset, setAsset] = useState('BTC');
  const [quantity, setQuantity] = useState('');

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/buy', {
        user_id: userId,
        algorithm,
        asset,
        quantity: parseFloat(quantity)
      });
      alert(`Trade successful!\nc_id: ${res.data.c_id}`);
      onTrade();
      setUserId('');
      setQuantity('');
    } catch (err) {
      alert('Buy failed.');
    }
  };

  return (
    <form onSubmit={handleBuy} className="mb-4">
      <h4>Trade Crypto</h4>

      <div className="form-group">
        <label>User ID</label>
        <input
          type="text"
          className="form-control"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Asset</label>
        <select className="form-control" value={asset} onChange={(e) => setAsset(e.target.value)}>
          {ASSETS.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          className="form-control"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Algorithm</label>
        <select className="form-control" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="AES">AES</option>
          <option value="DES">DES</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary mt-3">Buy</button>
    </form>
  );
};

export default TradeForm;
