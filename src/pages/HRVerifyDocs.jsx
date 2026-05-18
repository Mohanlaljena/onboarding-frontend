import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function HRVerifyDocs() {
  const { userId } = useParams();
  const [docs, setDocs] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const load = () => api.get(`/admin/documents/${userId}`).then(res => setDocs(res.data));
  useEffect(() => { load(); }, []);

  const verify = async (docId, status) => {
    if (status === 'Rejected' && !remarks[docId]) return setMsg('Please add a remark before rejecting');
    try {
      await api.patch(`/admin/documents/${docId}/verify`, { status, remark: remarks[docId] || '' });
      setMsg(`Document ${status} successfully!`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'750px',margin:'40px auto',padding:'20px'}}>
        <button style={{background:'none',border:'none',color:'#1A56DB',cursor:'pointer',fontSize:'14px',marginBottom:'16px',fontWeight:'bold'}} onClick={()=>navigate('/hr')}>← Back to Dashboard</button>
        <h2 style={{color:'#1A56DB'}}>🔍 Document Verification</h2>
        {msg && <div style={{background:'#D1FAE5',color:'#065F46',padding:'12px',borderRadius:'8px',marginBottom:'16px',fontWeight:'bold'}}>{msg}</div>}
        {docs.length === 0 ? <p style={{color:'#6B7280',textAlign:'center',padding:'40px'}}>No documents uploaded yet.</p> :
          docs.map((doc) => (
            <div key={doc.id} style={{background:'white',padding:'24px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginBottom:'16px',borderLeft:'4px solid '+(doc.status==='Approved'?'#059669':doc.status==='Rejected'?'#DC2626':'#D97706')}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                <span style={{fontWeight:'bold',fontSize:'16px',color:'#374151'}}>{doc.doc_type}</span>
                <span style={{background:doc.status==='Approved'?'#D1FAE5':doc.status==='Rejected'?'#FEE2E2':'#FEF3C7',color:doc.status==='Approved'?'#065F46':doc.status==='Rejected'?'#991B1B':'#92400E',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'bold'}}>{doc.status}</span>
              </div>
              <p style={{fontSize:'12px',color:'#9CA3AF',marginBottom:'12px'}}>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
              {doc.status === 'Pending' && (
                <div>
                  <input style={{width:'100%',padding:'10px',borderRadius:'8px',border:'2px solid #E5E7EB',fontSize:'13px',marginBottom:'10px',boxSizing:'border-box'}}
                    placeholder='Add remark (required for rejection)' value={remarks[doc.id]||''} onChange={e=>setRemarks({...remarks,[doc.id]:e.target.value})} />
                  <div style={{display:'flex',gap:'10px'}}>
                    <button style={{flex:1,padding:'10px',background:'#059669',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}
                      onClick={()=>verify(doc.id,'Approved')}>✅ Approve</button>
                    <button style={{flex:1,padding:'10px',background:'#DC2626',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}
                      onClick={()=>verify(doc.id,'Rejected')}>❌ Reject</button>
                  </div>
                </div>
              )}
              {doc.remark && <p style={{marginTop:'8px',fontSize:'13px',color:'#6B7280',background:'#F8FAFC',padding:'8px',borderRadius:'6px'}}>Remark: {doc.remark}</p>}
            </div>
          ))
        }
      </div>
    </div>
  );
}