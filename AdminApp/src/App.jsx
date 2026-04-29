import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [username, setUsername] = useState('');
  const [duration, setDuration] = useState('1'); // Default 1
  const [durationType, setDurationType] = useState('hours'); // hours, days, months
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [generatedId, setGeneratedId] = useState('');
  
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Set background image via custom property to enable toggling or dynamic changing later
  useEffect(() => {
    document.body.style.setProperty('--bg-image', "url('/logo-vp.jpg')");
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('users_login')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Nama/ID wajib diisi!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setGeneratedId('');

    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date(now);
    const numValue = parseInt(duration);

    if (durationType === 'hours') {
      expiresAt.setHours(now.getHours() + numValue);
    } else if (durationType === 'days') {
      expiresAt.setDate(now.getDate() + numValue);
    } else if (durationType === 'months') {
      expiresAt.setMonth(now.getMonth() + numValue);
    }

    try {
      const { data, error } = await supabase
        .from('users_login')
        .insert([
          { 
            username: username.trim(),
            expires_at: expiresAt.toISOString(),
            is_active: true
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique violation
          setMessage({ type: 'error', text: 'ID/Username ini sudah pernah didaftarkan. Gunakan nama lain.' });
        } else {
          throw error;
        }
      } else {
        setMessage({ type: 'success', text: 'ID Berhasil Dibuat!' });
        setGeneratedId(username.trim());
        setUsername('');
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus akses ID ini?')) return;
    
    const { error } = await supabase
      .from('users_login')
      .delete()
      .eq('id', id);
      
    if (error) {
      alert('Gagal menghapus: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    alert('ID berhasil disalin!');
  };

  const isExpired = (dateString) => {
    return new Date() > new Date(dateString);
  };

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative z-10">
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
            {/* Subtle top border glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-2">
                VP<span className="text-primary">STORE</span>
              </h1>
              <p className="text-sm font-medium text-primary uppercase tracking-[0.2em] mb-1">Premium Access</p>
              <p className="text-gray-400 text-sm">Generator ID SIBOTINDRI</p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Username / ID Baru</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ketik ID unik..."
                  className="w-full px-5 py-4 rounded-xl glass-input text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Masa Aktif</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-1/3 px-5 py-4 rounded-xl glass-input text-center text-lg font-bold"
                    required
                  />
                  <select
                    value={durationType}
                    onChange={(e) => setDurationType(e.target.value)}
                    className="w-2/3 px-5 py-4 rounded-xl glass-input appearance-none text-lg cursor-pointer"
                  >
                    <option value="hours" className="bg-dark-surface">Jam</option>
                    <option value="days" className="bg-dark-surface">Hari</option>
                    <option value="months" className="bg-dark-surface">Bulan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl btn-primary text-lg mt-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memproses...
                  </span>
                ) : 'GENERATE ID SEKARANG'}
              </button>
            </form>

            {message.text && (
              <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium border ${
                message.type === 'success' 
                  ? 'bg-green-900/20 text-green-400 border-green-900/50' 
                  : 'bg-red-900/20 text-red-400 border-red-900/50'
              }`}>
                {message.text}
              </div>
            )}

            {generatedId && (
              <div className="mt-6 p-5 bg-dark-base rounded-xl border border-primary/30 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-2 uppercase tracking-widest">ID Berhasil Dibuat</span>
                <div className="flex items-center justify-between w-full bg-dark-surface rounded-lg p-3">
                  <span className="font-mono text-xl font-bold text-white px-2 tracking-wider truncate">{generatedId}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary-light rounded-md text-sm font-semibold transition-colors"
                  >
                    COPY
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-3xl h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                Daftar Akses
              </h2>
              <button 
                onClick={fetchUsers}
                className="text-gray-400 hover:text-white transition-colors"
                title="Refresh Data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-dark-base/40 border border-dark-border/40 custom-scrollbar">
              {loadingUsers ? (
                <div className="flex justify-center items-center h-40 text-gray-500">
                  <span className="animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
                  </span>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-40 text-gray-500 text-sm">
                  <svg className="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  Belum ada ID terdaftar
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-dark-surface/80 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                      <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Akses</th>
                      <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kadaluarsa</th>
                      <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/30">
                    {users.map((user) => {
                      const expired = isExpired(user.expires_at);
                      return (
                        <tr key={user.id} className="hover:bg-dark-surface/40 transition-colors group">
                          <td className="py-4 px-5 font-mono text-white text-sm">
                            {user.username}
                            <div className="text-[10px] text-gray-600 font-sans mt-1">
                              {user.device_id ? 'Device Terikat' : 'Belum Login'}
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            {expired ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span> Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Aktif
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-sm text-gray-300">
                            {formatDate(user.expires_at)}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="px-3 py-1.5 rounded text-xs font-medium btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
