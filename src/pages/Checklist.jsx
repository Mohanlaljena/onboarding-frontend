import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

export default function Checklist() {
  const [data, setData] = useState({ items: [], progress: { done:0, total:0, percent:0 } });
  const [joining, setJoining] = useState('');

  const load = () => api.get('/checklist').then(res => setData(res.data));
  useEffect(() => { load(); }, []);

  const markDone = async (id) => {
    await api.patch(`/checklist/${id}`);
    load();
  };

  const confirmJoining = async () => {
    try {
      const res = await api.post('/joining/confirm');
      setJoining(res.data.msg);
    } catch (err) {
      setJoining(err.response?.data?.msg || 'Cannot confirm yet');
    }
  };

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'700px',margin:'40px auto',padding:'20px'}}>
        <h2 style={{color:'#1A56DB'}}>✅ Onboarding Checklist</h2>
        <div style={{background:'white',padding:'20px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginBottom:'20px'}}>
          <ProgressBar percent={data.progress.percent} />
          <p style={{color:'#6B7280',fontSize:'13px',marginTop:'8px'}}>{data.progress.done} of {data.progress.total} tasks completed</p>
        </div>
        {data.items.map((item) => (
          <div key={item.id} style={{background:'white',padding:'16px 20px',borderRadius:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',marginBottom:'10px',display:'flex',justifyContent:'space-between',alignItems:'center',borderLeft:'4px solid '+(item.completed?'#059669':'#E5E7EB')}}>
            <div>
              <div style={{fontWeight:'bold',color:item.completed?'#6B7280':'#374151',textDecoration:item.completed?'line-through':'none'}}>{item.title}</div>
              {item.description && <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'2px'}}>{item.description}</div>}
            </div>
            {item.completed ?
              <span style={{color:'#059669',fontSize:'20px'}}>✅</span> :
              <button style={{padding:'6px 16px',background:'#1A56DB',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'13px',fontWeight:'bold'}}
                onClick={()=>markDone(item.id)}>Mark Done</button>
            }
          </div>
        ))}
        <div style={{background:'white',padding:'20px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginTop:'20px'}}>
          <h3 style={{color:'#1A56DB',marginBottom:'12px'}}>📅 Confirm Joining Date</h3>
          {joining && <p style={{color:joining.includes('complete')||joining.includes('confirmed')?'#059669':'#DC2626',fontWeight:'bold',marginBottom:'12px'}}>{joining}</p>}
          <button style={{padding:'12px 24px',background:'#059669',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',fontSize:'15px'}}
            onClick={confirmJoining}>✅ Confirm My Joining Date</button>
          <p style={{fontSize:'12px',color:'#9CA3AF',marginTop:'8px'}}>Only available after all mandatory documents are approved</p>
        </div>
      </div>
    </div>
  );
}