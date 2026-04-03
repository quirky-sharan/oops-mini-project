import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      setError('Book not found or error loading details');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    setReserving(true);
    setError('');
    try {
      const res = await api.post('/reservations', { bookId: id, memberId: user.userId });
      if (res.data.success) {
        setSuccess('Book reserved successfully! Check Reservations page for details.');
        fetchBook();
      } else {
        setError(res.data.error || 'Failed to reserve');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div className="text-danger">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-text-secondary hover:text-accent mb-6 flex items-center gap-1">
        &larr; Back to catalog
      </button>

      {error && <div className="bg-danger/10 text-danger p-4 rounded-md mb-6 border border-danger/30">{error}</div>}
      {success && <div className="bg-success/10 text-success p-4 rounded-md mb-6 border border-success/30">{success}</div>}

      <div className="glass-card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-secondary/50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-white/80 text-xs font-mono uppercase tracking-widest">{book.isbn}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-2 block">{book.genre}</span>
                <h1 className="text-3xl font-display font-bold text-primary mb-2 shadow-sm">{book.title}</h1>
                <p className="text-xl text-text-secondary">{book.author}</p>
              </div>
              <span className={`badge ${
                book.status === 'AVAILABLE' ? 'badge-success' : 
                book.status === 'ISSUED' ? 'badge-warning' : 
                'badge-info'
              } text-sm px-3 py-1`}>
                {book.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 my-8 py-6 border-y border-border/50">
              <div>
                <p className="text-sm text-text-secondary mb-1">ISBN</p>
                <p className="font-mono text-primary">{book.isbn}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Publisher</p>
                <p className="text-primary">{book.publisher}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Publication Year</p>
                <p className="text-primary">{book.year}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Language</p>
                <p className="text-primary">{book.language}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <span className="text-accent font-bold">{book.availableCopies}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Available now</p>
                  <p className="text-xs text-text-secondary">Out of {book.totalCopies} total copies</p>
                </div>
              </div>

              {!isAdmin && book.status === 'AVAILABLE' && (
                <button 
                  className="btn-primary flex items-center gap-2"
                  onClick={handleReserve}
                  disabled={reserving || book.availableCopies <= 0}
                >
                  {reserving ? 'Reserving...' : 'Reserve Book'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </button>
              )}
              
              {isAdmin && (
                <div className="flex gap-2">
                  <button className="btn-outline text-sm">Edit</button>
                  <button className="btn-outline text-danger border-danger/30 hover:bg-danger/10 text-sm">Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
