import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const base_url = process.env.REACT_APP_API_URL;
const PreRegisterLogin = () => {
  const [loginData, setLoginData] = useState({
    national_code: "",
    password: ""
  });
  
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
      // تابع نمایش Toast
      const showToast = (message, type = 'info', duration = 5000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), duration);
      };
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${base_url}/login/student`,
        loginData ,
         { withCredentials: true }
      );

      if (response.data.success) {
       showToast('ورود با موفقیت انجام شد', 'success');
        setTimeout(() => {
          navigate('/student');
        }, 1500); 
      }
    } catch (error) {
         if (error.response) {
            if (error.response.status === 400 || error.response.status === 401) {
                    showToast('کدملی یا رمز عبور اشتباه است', 'error');
      } else {
        showToast('خطا در سرور', 'error');
      }
    } else if (error.request) {
      // مشکل در ارسال درخواست
      showToast('خطا در اتصال به سرور', 'error');
    } else {
      showToast('خطای نامشخص', 'error');
    }
    console.error("خطا در ورود:", error);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: "'Vazirmatn', sans-serif",
      padding: "20px",
      direction: "rtl"
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      padding: "40px",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center"
    },
    title: {
      color: "#1a73e8",
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "30px"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      marginBottom: "20px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
      ":focus": {
        borderColor: "#1a73e8",
        boxShadow: "0 0 0 3px rgba(26,115,232,0.2)"
      }
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#1a73e8",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "10px",
      ":hover": {
        backgroundColor: "#0d62c9",
        transform: "translateY(-2px)"
      },
      ":active": {
        transform: "translateY(0)"
      }
    },
    note: {
      marginTop: "30px",
      paddingTop: "15px",
      borderTop: "1px solid #f1f1f1",
      color: "#5f6368",
      fontSize: "13px"
    },toast: {
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
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

  return (
    <div style={styles.container}>
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
      <div style={styles.card}>
        <h2 style={styles.title}>ورود دانش آموزان</h2>
        <form onSubmit={handlePreRegister}>
          <input
            type="text"
            name="national_code"
            placeholder="کد ملی"
            value={loginData.national_code}
            onChange={handleLoginChange}
            style={styles.input}
            required
          />
          {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: styles.toast.backgroundColor(toast.type)
        }}>
          {toast.message}
        </div>
      )}
          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={loginData.password}
            onChange={handleLoginChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            ورود
          </button>
        </form>
        <Link to={"/loginS2"}>
          <div style={styles.note}>
            اگر ثبت‌نام نکرده‌اید، به صفحه ثبت‌نام کامل بروید
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PreRegisterLogin;
