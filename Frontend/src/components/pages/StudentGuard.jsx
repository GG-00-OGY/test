import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

export default function StudentGuard({ children }) {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const validateServer = async () => {
      try {
        const res = await axios.get(`${API_BASE}/dashbord/auth/validate/student`, { withCredentials: true });
        const data = res.data;
        const isStudent = data && (data.role === 'student' || data.isStudent === true);
        if (!isStudent) {
          if (mounted) navigate('/loginS', { replace: true });
          return;
        }
        if (mounted) setValidated(true);
      } catch (err) {
        if (mounted) navigate('/loginS', { replace: true });
      }
    };

    validateServer();

    return () => { mounted = false; };
  }, [navigate]);

  if (!validated) {
    return (
      <div style={{minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 8}}>در حال اعتبارسنجی دسترسی دانش‌آموز...</div>
          <div style={{width:24, height:24, border:'3px solid #ccc', borderTop:'3px solid #333', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto'}} />
          <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}