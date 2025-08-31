import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    national_code: "",
    password: ""
  });
  const [focusField, setFocusField] = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    const base_url = process.env.REACT_APP_API_URL;
    console.log(base_url);
    
    e.preventDefault();
    (async () => {
      try {
        const res = await axios.post(`${base_url}/login/admin`, loginData, { withCredentials: true });
        console.debug('[AdminLogin] login response status:', res.status);
        try {
          console.debug('[AdminLogin] response headers:', res.headers);
        } catch (hErr) {
          console.debug('[AdminLogin] cannot read headers', hErr);
        }
        // Server should set HttpOnly cookie; do not store token in localStorage
        // در صورت موفقیت، به داشبورد ادمین هدایت می‌کنیم
        navigate('/admin');
      } catch (err) {
        console.error('خطا در ورود مدیر:', err?.response?.data || err.message || err);
        alert(err?.response?.data?.message || 'ورود ناموفق');
      }
    })();
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
      background: "rgba(42, 28, 71, 0.92)",
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
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    inputFocus: {
      borderColor: "#8b5cf6",
      boxShadow: "0 0 8px rgba(139,92,246,0.6)",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #7c3aed, #5b21b6)",
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
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.shape("15%", "25%", "250px", "#7c3aed")}></div>
      <div style={styles.shape("65%", "75%", "300px", "#5b21b6")}></div>
      <div style={styles.shape("85%", "15%", "200px", "#a78bfa")}></div>

      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>ورود به سامانه مدیران</h2>
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
          ورود مدیر
        </button>
      </form>
    </div>
  );
}
