import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function HRDashboard() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', joining_date:'' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const load = () => api.get('/admin/onboarding/overview').then(res => setEmployees(res.data));
  useEffect(() => { load(); }, []);

  const addEmployee = async () => {
    try {
      await api.post('/auth/create-employee', form);
      setMsg('✅ Employee added! They can now login and set their password.');
      setForm({ name:'', email:'', joining_date:'' });
      load();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.msg || 'Error'));
    }
  };

  const total = employees.length;
  const complete = employees.filter(e=>e.status==='completed').length;
  const pending = total - complete;

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'1000px',margin:'30px auto',padding:'20px'}}>
        <h1 style={{color:'#1A56DB',marginBottom:'24px'}}>👥 HR Dashboard</h1>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'24px'}}>
          {[['Total Employees',total,'#1A56DB'],['Onboarding Complete',complete,'#059669'],['In Progress',pending,'#D97706']].map(([l,n,c])=>(
            <div key={l} style={{background:'white',padding:'20px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',textAlign:'center'}}>
              <div style={{fontSize:'36px',fontWeight:'bold',color:c}}>{n}</div>
              <div style={{fontSize:'13px',color:'#6B7280',marginTop:'4px'}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:'white',padding:'24px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginBottom:'24px'}}>
          <h3 style={{color:'#374151',marginBottom:'16px'}}>➕ Add New Employee</h3>
          {msg && <div style={{padding:'10px',borderRadius:'8px',marginBottom:'12px',background:msg.includes('✅')?'#D1FAE5':'#FEE2E2',color:msg.includes('✅')?'#065F46':'#991B1B',fontWeight:'bold'}}>{msg}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:'12px',alignItems:'end'}}>
            {[['name','Full Name','text'],['email','Email','email'],['joining_date','Joining Date','date']].map(([k,l,t])=>(
              <div key={k}>
                <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#374151',marginBottom:'4px'}}>{l}</label>
                <input type={t} style={{width:'100%',padding:'10px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'14px',boxSizing:'border-box'}}
                  value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />
              </div>
            ))}
            <button style={{padding:'10px 20px',background:'#1A56DB',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',height:'42px'}}
              onClick={addEmployee}>Add</button>
          </div>
        </div>
        <div style={{background:'white',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{background:'#1A56DB'}}>{['Name','Email','Joining Date','Progress','Status','Actions'].map(h=>(<th key={h} style={{padding:'14px',color:'white',textAlign:'left',fontSize:'13px'}}>{h}</th>))}</tr></thead>
            <tbody>{employees.map((emp,i)=>(
              <tr key={i} style={{background:i%2===0?'#F8FAFC':'white',borderBottom:'1px solid #F3F4F6'}}>
                <td style={{padding:'12px 14px',fontSize:'14px',fontWeight:'500'}}>{emp.name}</td>
                <td style={{padding:'12px 14px',fontSize:'13px',color:'#6B7280'}}>{emp.email}</td>
                <td style={{padding:'12px 14px',fontSize:'13px'}}>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : '-'}</td>
                <td style={{padding:'12px 14px',minWidth:'120px'}}><ProgressBar percent={emp.progress_percent||0} /></td>
                <td style={{padding:'12px 14px'}}><span style={{background:emp.status==='completed'?'#D1FAE5':emp.status==='active'?'#DBEAFE':'#FEF3C7',color:emp.status==='completed'?'#065F46':emp.status==='active'?'#1E40AF':'#92400E',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'bold'}}>{emp.status}</span></td>
                <td style={{padding:'12px 14px'}}><button style={{padding:'6px 14px',background:'#7C3AED',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'bold'}}
                  onClick={()=>navigate(`/hr/verify/${emp.id}`)}>Verify Docs</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}