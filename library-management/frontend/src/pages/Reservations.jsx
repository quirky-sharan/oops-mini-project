import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Reservations() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      let data = res.data;
      if (!isAdmin) {
        data = data.filter(r => r.memberId === user.userId);
      }
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    setCanceling(id);
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      alert("Failed to cancel reservation");
    } finally {
      setCanceling(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Reservations</h1>
        <p className="text-text-secondary mt-1">{isAdmin ? "Manage all library reservations" : "Your active book reservations"}</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/50 text-text-secondary text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Res ID</th>
                <th className="px-6 py-4 font-medium">Book</th>
                {isAdmin && <th className="px-6 py-4 font-medium">Member</th>}
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Expires</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : reservations.map(res => (
                <tr key={res.id} className="hover:bg-border/10 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-xs">{res.id}</td>
                  <td className="px-6 py-4 text-primary font-medium">{res.bookId}</td>
                  {isAdmin && <td className="px-6 py-4">{res.memberId}</td>}
                  <td className="px-6 py-4 text-text-secondary">{res.reservationDate}</td>
                  <td className="px-6 py-4 text-text-secondary">{res.expiryDate}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${res.status === 'ACTIVE' ? 'badge-info' : 'badge-neutral'}`}>{res.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {res.status === 'ACTIVE' && (
                      <button 
                        onClick={() => handleCancel(res.id)}
                        disabled={canceling === res.id}
                        className="text-danger hover:underline font-medium text-xs uppercase tracking-wider"
                      >
                        {canceling === res.id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && reservations.length === 0 && (
                <tr><td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-text-secondary">No reservations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
