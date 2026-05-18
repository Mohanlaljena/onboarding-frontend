export default function ProgressBar({ percent }) {
  const color = percent === 100 ? '#059669' : percent > 50 ? '#1A56DB' : '#D97706';
  return (
    <div style={{marginBottom:'8px'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
        <span style={{fontSize:'14px',fontWeight:'bold',color:'#374151'}}>Onboarding Progress</span>
        <span style={{fontSize:'14px',fontWeight:'bold',color}}>{percent}%</span>
      </div>
      <div style={{background:'#E5E7EB',borderRadius:'10px',height:'16px',overflow:'hidden'}}>
        <div style={{background:color,height:'100%',width:percent+'%',borderRadius:'10px',transition:'width 0.6s ease'}} />
      </div>
    </div>
  );
}