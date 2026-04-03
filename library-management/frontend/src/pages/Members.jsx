import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SearchBar from '../components/SearchBar';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Members</h1>
          <p className="text-text-secondary mt-1">Manage library student accounts</p>
        </div>
        <button className="btn-primary">Add Member</button>
      </div>

      <div className="glass-card p-4">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search by name or roll number..." 
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-text-secondary text-sm border-b border-border">
                <th className="px-6 py-4 font-medium">Student ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Roll No</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Borrows</th>
                <th className="px-6 py-4 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-border/10 cursor-pointer transition-colors">
                  <td className="px-6 py-4 text-text-secondary font-mono text-sm">{member.id}</td>
                  <td className="px-6 py-4 text-primary font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{member.rollNumber}</td>
                  <td className="px-6 py-4 text-text-secondary">{member.department}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${parseInt(member.activeBorrows) >= 3 ? 'badge-danger' : parseInt(member.activeBorrows) > 0 ? 'badge-warning' : 'badge-neutral'}`}>
                      {member.activeBorrows} / 3
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{member.dateRegistered}</td>
                </tr>
              ))}
              {!loading && filteredMembers.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-text-secondary">No members found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
