// src/components/TradeTable.jsx
import React from 'react';
import axios from 'axios';

const TradeTable = ({ title, trades, showSell, onSell }) => {
  const handleSell = async (c_id) => {
    try {
      await axios.post('http://localhost:5000/sell', { c_id });
      alert('Sold successfully!');
      onSell();
    } catch {
      alert('Sell failed.');
    }
  };

  return (
    <div className="mt-4">
      <h5>{title}</h5>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>c_id</th>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Algorithm</th>
            <th>Timestamp</th>
            {showSell && <th>Action</th>}
            {!showSell && <th>Decrypted</th>}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i}>
              <td>{t.c_id}</td>
              <td>{t.asset}</td>
              <td>{t.quantity}</td>
              <td>{t.algorithm}</td>
              <td>{new Date(t.timestamp).toLocaleString()}</td>
              {showSell ? (
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleSell(t.c_id)}>
                    Sell
                  </button>
                </td>
              ) : (
                <td>{t.decrypted}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;
