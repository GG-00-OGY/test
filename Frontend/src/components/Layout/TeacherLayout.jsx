import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faEnvelope, 
  faCalendarAlt,
  faUserTie,
  faSignOutAlt,
  faGraduationCap,
  faBook,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const base_url = process.env.REACT_APP_API_URL;

const TeacherLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // مدیریت تغییر سایز صفحه
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // تعیین تب فعال بر اساس مسیر
  useEffect(() => {
    const path = location.pathname;
    if (path === '/teacher' || path === '/pishkhan') setActiveTab('dashboard');
    else if (path === '/my-classes') setActiveTab('classes');
    else if (path === '/message') setActiveTab('messages');
    else if (path === '/schedule') setActiveTab('schedule');
  }, [location]);

  // گرفتن اطلاعات معلم از سرور با JWT
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${base_url}/dashbord/teacher`, { withCredentials: true });
        
        setTeacher(res.data.teacher); // ✅ درست
      } catch (err) {
        console.error('JWT invalid or fetch error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [navigate]);

  const handleNavigation = (path, tab) => {
    setActiveTab(tab);
    navigate(path);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${base_url}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    }
    navigate('/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const combineStyles = (...styleObjects) => Object.assign({}, ...styleObjects);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!teacher) return null;

  // --- استایل‌ها همان نسخه قبلی ---
  const styles = {
    root: {
      '--primary-color': '#4e73df',
      '--secondary-color': '#f8f9fc',
      '--accent-color': '#2e59d9',
      '--text-color': '#5a5c69',
      '--light-gray': '#eaecf4',
      '--white': '#ffffff',
      '--shadow': '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)'
    },
    app: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--secondary-color)',
      position: 'relative'
    },
    sidebar: {
      width: '250px',
      background: 'var(--white)',
      boxShadow: 'var(--shadow)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      zIndex: 100,
      transition: 'transform 0.3s ease',
      transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)') : 'translateX(0)'
    },
    sidebarHeader: {
      padding: '1.5rem 1rem',
      background: 'var(--primary-color)',
      color: 'var(--white)',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative'
    },
    sidebarHeaderH2: {
      fontSize: '1.2rem',
      marginTop: '10px'
    },
    logoIcon: {
      fontSize: '2rem'
    },
    sidebarMenu: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem 0'
    },
    sidebarMenuUl: {
      listStyle: 'none'
    },
    sidebarMenuLi: {
      padding: '0.75rem 1.5rem',
      margin: '0.25rem 0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      color: 'var(--text-color)',
      transition: 'all 0.3s'
    },
    sidebarMenuLiActive: {
      backgroundColor: 'var(--light-gray)',
      color: 'var(--primary-color)',
      borderRight: '3px solid var(--primary-color)'
    },
    sidebarMenuIcon: {
      marginLeft: '10px',
      width: '20px'
    },
    badge: {
      background: 'var(--primary-color)',
      color: 'white',
      borderRadius: '50%',
      width: '22px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      marginRight: 'auto'
    },
    mainContent: {
      flex: 1,
      marginRight: isMobile ? '0' : '250px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
    appHeader: {
      background: 'var(--white)',
      boxShadow: 'var(--shadow)',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 90
    },
    appHeaderH1: {
      fontSize: '1.5rem',
      color: 'var(--text-color)'
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'var(--primary-color)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoutBtn: {
      background: 'transparent',
      border: 'none',
      color: 'var(--text-color)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '0.5rem',
      borderRadius: '5px'
    },
    scrollableContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '2rem',
      backgroundColor: 'var(--secondary-color)'
    },
    contentArea: {
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    },
    welcomeMessage: {
      background: 'var(--white)',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: 'var(--shadow)',
      marginBottom: '2rem'
    },
    welcomeMessageH2: {
      color: 'var(--primary-color)',
      marginBottom: '1rem',
      fontSize: '1.8rem'
    },
    welcomeMessageP: {
      color: 'var(--text-color)',
      lineHeight: '1.8',
      fontSize: '1.1rem'
    },
    statsCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    statCard: {
      background: 'var(--white)',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)',
      textAlign: 'center'
    },
    statCardH3: {
      color: 'var(--text-color)',
      fontSize: '1.2rem',
      marginBottom: '0.5rem'
    },
    statCardP: {
      color: 'var(--primary-color)',
      fontSize: '2.2rem',
      fontWeight: 'bold'
    },
    mobileMenuBtn: {
      background: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft: '1rem',
      display: isMobile ? 'block' : 'none'
    },
    closeMenuBtn: {
      position: 'absolute',
      left: '10px',
      top: '10px',
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: isMobile ? 'block' : 'none'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99,
      display: isMobile && mobileMenuOpen ? 'block' : 'none'
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.app}>
        {isMobile && <div style={styles.overlay} onClick={toggleMobileMenu} />}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <FontAwesomeIcon icon={faGraduationCap} style={styles.logoIcon} />
            <h2 style={styles.sidebarHeaderH2}>پنل معلم</h2>
            <button onClick={toggleMobileMenu} style={styles.closeMenuBtn}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <nav style={styles.sidebarMenu}>
            <ul style={styles.sidebarMenuUl}>
              <li onClick={() => handleNavigation('/my-classes', 'classes')} style={combineStyles(styles.sidebarMenuLi, activeTab==='classes' && styles.sidebarMenuLiActive)}>
                <FontAwesomeIcon icon={faBook} style={styles.sidebarMenuIcon} />
                <span>کلاس‌های من</span>
              </li>
              <li onClick={() => handleNavigation('/message', 'messages')} style={combineStyles(styles.sidebarMenuLi, activeTab==='messages' && styles.sidebarMenuLiActive)}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.sidebarMenuIcon} />
                <span>پیام‌ها</span>
              </li>
              <li onClick={() => handleNavigation('/schedule', 'schedule')} style={combineStyles(styles.sidebarMenuLi, activeTab==='schedule' && styles.sidebarMenuLiActive)}>
                <FontAwesomeIcon icon={faCalendarAlt} style={styles.sidebarMenuIcon} />
                <span>برنامه هفتگی</span>
              </li>
            </ul>
          </nav>
        </div>

        <div style={styles.mainContent}>
          <header style={styles.appHeader}>
            <div style={{ display:'flex', alignItems:'center' }}>
              <button onClick={toggleMobileMenu} style={styles.mobileMenuBtn}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h1 style={styles.appHeaderH1}>
                {activeTab==='classes' && 'کلاس‌های من'}
                {activeTab==='messages' && 'پیام‌ها'}
                {activeTab==='schedule' && 'برنامه هفتگی'}
              </h1>
            </div>
            <div style={styles.userProfile}>
              <div style={styles.avatar}><FontAwesomeIcon icon={faUserTie} /></div>
              <span>{teacher.first_name} {teacher.last_name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>خروج</span>
              </button>
            </div>
          </header>
          <div style={styles.scrollableContainer}>
            <div style={styles.contentArea}>
              {children || (
                <div style={styles.welcomeMessage}>
                  <h2 style={styles.welcomeMessageH2}>سلام {teacher.first_name} عزیز!</h2>
                  <p style={styles.welcomeMessageP}>به پنل مدیریت معلم خوش آمدید. از منوی سمت راست بخش مورد نظر را انتخاب کنید.</p>
                  <div style={styles.statsCards}>
                    <div style={styles.statCard}><h3 style={styles.statCardH3}>کلاس‌های فعال</h3><p style={styles.statCardP}>{teacher.courses}</p></div>
                    <div style={styles.statCard}><h3 style={styles.statCardH3}>پیام‌های خوانده نشده</h3><p style={styles.statCardP}>{teacher.messages}</p></div>
                    <div style={styles.statCard}><h3 style={styles.statCardH3}>جلسات این هفته</h3><p style={styles.statCardP}>{teacher.schedule}</p></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
