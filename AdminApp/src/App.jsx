import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [users, setUsers] = null ? useState([]) : useState([]); // Placeholder for loading
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [duration, setDuration] = useState('1h');
  const [message, setMessage] = useState('');

  // Generate random ID if left blank
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const finalUsername = username.trim() || generateRandomId();
    
    // Calculate expiration date
    const now = new Date();
    let expiresAt = new Date();
    if (duration === '1h') expiresAt.setHours(now.getHours() + 1);
    else if (duration === '1d') expiresAt.setDate(now.getDate() + 1);
    else if (duration === '1w') expiresAt.setDate(now.getDate() + 7);
    else if (duration === '1m') expiresAt.setMonth(now.getMonth() + 1);
    else if (duration === '1y') expiresAt.setFullYear(now.getFullYear() + 1);

    try {
      // Assuming a table named 'users_login'
      const { data, error } = await supabase
        .from('users_login')
        .insert([
          { 
            username: finalUsername, 
            expires_at: expiresAt.toISOString(),
            is_active: true
          }
        ]);

      if (error) throw error;
      
      setMessage(`Sukses! ID: ${finalUsername} dibuat. Aktif sampai: ${expiresAt.toLocaleString()}`);
      setUsername('');
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}. Pastikan URL & Key Supabase sudah diatur di supabaseClient.js.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_login')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-darker p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mt-8">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Akses Panel
          </h1>
          <p className="text-sm text-slate-400">Kelola ID Login & Masa Aktif SIBOTINDRI</p>
        </div>

        {/* Card Form */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <form onSubmit={handleCreateUser} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">ID / Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kosongkan untuk acak" 
                className="w-full bg-dark/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Masa Aktif</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: '1h', label: '1 Jam' },
                  { val: '1d', label: '1 Hari' },
                  { val: '1w', label: '1 Minggu' },
                  { val: '1m', label: '1 Bulan' },
                  { val: '1y', label: '1 Tahun' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDuration(opt.val)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      duration === opt.val 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0 flex justify-center items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Generate ID
                </>
              )}
            </button>
            
            {message && (
              <div className="mt-4 p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-center text-emerald-400">
                {message}
              </div>
            )}
          </form>
        </div>

        {/* List of Users */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 px-2">ID Terdaftar ({users.length})</h2>
          <div className="space-y-2">
            {users.length === 0 && (
              <div className="text-center p-6 text-slate-500 text-sm glass rounded-2xl">
                Belum ada data ID
              </div>
            )}
            {users.map(user => {
              const isExpired = new Date(user.expires_at) < new Date();
              return (
                <div key={user.id} className="glass rounded-2xl p-4 flex justify-between items-center group hover:bg-slate-800/40 transition-colors">
                  <div>
                    <div className="font-mono font-bold text-lg text-slate-200">{user.username}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(user.expires_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-semibold ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {isExpired ? 'Expired' : 'Aktif'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
