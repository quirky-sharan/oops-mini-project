import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

export default function Books() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, filterGenre, filterStatus]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let url = '/books';
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterGenre) params.append('genre', filterGenre);
      
      const res = await api.get(`${url}?${params.toString()}`);
      let data = res.data;
      if (filterStatus) {
        data = data.filter(b => b.status === filterStatus);
      }
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Library Catalog</h1>
          <p className="text-text-secondary mt-1">Browse, search, and discover books</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Book
          </button>
        )}
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search by title or author..." 
          />
        </div>
        <select 
          className="input-field md:w-48"
          value={filterGenre}
          onChange={e => setFilterGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select 
          className="input-field md:w-48"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ISSUED">Issued</option>
          <option value="RESERVED">Reserved</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-card rounded-xl h-72 border border-border"></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <p className="text-xl text-text-secondary">No books found matching your criteria.</p>
          <button onClick={() => {setSearchTerm(''); setFilterGenre(''); setFilterStatus('');}} className="mt-4 text-accent hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
