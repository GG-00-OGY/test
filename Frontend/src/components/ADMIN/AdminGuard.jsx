import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const base_url = process.env.REACT_APP_API_URL;

// Toggle this to true to temporarily bypass admin validation during local testing.
// IMPORTANT: don't leave this enabled in production.
const DISABLE_ADMIN_GUARD = false;

export default function AdminGuard({ children }) {
  if (DISABLE_ADMIN_GUARD) {
    console.warn('[AdminGuard] DISABLED - bypassing auth checks (development only)');
    return <>{children}</>;
  }
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const validateServer = async () => {
      console.debug('[AdminGuard] validateServer starting... (withCredentials -> true)');
      try {
        const res = await axios.get(`${base_url}/dashbord/auth/validate`, { withCredentials: true });
        try {
          const cookie = document.cookie || '<no document.cookie available>';
          console.debug('[AdminGuard] document.cookie:', cookie);
        } catch (cErr) {
          console.debug('[AdminGuard] cannot read document.cookie', cErr);
        }

        const data = res.data;
        const isAdminServer = data && (data.role === 'admin' || data.isAdmin === true || data.admin === true || data.role === 'administrator');
        if (!isAdminServer) {
          console.error('[AdminGuard] validated user is not admin, redirecting to /AdminLogin');
          if (mounted) navigate('/AdminLogin', { replace: true });
          return;
        }
        if (mounted) setValidated(true);
      } catch (err) {
        console.error('[AdminGuard] axios validate error:', err?.response?.status, err?.response?.data || err.message);
        if (mounted) navigate('/AdminLogin', { replace: true });
      }
    };

    validateServer();

    return () => { mounted = false; };
  }, [navigate]);

  if (!validated) {
    return (
      <div style={{minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 8}}>در حال اعتبارسنجی دسترسی ادمین...</div>
          <div style={{width:24, height:24, border:'3px solid #ccc', borderTop:'3px solid #333', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto'}} />
          <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
