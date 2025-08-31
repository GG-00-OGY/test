import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const base_url = process.env.REACT_APP_API_URL;
const PremiumLoginPage = () => {
  const [national_code, setNationalCode] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [particles, setParticles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // تابع نمایش Toast
  const showToast = (message, type = 'info', duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), duration);
  };

  // ایجاد ذرات متحرک برای پس‌زمینه
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX) % 100,
        y: (p.y + p.speedY) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    
    if (!national_code.trim()) {
      newErrors.national_code = '⚠️ لطفا کد ملی خود را وارد کنید';
    } else if (!/^\d{10}$/.test(national_code)) {
      newErrors.national_code = '⚠️ کد ملی باید 10 رقم باشد';
    }
    
    if (!password.trim()) {
      newErrors.password = '⚠️ لطفا رمز عبور خود را وارد کنید';
    } else if (password.length < 8) {
      newErrors.password = '⚠️ رمز عبور باید حداقل 8 کاراکتر باشد';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ارسال فرم به API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${base_url}/login/admin`,
        { national_code, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        showToast('ورود با موفقیت انجام شد', 'success');
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        showToast('کدملی یا پسورد اشتباه است!', 'error');
      } else {
        showToast('خطا در ورود', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // استایل‌های کامپوننت
  const styles = {
    mainContainer: {
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Vazir', 'Droid Arabic Naskh', sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      direction: 'rtl',
      padding: '20px',
    },
    particle: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(1px)',
      opacity: '0.7',
    },
    loginContainer: {
      position: 'relative',
      zIndex: '2',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      padding: '50px',
      width: '100%',
      maxWidth: '500px',
      textAlign: 'center',
      transform: 'translateY(0)',
      transition: 'transform 0.5s ease, box-shadow 0.5s ease',
    },
    title: {
      color: '#2c3e50',
      marginBottom: '40px',
      fontSize: '32px',
      fontWeight: '900',
      textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
      letterSpacing: '1px',
      position: 'relative',
      paddingBottom: '15px',
    },
    inputGroup: { 
      marginBottom: '30px', 
      textAlign: 'right', 
      position: 'relative' 
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      color: '#555',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      transformOrigin: 'right center',
    },
    input: {
      width: '100%',
      padding: '18px 25px',
      border: '2px solid #eee',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '500',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    inputActive: { 
      transform: 'scale(1.02)', 
      boxShadow: '0 8px 20px rgba(52, 152, 219, 0.4)' 
    },
    inputError: { 
      borderColor: '#e74c3c', 
      backgroundColor: 'rgba(231, 76, 60, 0.05)' 
    },
    error: { 
      color: '#e74c3c', 
      fontSize: '14px', 
      marginTop: '8px', 
      display: 'block', 
      textAlign: 'right', 
      fontWeight: '500', 
      animation: 'shake 0.5s ease' 
    },
    button: {
      width: '100%',
      padding: '18px',
      background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
      marginTop: '20px',
      boxShadow: '0 5px 15px rgba(52, 152, 219, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      zIndex: '1',
    },
    buttonDisabled: {
      cursor: 'not-allowed',
      background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
    },
    spinner: { 
      display: 'inline-block', 
      width: '24px', 
      height: '24px', 
      border: '4px solid rgba(255,255,255,0.3)', 
      borderRadius: '50%', 
      borderTopColor: 'white', 
      animation: 'spin 1s ease-in-out infinite', 
      marginLeft: '10px', 
      verticalAlign: 'middle' 
    },
    forgotPassword: { 
      display: 'block', 
      marginTop: '20px', 
      color: '#7f8c8d', 
      fontSize: '14px', 
      fontWeight: '500', 
      textDecoration: 'none' 
    },
    logo: { 
      width: '80px', 
      height: '80px', 
      margin: '0 auto 30px', 
      borderRadius: '50%', 
      backgroundColor: '#3498db', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      color: 'white', 
      fontSize: '28px', 
      fontWeight: 'bold', 
      boxShadow: '0 5px 15px rgba(52, 152, 219, 0.4)' 
    },
    footer: { 
      marginTop: '40px', 
      paddingTop: '20px', 
      borderTop: '1px solid #eee', 
      color: '#7f8c8d', 
      fontSize: '14px' 
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 25px',
      color: 'white',
      borderRadius: '4px',
      zIndex: 1000,
      animation: 'toastSlideIn 0.3s ease-out',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      backgroundColor: type => 
        type === 'success' ? '#4CAF50' :
        type === 'error' ? '#F44336' :
        type === 'warning' ? '#FF9800' : '#2196F3'
    }
  };

  const getInputStyle = (fieldName) => {
    const isError = errors[fieldName];
    const isActive = activeField === fieldName;
    return {
      ...styles.input,
      ...(isError ? styles.inputError : {}),
      ...(isActive ? styles.inputActive : {}),
    };
  };

  return (
    <div style={styles.mainContainer}>
      <style>
        {`
          @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes spin { 
            to { transform: rotate(360deg); } 
          }
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            10%,30%,50%,70%,90% { transform: translateX(-5px); }
            20%,40%,60%,80% { transform: translateX(5px); }
          }
        `}
      </style>
      
      {particles.map(p => (
        <div key={p.id} style={{
          ...styles.particle,
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color
        }} />
      ))}

      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: styles.toast.backgroundColor(toast.type)
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.loginContainer}>
        <div style={styles.logo}>AM</div>
        <h1 style={styles.title}>ورود به پنل مدیریت</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>کد ملی</label>
            <input
              type="text"
              value={national_code}
              onChange={e => setNationalCode(e.target.value)}
              style={getInputStyle('national_code')}
              onFocus={() => setActiveField('national_code')}
              onBlur={() => setActiveField(null)}
              maxLength="10"
              placeholder="مثال: 1234567890"
            />
            {errors.national_code && <span style={styles.error}>{errors.national_code}</span>}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={getInputStyle('password')}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField(null)}
              placeholder="حداقل 8 کاراکتر"
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>
          <button
            type="submit"
            style={{ 
              ...styles.button, 
              ...(isLoading ? styles.buttonDisabled : {}) 
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                در حال ورود
                <span style={styles.spinner} />
              </>
            ) : 'ورود به سیستم'}
          </button>
          <a href="#" style={styles.forgotPassword}>رمز عبور خود را فراموش کرده‌اید؟</a>
        </form>
        <div style={styles.footer}>سیستم مدیریت یکپارچه - نسخه ۲.۰</div>
      </div>
    </div>
  );
};

export default PremiumLoginPage;