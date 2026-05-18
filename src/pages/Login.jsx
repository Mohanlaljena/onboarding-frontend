import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      if (res.data.firstLogin) {
        navigate('/setup', { state: { email: form.email } });
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'hr' ? '/hr' : '/profile');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)'}}>
      <div style={{background:'white',padding:'48px',borderRadius:'20px',boxShadow:'0 20px 60px rgba(0,0,0,0.1)',width:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'48px',marginBottom:'8px'}}>🏢</div>
          <h2 style={{color:'#1A56DB',margin:0,fontSize:'24px'}}>Onboarding Portal</h2>
          <p style={{color:'#6B7280',marginTop:'8px',fontSize:'14px'}}>Sign in to your account</p>
        </div>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'12px',borderRadius:'8px',marginBottom:'16px',fontSize:'14px'}}>{error}</div>}
        <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>Email Address</label>
        <input style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box',outline:'none'}}
          placeholder='Enter your email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>Password</label>
        <input type='password' style={{width:'100%',padding:'12px',marginBottom:'24px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box',outline:'none'}}
          placeholder='Enter your password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        <button style={{width:'100%',padding:'14px',background:loading?'#93C5FD':'#1A56DB',color:'white',border:'none',borderRadius:'10px',fontSize:'16px',cursor:'pointer',fontWeight:'bold'}}
          onClick={handleLogin} disabled={loading}>{loading?'Signing in...':'Sign In →'}</button>
        <p style={{textAlign:'center',marginTop:'16px',fontSize:'13px',color:'#6B7280'}}>First time? Enter your email and any password to set up your account.</p>
      </div>
    </div>
  );
}