import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Fines() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const url = isAdmin ? '/fines' : `/fines/member/${user.userId}`;
      const res = await api.get(url);
      setFines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    if (!window.confirm("Confirm payment receipt corresponding to this fine?")) return;
    setProcessing(id);
    try {
      await api.post(`/fines/pay/${id}`);
      fetchFines();
    } catch (err) {
      alert("Failed to process payment");
    } finally {
      setProcessing(null);
    }
  };

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      await api.post('/fines/calculate');
      fetchFines();
    } catch (err) {
      alert("Failed to calculate fines");
      setLoading(false);
    }
  };

  const pendingAmount = fines.filter(f => f.status === 'PENDING').reduce((s, f) => s + parseFloat(f.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Fines & Penalties</h1>
          <p className="text-text-secondary mt-1">{isAdmin ? "Manage outstanding payments" : "Your outstanding late fees"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 border-danger/30 text-danger font-medium flex items-center gap-2">
            Total Pending: <span className="text-xl">₹{pendingAmount.toFixed(2)}</span>
          </div>
          {isAdmin && (
            <button onClick={handleRecalculate} className="btn-outline">Recalculate All</button>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/50 text-text-secondary text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Fine ID</th>
                <th className="px-6 py-4 font-medium">Tx ID</th>
                {isAdmin && <th className="px-6 py-4 font-medium">Member</th>}
                <th className="px-6 py-4 font-medium">Calculated On</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : fines.map(fine => (
                <tr key={fine.id} className="hover:bg-border/10 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary">{fine.id}</td>
                  <td className="px-6 py-4 font-mono text-xs">{fine.transactionId}</td>
                  {isAdmin && <td className="px-6 py-4">{fine.memberId}</td>}
                  <td className="px-6 py-4 text-text-secondary">{fine.calculatedDate}</td>
                  <td className="px-6 py-4 font-mono font-medium text-primary">₹{parseFloat(fine.amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${fine.status === 'PENDING' ? 'badge-danger' : 'badge-success'}`}>{fine.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fine.status === 'PENDING' && (
                      <button 
                        onClick={() => handlePay(fine.id)}
                        disabled={processing === fine.id}
                        className="btn-primary py-1 px-3 text-xs"
                      >
                        {processing === fine.id ? 'Processing...' : 'Mark Paid'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && fines.length === 0 && (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-text-secondary">No fines found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
