import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [role, setRole] = useState('STUDENT');
  const [email, setEmail] = useState('aanya@college.edu');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        // Double check role mismatch if student tried admin login
        if (role === 'ADMIN' && res.data.role !== 'ADMIN') {
          setError('Invalid Admin credentials');
          return;
        }
        login(res.data);
        navigate('/dashboard');
      } else {
        setError(res.data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const setTestCreds = (type) => {
    setRole(type);
    if (type === 'ADMIN') {
      setEmail('admin@library.edu');
      setPassword('admin123');
    } else {
      setEmail('aanya@college.edu');
      setPassword('pass123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-stripes relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="text-6xl mb-6">📚</div>
        <h2 className="text-4xl font-display font-bold text-primary tracking-tight">Campus Suite</h2>
        <p className="mt-2 text-text-secondary text-lg">Library Management System</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-card py-8 px-4 shadow-xl sm:px-10">
          
          <div className="flex bg-secondary p-1 rounded-lg mb-8 border border-border">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'STUDENT' ? 'bg-card shadow text-accent' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setTestCreds('STUDENT')}
            >
              Student
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'ADMIN' ? 'bg-card shadow text-accent' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setTestCreds('ADMIN')}
            >
              Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger/10 border-l-4 border-danger p-4 animate-shake">
                <p className="text-sm text-danger font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center btn-primary py-2.5 text-base"
              >
                {isLoading ? 'Signing in...' : `Sign in as ${role === 'ADMIN' ? 'Administrator' : 'Student'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
