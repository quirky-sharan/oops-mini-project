import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function MyBorrows() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBorrows();
  }, []);

  const fetchMyBorrows = async () => {
    try {
      const res = await api.get(`/transactions/member/${user.userId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeBorrows = transactions.filter(t => t.status !== 'RETURNED');
  const pastBorrows = transactions.filter(t => t.status === 'RETURNED');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">My Borrows</h1>
          <p className="text-text-secondary mt-1">Track your active and past book borrowings</p>
        </div>
        <button onClick={() => navigate('/books')} className="btn-primary">Browse Books</button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-primary pb-2 border-b border-border">Active Borrows</h2>
        {activeBorrows.length === 0 ? (
          <div className="glass-card p-8 text-center text-text-secondary">
            You don't have any books currently borrowed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeBorrows.map(tx => (
              <div key={tx.id} className="glass-card p-6 flex flex-col h-full border-l-4 border-l-accent">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-text-secondary">{tx.id}</span>
                  <span className={`badge ${tx.status === 'OVERDUE' ? 'badge-danger' : 'badge-info'}`}>
                    {tx.status}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold mb-1 text-primary">{tx.bookId}</h3>
                <div className="mt-auto pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Issued:</span>
                    <span className="text-primary">{tx.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Due date:</span>
                    <span className={`font-medium ${tx.status === 'OVERDUE' ? 'text-danger' : 'text-warning'}`}>{tx.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-primary pb-2 border-b border-border mt-8">Past Borrows</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/50 text-text-secondary text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Book ID</th>
                <th className="px-6 py-4 font-medium">Issued On</th>
                <th className="px-6 py-4 font-medium">Returned On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pastBorrows.map((tx) => (
                <tr key={tx.id} className="hover:bg-border/10 transition-colors text-sm">
                  <td className="px-6 py-4 text-primary font-medium">{tx.bookId}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.issueDate}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.returnDate}</td>
                </tr>
              ))}
              {pastBorrows.length === 0 && (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-text-secondary">No reading history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
