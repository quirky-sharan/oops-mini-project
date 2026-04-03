import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-6 bg-card border-b border-border flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-display font-semibold hidden sm:block">Campus Suite Library</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-text-secondary">{user?.role || 'Guest'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm uppercase">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <button onClick={handleLogout} className="ml-2 text-text-secondary hover:text-danger">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
