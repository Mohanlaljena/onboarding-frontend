import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function ProfileSetup() {
  const [form, setForm] = useState({ dob:'',gender:'',phone:'',address:'',emergency_contact:'',bank_account:'',pan:'',education_json:'' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    const required = ['dob','gender','phone','address','emergency_contact'];
    for (const f of required) {
      if (!form[f]) return setError(`Please fill: ${f.replace('_',' ')}`);
    }
    try {
      await api.put('/profile', form);
      setSuccess('Profile saved! ✅');
      setTimeout(() => navigate('/documents'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Save failed');
    }
  };

  const fields = [
    ['dob','Date of Birth','date'],['gender','Gender','text'],
    ['phone','Phone Number','text'],['address','Home Address','text'],
    ['emergency_contact','Emergency Contact','text'],
    ['bank_account','Bank Account Number','text'],['pan','PAN Number','text'],
    ['education_json','Education Details (e.g. B.Tech CSE 2025)','text'],
  ];

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'600px',margin:'40px auto',padding:'20px'}}>
        <h2 style={{color:'#1A56DB'}}>📝 Profile Setup</h2>
        <p style={{color:'#6B7280',marginBottom:'24px'}}>Fill all details to continue to document upload</p>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'12px',borderRadius:'8px',marginBottom:'16px'}}>{error}</div>}
        {success && <div style={{background:'#D1FAE5',color:'#065F46',padding:'12px',borderRadius:'8px',marginBottom:'16px',fontWeight:'bold'}}>{success}</div>}
        <div style={{background:'white',padding:'32px',borderRadius:'16px',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
          {fields.map(([key, label, type]) => (
            <div key={key} style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'6px'}}>{label}</label>
              <input type={type} style={{width:'100%',padding:'11px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box'}}
                value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
            </div>
          ))}
          <button style={{width:'100%',padding:'14px',background:'#1A56DB',color:'white',border:'none',borderRadius:'10px',fontSize:'15px',cursor:'pointer',fontWeight:'bold',marginTop:'8px'}}
            onClick={handleSave}>💾 Save Profile & Continue</button>
        </div>
      </div>
    </div>
  );
}