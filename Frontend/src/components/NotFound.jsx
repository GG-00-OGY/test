import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.stars}></div>
      <div style={styles.stars2}></div>
      <div style={styles.stars3}></div>
      
      <div style={styles.errorContent}>
        <div style={styles.errorMessage}>
          <h1 style={styles.errorCode}>404</h1>
          <h2 style={styles.errorTitle}>صفحه مورد نظر یافت نشد</h2>
          <p style={styles.errorDescription}>
            به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است جابجا شده باشد.
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => navigate(-1)} 
              style={styles.primaryButton}
            >
              بازگشت
            </button>
            <button 
              onClick={() => navigate('/')} 
              style={styles.secondaryButton}
            >
              صفحه اصلی
            </button>
          </div>
        </div>
        
        <div style={styles.astronautContainer}>
          <div style={styles.astronaut}>
            <div style={styles.helmet}>
              <div style={styles.visor}></div>
              <div style={styles.visorShine}></div>
            </div>
            <div style={styles.head}></div>
            <div style={styles.body}>
              <div style={styles.armLeft}></div>
              <div style={styles.armRight}></div>
              <div style={styles.belt}></div>
            </div>
            <div style={styles.legLeft}></div>
            <div style={styles.legRight}></div>
            <div style={styles.backpack}></div>
          </div>
          <div style={styles.moon}></div>
          <div style={styles.ship}></div>
        </div>
      </div>
      
      <div style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} شرکت شما. تمام حقوق محفوظ است.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  
  // ستاره‌ها و پس‌زمینه فضایی
  stars: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    animation: 'animStar 50s linear infinite',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1px',
      height: '1px',
      background: 'transparent',
      boxShadow: `
        100px 100px #fff,
        400px 200px #fff,
        700px 300px #fff,
        200px 500px #fff,
        600px 600px #fff,
        300px 700px #fff,
        800px 800px #fff,
        500px 1000px #fff,
        900px 1100px #fff,
        1100px 1200px #fff
      `,
    },
  },
  
  stars2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    animation: 'animStar 100s linear infinite',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '2px',
      height: '2px',
      background: 'transparent',
      boxShadow: `
        50px 150px #fff,
        300px 250px #fff,
        500px 350px #fff,
        150px 450px #fff,
        550px 550px #fff,
        250px 650px #fff,
        750px 750px #fff,
        450px 950px #fff,
        850px 1050px #fff,
        1050px 1150px #fff
      `,
    },
  },
  
  stars3: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    animation: 'animStar 150s linear infinite',
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '3px',
      height: '3px',
      background: 'transparent',
      boxShadow: `
        150px 50px #fff,
        350px 150px #fff,
        650px 250px #fff,
        250px 350px #fff,
        750px 450px #fff,
        350px 550px #fff,
        850px 650px #fff,
        550px 750px #fff,
        950px 850px #fff,
        1150px 950px #fff
      `,
    },
  },
  
  errorContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    zIndex: 1,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      textAlign: 'center',
    },
  },
  
  errorMessage: {
    flex: 1,
    padding: '0 40px',
    '@media (max-width: 768px)': {
      padding: '0 20px',
      marginBottom: '40px',
    },
  },
  
  errorCode: {
    fontSize: '120px',
    fontWeight: 900,
    margin: 0,
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    '@media (max-width: 768px)': {
      fontSize: '80px',
    },
  },
  
  errorTitle: {
    fontSize: '36px',
    fontWeight: 700,
    margin: '20px 0 15px',
    color: '#ffffff',
    '@media (max-width: 768px)': {
      fontSize: '28px',
    },
  },
  
  errorDescription: {
    fontSize: '18px',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 30px',
    maxWidth: '500px',
    '@media (max-width: 768px)': {
      fontSize: '16px',
      maxWidth: '100%',
    },
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    },
  },
  
  primaryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(110, 142, 251, 0.4)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(110, 142, 251, 0.6)',
    },
    ':active': {
      transform: 'translateY(1px)',
    },
  },
  
  secondaryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    background: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.5)',
      transform: 'translateY(-3px)',
    },
    ':active': {
      transform: 'translateY(1px)',
    },
  },
  
  astronautContainer: {
    position: 'relative',
    width: '400px',
    height: '400px',
    '@media (max-width: 768px)': {
      width: '300px',
      height: '300px',
    },
  },
  
  astronaut: {
    position: 'absolute',
    width: '150px',
    height: '180px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
    animation: 'float 6s ease-in-out infinite',
  },
  
  head: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
  },
  
  helmet: {
    position: 'absolute',
    width: '70px',
    height: '70px',
    backgroundColor: 'transparent',
    border: '3px solid #fff',
    borderRadius: '50%',
    top: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 4,
  },
  
  visor: {
    position: 'absolute',
    width: '50px',
    height: '25px',
    backgroundColor: '#3a3a3a',
    borderRadius: '20px 20px 0 0',
    top: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 5,
  },
  
  visorShine: {
    position: 'absolute',
    width: '15px',
    height: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '5px',
    top: '20px',
    left: '60%',
    transform: 'translateX(-50%)',
    zIndex: 6,
  },
  
  body: {
    position: 'absolute',
    width: '70px',
    height: '80px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
  },
  
  armLeft: {
    position: 'absolute',
    width: '20px',
    height: '50px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    top: '70px',
    left: '15px',
    transform: 'rotate(30deg)',
    transformOrigin: 'top center',
    animation: 'armLeftMove 3s ease-in-out infinite',
    zIndex: 1,
  },
  
  armRight: {
    position: 'absolute',
    width: '20px',
    height: '50px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    top: '70px',
    right: '15px',
    transform: 'rotate(-30deg)',
    transformOrigin: 'top center',
    animation: 'armRightMove 3s ease-in-out infinite',
    zIndex: 1,
  },
  
  belt: {
    position: 'absolute',
    width: '70px',
    height: '15px',
    backgroundColor: '#3a3a3a',
    borderRadius: '5px',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
  },
  
  legLeft: {
    position: 'absolute',
    width: '25px',
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '0 0 10px 10px',
    bottom: '-40px',
    left: '30px',
    zIndex: 1,
  },
  
  legRight: {
    position: 'absolute',
    width: '25px',
    height: '40px',
    backgroundColor: '#fff',
    borderRadius: '0 0 10px 10px',
    bottom: '-40px',
    right: '30px',
    zIndex: 1,
  },
  
  backpack: {
    position: 'absolute',
    width: '30px',
    height: '50px',
    backgroundColor: '#3a3a3a',
    borderRadius: '5px',
    top: '80px',
    left: '-20px',
    zIndex: 1,
  },
  
  moon: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 'inset -20px -20px 40px rgba(0, 0, 0, 0.3)',
    '@media (max-width: 768px)': {
      width: '200px',
      height: '200px',
    },
  },
  
  ship: {
    position: 'absolute',
    width: '100px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    top: '20%',
    right: '10%',
    transform: 'rotate(20deg)',
    animation: 'shipMove 10s linear infinite',
    '::before': {
      content: '""',
      position: 'absolute',
      width: '30px',
      height: '30px',
      backgroundColor: 'rgba(110, 142, 251, 0.3)',
      borderRadius: '50%',
      top: '-15px',
      left: '-15px',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      width: '10px',
      height: '40px',
      backgroundColor: 'rgba(110, 142, 251, 0.5)',
      borderRadius: '5px',
      top: '0',
      right: '-5px',
    },
  },
  
  footer: {
    position: 'absolute',
    bottom: '20px',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  
  footerText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  
  // انیمیشن‌های Keyframes
  '@keyframes animStar': {
    'from': { transform: 'translateY(0px)' },
    'to': { transform: 'translateY(-2000px)' },
  },
  
  '@keyframes float': {
    '0%': { transform: 'translate(-50%, -50%) translateY(0px)' },
    '50%': { transform: 'translate(-50%, -50%) translateY(-20px)' },
    '100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
  },
  
  '@keyframes armLeftMove': {
    '0%': { transform: 'rotate(30deg)' },
    '50%': { transform: 'rotate(40deg)' },
    '100%': { transform: 'rotate(30deg)' },
  },
  
  '@keyframes armRightMove': {
    '0%': { transform: 'rotate(-30deg)' },
    '50%': { transform: 'rotate(-40deg)' },
    '100%': { transform: 'rotate(-30deg)' },
  },
  
  '@keyframes shipMove': {
    '0%': { 
      transform: 'rotate(20deg) translateX(0)',
      opacity: 0,
    },
    '10%': { opacity: 1 },
    '90%': { opacity: 1 },
    '100%': { 
      transform: 'rotate(20deg) translateX(-500px)',
      opacity: 0,
    },
  },
};

export default NotFoundPage;