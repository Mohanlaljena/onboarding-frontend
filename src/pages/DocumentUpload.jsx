import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const DOC_TYPES = [
  { id: 1, name: '🪪 ID Proof (Aadhar)', mandatory: true },
  { id: 2, name: '🏠 Address Proof', mandatory: true },
  { id: 3, name: '🎓 Education Certificate', mandatory: true },
  { id: 4, name: '💼 Experience Letter', mandatory: false },
];

export default function DocumentUpload() {
  const [files, setFiles] = useState({});
  const [uploaded, setUploaded] = useState({});
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (docTypeId) => {
    if (!files[docTypeId]) return setError('Please select a file first');
    const file = files[docTypeId];
    if (file.size > 5 * 1024 * 1024) return setError('File size must be under 5MB');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf','jpg','jpeg','png'].includes(ext)) return setError('Only pdf, jpg, png files allowed');
    setLoading(docTypeId); setError('');
    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('document_type_id', docTypeId);
      await api.post('/documents/upload', fd, { headers: {'Content-Type':'multipart/form-data'} });
      setUploaded({...uploaded, [docTypeId]: true});
    } catch (err) {
      setError(err.response?.data?.msg || 'Upload failed');
    } finally { setLoading(''); }
  };

  return (
    <div style={{background:'#F8FAFC',minHeight:'100vh'}}>
      <Navbar />
      <div style={{maxWidth:'650px',margin:'40px auto',padding:'20px'}}>
        <h2 style={{color:'#1A56DB'}}>📎 Document Upload</h2>
        <p style={{color:'#6B7280',marginBottom:'24px'}}>Upload required documents. Only pdf, jpg, png files under 5MB allowed.</p>
        {error && <div style={{background:'#FEE2E2',color:'#991B1B',padding:'12px',borderRadius:'8px',marginBottom:'16px'}}>{error}</div>}
        {DOC_TYPES.map(doc => (
          <div key={doc.id} style={{background:'white',padding:'20px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.07)',marginBottom:'16px',border:uploaded[doc.id]?'2px solid #6EE7B7':'2px solid #E5E7EB'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <span style={{fontWeight:'bold',color:'#374151'}}>{doc.name}</span>
              <span style={{fontSize:'12px',background:doc.mandatory?'#FEE2E2':'#F3F4F6',color:doc.mandatory?'#991B1B':'#6B7280',padding:'3px 10px',borderRadius:'20px'}}>{doc.mandatory?'Required':'Optional'}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <input type='file' accept='.pdf,.jpg,.jpeg,.png'
                onChange={e=>setFiles({...files,[doc.id]:e.target.files[0]})} />
              <button style={{padding:'8px 20px',background:uploaded[doc.id]?'#059669':'#1A56DB',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold',whiteSpace:'nowrap'}}
                onClick={()=>handleUpload(doc.id)} disabled={loading===doc.id}>
                {loading===doc.id?'⏳':uploaded[doc.id]?'✅ Done':'⬆️ Upload'}</button>
            </div>
            {uploaded[doc.id] && <p style={{color:'#059669',fontSize:'13px',marginTop:'8px',fontWeight:'bold'}}>✅ Uploaded! Waiting for HR verification.</p>}
          </div>
        ))}
        <button style={{marginTop:'8px',padding:'12px 24px',background:'none',border:'2px solid #1A56DB',color:'#1A56DB',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}
          onClick={()=>navigate('/documents/status')}>View Document Status →</button>
      </div>
    </div>
  );
}