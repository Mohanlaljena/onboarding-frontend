import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const logout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav style={{background:'#1A56DB',padding:'14px 30px',display:'flex',justifyContent:'space-between',alignItems:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.15)'}}>
      <span style={{color:'white',fontWeight:'bold',fontSize:'20px'}}>🏢 Onboarding Portal</span>
      <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
        {user.role === 'employee' && <>
          <Link to='/profile' style={{color:'white',textDecoration:'none',fontSize:'14px'}}>Profile</Link>
          <Link to='/documents' style={{color:'white',textDecoration:'none',fontSize:'14px'}}>Documents</Link>
          <Link to='/documents/status' style={{color:'white',textDecoration:'none',fontSize:'14px'}}>Doc Status</Link>
          <Link to='/checklist' style={{color:'white',textDecoration:'none',fontSize:'14px'}}>Checklist</Link>
        </>}
        {user.role === 'hr' && <>
          <Link to='/hr' style={{color:'white',textDecoration:'none',fontSize:'14px'}}>Dashboard</Link>
        </>}
        <span style={{color:'#BFDBFE',fontSize:'14px'}}>Hi, {user.name}</span>
        <button onClick={logout} style={{background:'white',color:'#1A56DB',border:'none',padding:'7px 16px',borderRadius:'6px',cursor:'pointer',fontWeight:'bold',fontSize:'13px'}}>Logout</button>
      </div>
    </nav>
  );
}