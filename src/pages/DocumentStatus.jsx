import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const statusColor = { Pending:'#FEF3C7', Approved:'#D1FAE5', Rejected:'#FEE2E2' };
const statusText = { Pending:'#92400E', Approved:'#065F46', Rejected:'#991B1B' };

export default function DocumentStatus() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    api.get('/documents/my').then(res => setDocs(res.data));
  }, []);

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'700px',margin:'40px auto',padding:'20px'}}>
        <h2 style={{color:'#1A56DB'}}>📋 Document Status</h2>
        <p style={{color:'#6B7280',marginBottom:'24px'}}>Track your uploaded documents and HR verification status</p>
        {docs.length === 0 ? <p style={{color:'#6B7280',textAlign:'center',padding:'40px'}}>No documents uploaded yet.</p> :
          docs.map((doc,i) => (
            <div key={i} style={{background:'white',padding:'20px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginBottom:'12px',borderLeft:'4px solid '+(doc.status==='Approved'?'#059669':doc.status==='Rejected'?'#DC2626':'#D97706')}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:'bold',color:'#374151'}}>{doc.doc_type}</span>
                <span style={{background:statusColor[doc.status],color:statusText[doc.status],padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'bold'}}>{doc.status}</span>
              </div>
              {doc.remark && <p style={{marginTop:'8px',fontSize:'13px',color:'#6B7280'}}>HR Remark: {doc.remark}</p>}
              <p style={{marginTop:'4px',fontSize:'12px',color:'#9CA3AF'}}>Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}