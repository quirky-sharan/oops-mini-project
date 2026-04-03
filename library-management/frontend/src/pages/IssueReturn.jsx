import React, { useState } from 'react';
import api from '../api/api';

export default function IssueReturn() {
  const [activeTab, setActiveTab] = useState('ISSUE');
  
  // Issue state
  const [issueData, setIssueData] = useState({ bookId: '', memberId: '' });
  const [issueLoading, setIssueLoading] = useState(false);
  
  // Return state
  const [returnTxId, setReturnTxId] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  
  // Feedback state
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssueLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await api.post('/transactions/issue', issueData);
      if (res.data.success) {
        setMessage({ type: 'success', text: `Book issued successfully! Due date: ${res.data.dueDate}` });
        setIssueData({ bookId: '', memberId: '' });
      } else {
        setMessage({ type: 'error', text: res.data.error || 'Failed to issue book' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Operation failed' });
    } finally {
      setIssueLoading(false);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setReturnLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await api.post('/transactions/return', { transactionId: returnTxId });
      if (res.data.success) {
        let text = `Book returned successfully.`;
        if (res.data.fineAmount > 0) {
          text += ` Fine generated: ₹${res.data.fineAmount} (${res.data.daysOverdue} days overdue).`;
        }
        setMessage({ type: 'success', text });
        setReturnTxId('');
      } else {
        setMessage({ type: 'error', text: res.data.error || 'Failed to return book' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Operation failed' });
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Circulation Desk</h1>
        <p className="text-text-secondary mt-1">Issue books to members or process returns</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-border bg-secondary/30">
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'ISSUE' ? 'bg-card text-accent border-b-2 border-accent' : 'text-text-secondary hover:bg-border/10'}`}
            onClick={() => { setActiveTab('ISSUE'); setMessage({type:'', text:''}); }}
          >
            Issue Book
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'RETURN' ? 'bg-card text-accent border-b-2 border-accent' : 'text-text-secondary hover:bg-border/10'}`}
            onClick={() => { setActiveTab('RETURN'); setMessage({type:'', text:''}); }}
          >
            Return Book
          </button>
        </div>

        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md border ${message.type === 'error' ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-success/10 border-success/30 text-success'}`}>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          {activeTab === 'ISSUE' ? (
            <form onSubmit={handleIssue} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Member ID</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="e.g. STU001"
                  value={issueData.memberId}
                  onChange={e => setIssueData({...issueData, memberId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Book ID</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="e.g. BK001"
                  value={issueData.bookId}
                  onChange={e => setIssueData({...issueData, bookId: e.target.value})}
                />
              </div>
              <button disabled={issueLoading} type="submit" className="w-full btn-primary py-3">
                {issueLoading ? 'Processing...' : 'Confirm Issue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReturn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Transaction ID</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="e.g. TX001"
                  value={returnTxId}
                  onChange={e => setReturnTxId(e.target.value.toUpperCase())}
                />
                <p className="text-xs text-text-secondary mt-2">Enter the transaction ID to process the return and automatically calculate any applicable fines.</p>
              </div>
              <button disabled={returnLoading} type="submit" className="w-full btn-primary py-3">
                {returnLoading ? 'Processing...' : 'Process Return'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
