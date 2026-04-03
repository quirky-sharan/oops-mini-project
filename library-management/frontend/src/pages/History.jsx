import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SearchBar from '../components/SearchBar';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(tx => {
    const matchSearch = tx.bookId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        tx.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tx.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? tx.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Transaction History</h1>
          <p className="text-text-secondary mt-1">Full log of all library circulation</p>
        </div>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search by Tx ID, Book ID, or Member ID..." 
          />
        </div>
        <select 
          className="input-field md:w-48"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/50 text-text-secondary text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Tx ID</th>
                <th className="px-6 py-4 font-medium">Book ID</th>
                <th className="px-6 py-4 font-medium">Member ID</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Return Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-border/10 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                  <td className="px-6 py-4 text-primary font-medium">{tx.bookId}</td>
                  <td className="px-6 py-4 text-text-primary">{tx.memberId}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.issueDate}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.dueDate}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.returnDate || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${tx.status === 'ACTIVE' ? 'badge-info' : tx.status === 'OVERDUE' ? 'badge-danger' : 'badge-success'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-text-secondary">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
