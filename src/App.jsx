import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SetupPassword from './pages/SetupPassword';
import ProfileSetup from './pages/ProfileSetup';
import DocumentUpload from './pages/DocumentUpload';
import DocumentStatus from './pages/DocumentStatus';
import Checklist from './pages/Checklist';
import HRDashboard from './pages/HRDashboard';
import HRVerifyDocs from './pages/HRVerifyDocs';

const Guard = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to='/login' />;
  if (role && user.role !== role) return <Navigate to='/login' />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/setup' element={<SetupPassword />} />
        <Route path='/profile' element={<Guard role='employee'><ProfileSetup /></Guard>} />
        <Route path='/documents' element={<Guard role='employee'><DocumentUpload /></Guard>} />
        <Route path='/documents/status' element={<Guard role='employee'><DocumentStatus /></Guard>} />
        <Route path='/checklist' element={<Guard role='employee'><Checklist /></Guard>} />
        <Route path='/hr' element={<Guard role='hr'><HRDashboard /></Guard>} />
        <Route path='/hr/verify/:userId' element={<Guard role='hr'><HRVerifyDocs /></Guard>} />
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}