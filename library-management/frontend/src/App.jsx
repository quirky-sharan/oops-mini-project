import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Members from './pages/Members';
import IssueReturn from './pages/IssueReturn';
import MyBorrows from './pages/MyBorrows';
import Reservations from './pages/Reservations';
import Fines from './pages/Fines';
import History from './pages/History';

function PrivateRoute({ children, roleRequired }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/dashboard" replace />;
  
  return children;
}

function Layout({ children }) {
  const { user } = useAuth();
  
  if (!user) return children;

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/books" element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          } />
          
          <Route path="/books/:id" element={
            <PrivateRoute>
              <BookDetail />
            </PrivateRoute>
          } />
          
          <Route path="/reservations" element={
            <PrivateRoute>
              <Reservations />
            </PrivateRoute>
          } />
          
          <Route path="/fines" element={
            <PrivateRoute>
              <Fines />
            </PrivateRoute>
          } />

          {/* Admin only routes */}
          <Route path="/members" element={
            <PrivateRoute roleRequired="ADMIN">
              <Members />
            </PrivateRoute>
          } />
          
          <Route path="/issue-return" element={
            <PrivateRoute roleRequired="ADMIN">
              <IssueReturn />
            </PrivateRoute>
          } />
          
          <Route path="/history" element={
            <PrivateRoute roleRequired="ADMIN">
              <History />
            </PrivateRoute>
          } />

          {/* Student only routes */}
          <Route path="/my-borrows" element={
            <PrivateRoute roleRequired="STUDENT">
              <MyBorrows />
            </PrivateRoute>
          } />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
