import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import StatCard from '../components/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.userId) return;

    const fetchDashboard = async () => {
      try {
        const [dashRes, myRes] = await Promise.all([
          api.get('/dashboard'),
          !isAdmin ? api.get(`/members/${user.userId}`) : Promise.resolve({ data: null })
        ]);
        
        setStats({
          dash: dashRes.data,
          me: myRes.data
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [isAdmin, user?.userId]);

  if (loading || !stats) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-6 bg-border rounded w-1/4"></div><div className="space-y-3"><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="h-24 bg-border rounded"></div><div className="h-24 bg-border rounded"></div><div className="h-24 bg-border rounded"></div></div></div></div></div>;
  }

  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', issues: 12 }, { name: 'Feb', issues: 19 },
    { name: 'Mar', issues: 15 }, { name: 'Apr', issues: 22 },
    { name: 'May', issues: 18 }, { name: 'Jun', issues: 31 },
  ];

  const genreData = [
    { name: 'Computer Science', value: 3 },
    { name: 'Classic Fiction', value: 4 },
    { name: 'Literary Fiction', value: 3 },
    { name: 'Non-Fiction', value: 1 },
    { name: 'Fantasy', value: 1 },
  ];
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-text-secondary mt-1">
            {isAdmin ? "Here's what's happening in your library today." : "Here's an overview of your academic library account."}
          </p>
        </div>
      </div>

      {isAdmin ? (
        <>
          {/* Admin Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard title="Total Books" value={stats.dash.totalBooks} subtitle={`${stats.dash.totalCopies} copies`} color="accent" />
            <StatCard title="Issued Books" value={stats.dash.issuedCopies} subtitle={`out of ${stats.dash.totalCopies} copies`} color="warning" />
            <StatCard title="Total Members" value={stats.dash.totalMembers} color="success" />
            <StatCard title="Pending Fines" value={stats.dash.pendingFines} subtitle={`₹${stats.dash.totalFineAmount}`} color="danger" />
            <StatCard title="Active Txns" value={stats.dash.activeTransactions} color="accent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6 text-primary">Monthly Issues</h3>
              <div className="h-64 cursor-crosshair">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'var(--border)', opacity: 0.2}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)'}} />
                    <Bar dataKey="issues" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-display font-semibold mb-6 text-primary">Books by Genre</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genreData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)'}} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-card">
              <h3 className="text-lg font-display font-semibold text-primary">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 text-text-secondary text-sm">
                    <th className="px-6 py-4 font-medium">Tx ID</th>
                    <th className="px-6 py-4 font-medium">Book</th>
                    <th className="px-6 py-4 font-medium">Member</th>
                    <th className="px-6 py-4 font-medium">Issue Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {stats.dash.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-border/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                      <td className="px-6 py-4 text-text-primary font-medium">{tx.bookId}</td>
                      <td className="px-6 py-4 text-text-primary">{tx.memberId}</td>
                      <td className="px-6 py-4 text-text-secondary">{tx.issueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${tx.status === 'ACTIVE' ? 'badge-info' : tx.status === 'OVERDUE' ? 'badge-danger' : 'badge-success'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.dash.recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">No recent transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Student Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Active Borrows" 
              value={stats.me?.activeBorrows || 0} 
              subtitle={`Limit: 3 books`} 
              color={stats.me?.activeBorrows >= 3 ? "warning" : "success"} 
            />
            <StatCard 
              title="Pending Fines" 
              value={stats.dash.pendingFines} 
              subtitle={`Please pay at desk`} 
              color={stats.dash.pendingFines > 0 ? "danger" : "success"} 
            />
            <StatCard 
              title="Reservations" 
              value={0} 
              subtitle="Expires in 3 days" 
              color="accent" 
            />
          </div>

          <div className="glass-card overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-display font-semibold text-primary">My Current Borrows</h3>
              <span className="badge badge-neutral">Active only</span>
            </div>
            <div className="p-6">
              {stats.me?.activeTransactions?.length > 0 ? (
                <div className="space-y-4">
                  {stats.me.activeTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-semibold text-primary">{tx.bookId}</p>
                        <p className="text-sm text-text-secondary mt-1">Issued: {tx.issueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-warning">Due: {tx.dueDate}</p>
                        <span className={`mt-2 inline-block badge ${tx.status === 'ACTIVE' ? 'badge-info' : 'badge-danger'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">You don't have any active borrows right now.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
