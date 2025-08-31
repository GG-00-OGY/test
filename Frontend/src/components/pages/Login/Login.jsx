import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
const base_url = process.env.REACT_APP_API_URL;
export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    national_code: "",
    password: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [focusField, setFocusField] = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
    // تابع نمایش Toast
    const showToast = (message, type = 'info', duration = 5000) => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), duration);
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${base_url}/login/teacher`,
        loginData,
        { withCredentials: true }
      );
      if (response.data.success) {
        showToast('ورود با موفقیت انجام شد', 'success');
        setTimeout(() => {
          navigate('/teacher');
        }, 1500); 
      }
    } catch (error) {
      if (error.response) {
      // خطاهای پاسخ سرور (مانند 400، 401 و ...)
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
      background: "white",
      position: "relative",
      fontFamily: "Vazirmatn, sans-serif",
      overflow: "hidden",
      padding: "20px",
    },
    shape: (top, left, size, color) => ({
      position: "absolute",
      top,
      left,
      width: size,
      height: size,
      background: color,
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.3,
      zIndex: 0,
    }),
    card: {
      position: "relative",
      zIndex: 1,
      background: "rgba(15, 23, 42, 0.92)",
      borderRadius: "16px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
      padding: "40px",
      width: "100%",
      maxWidth: "500px",
      textAlign: "center",
      color: "white",
      backdropFilter: "blur(8px)",
    },
    title: {
      fontSize: "1.8rem",
      marginBottom: "25px",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      padding: "14px",
      margin: "12px 0",
      borderRadius: "8px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 8px rgba(59,130,246,0.6)",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #2563eb, #1e3a8a)",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "15px",
      transition: "all 0.2s ease",
    },
    buttonHover: {
      transform: "scale(1.03)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    },
    buttonActive: {
      transform: "scale(0.97)",
    },toast: {
        position: 'fixed',
        top: '-120px',
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
      {/* پس‌زمینه رنگی */}
      <div style={styles.shape("10%", "20%", "250px", "#2563eb")}></div>
      <div style={styles.shape("60%", "70%", "300px", "#1e3a8a")}></div>
      <div style={styles.shape("80%", "10%", "200px", "#38bdf8")}></div>

      {/* فرم لاگین */}
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>ورود به سامانه معلمان</h2>
        <input
          type="text"
          name="national_code"
          placeholder="کد ملی"
          style={{
            ...styles.input,
            ...(focusField === "national_code" ? styles.inputFocus : {}),
          }}
          value={loginData.national_code}
          onFocus={() => setFocusField("national_code")}
          onBlur={() => setFocusField("")}
          onChange={handleChange}
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
          style={{
            ...styles.input,
            ...(focusField === "password" ? styles.inputFocus : {}),
          }}
          value={loginData.password}
          onFocus={() => setFocusField("password")}
          onBlur={() => setFocusField("")}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(hoverBtn ? styles.buttonHover : {}),
            ...(activeBtn ? styles.buttonActive : {}),
          }}
          onMouseEnter={() => setHoverBtn(true)}
          onMouseLeave={() => {
            setHoverBtn(false);
            setActiveBtn(false);
          }}
          onMouseDown={() => setActiveBtn(true)}
          onMouseUp={() => setActiveBtn(false)}
        >
          ورود
        </button>
      </form>
    </div>
  );
}
