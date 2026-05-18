import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function SetupPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSetup = async () => {
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    try {
      const res = await api.post('/auth/setup', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.msg || 'Setup failed');
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)'}}>
      <div style={{background:'white',padding:'48px',borderRadius:'20px',boxShadow:'0 20px 60px rgba(0,0,0,0.1)',width:'400px'}}>
        <h2 style={{color:'#1A56DB',marginBottom:'8px'}}>🔐 Set Your Password</h2>
        <p style={{color:'#6B7280',marginBottom:'24px',fontSize:'14px'}}>Welcome! Please set your password for: {email}</p>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'12px',borderRadius:'8px',marginBottom:'16px',fontSize:'14px'}}>{error}</div>}
        <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>New Password</label>
        <input type='password' style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box'}}
          placeholder='Min 6 characters' value={password} onChange={e=>setPassword(e.target.value)} />
        <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>Confirm Password</label>
        <input type='password' style={{width:'100%',padding:'12px',marginBottom:'24px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box'}}
          placeholder='Repeat password' value={confirm} onChange={e=>setConfirm(e.target.value)} />
        <button style={{width:'100%',padding:'14px',background:'#059669',color:'white',border:'none',borderRadius:'10px',fontSize:'16px',cursor:'pointer',fontWeight:'bold'}}
          onClick={handleSetup}>Set Password & Continue →</button>
      </div>
    </div>
  );
}