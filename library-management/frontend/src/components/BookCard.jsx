import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }) {
  const navigate = useNavigate();

  // Color mapping based on genre
  const getGradient = (genre) => {
    const map = {
      'Computer Science': 'from-blue-500 to-indigo-600',
      'Fantasy': 'from-purple-500 to-pink-600',
      'Classic Fiction': 'from-amber-600 to-orange-700',
      'Literary Fiction': 'from-emerald-500 to-teal-700',
      'Non-Fiction': 'from-slate-600 to-slate-800',
      'Dystopian Fiction': 'from-red-800 to-stone-900',
    };
    return map[genre] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden group">
      <div className={`h-32 bg-gradient-to-br ${getGradient(book.genre)} relative`}>
        <div className="absolute top-3 right-3">
          <span className={`badge ${
            book.status === 'AVAILABLE' ? 'badge-success bg-white/90' : 
            book.status === 'ISSUED' ? 'badge-warning bg-white/90' : 
            'badge-info bg-white/90'
          }`}>
            {book.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs font-medium text-accent tracking-wider uppercase">{book.genre}</span>
        </div>
        <h3 className="text-lg font-display font-semibold mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
        <p className="text-sm text-text-secondary mb-4">{book.author} &bull; {book.year}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs font-medium text-text-secondary">
            {book.availableCopies} / {book.totalCopies} available
          </div>
          <button 
            onClick={() => navigate(`/books/${book.id}`)}
            className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
