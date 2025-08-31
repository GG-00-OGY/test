import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import AdminGuard from '../AdminGuard';
import axios from 'axios';
import './AdminLayout.css';

const base_url = process.env.REACT_APP_API_URL;

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
  try {
      await axios.post(`${base_url}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    }
    navigate('/AdminLogin');

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // استایل‌های اصلی
  const styles = {
    layout: {
      direction: 'rtl',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#ecf0f5'
    },
    mobileHeader: {
      display: isMobile ? 'flex' : 'none',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '0 15px',
      height: '60px',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'fixed',
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    sidebar: {
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'fixed',
      right: 0,
      top: isMobile ? '60px' : 0,
      zIndex: 999,
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#3c8dbc #2c3e50',
      ...(isMobile
        ? {
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            transform: sidebarOpen ? 'translateY(0)' : 'translateY(-60px)',
            transition: 'transform 0.3s ease',
            border: 'none'
          }
        : {
            width: '250px',
            height: '100vh'
          })
    },
    content: {
      flex: 1,
      padding: '20px',
      marginRight: isMobile ? 0 : '250px',
      minHeight: '100vh',
      backgroundColor: '#ecf0f5',
      paddingTop: isMobile ? '120px' : '20px',
      transition: 'padding-top 0.3s ease'
    },
    menuList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      ...(isMobile
        ? {
            display: 'flex',
            flexDirection: 'row',
            height: '100%'
          }
        : {
            display: 'block'
          })
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      color: '#b8c7ce',
      textDecoration: 'none',
      textAlign: 'right',
      fontSize: isMobile ? '0.9rem' : '1.05rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      ...(isMobile
        ? {
            padding: '0 18px',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center'
          }
        : {
            padding: '14px 22px'
          })
    },
    activeMenuItem: {
      color: 'white',
      backgroundColor: '#3c8dbc'
    },
    menuSection: {
      color: '#4b646f',
      backgroundColor: '#1a2226',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textAlign: 'right',
      textShadow: '0 1px 0 rgba(0,0,0,0.3)',
      ...(isMobile
        ? {
            display: 'none'
          }
        : {
            padding: '12px 20px',
            marginTop: '15px'
          })
    },
    icon: {
      marginLeft: isMobile ? 0 : '12px',
      marginBottom: isMobile ? '6px' : 0,
      fontSize: isMobile ? '1.1rem' : '1.2rem'
    },
    contentWrapper: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '8px',
      boxShadow: '0 1px 5px rgba(0, 0, 0, 0.12)',
      minHeight: 'calc(100vh - 50px)'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#b8c7ce',
      textDecoration: 'none',
      textAlign: 'right',
      fontSize: isMobile ? '0.9rem' : '1.05rem',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      ...(isMobile
        ? {
            padding: '0 18px',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center'
          }
        : {
            padding: '14px 22px'
          })
    }
  };

  return (
    <div style={styles.layout}>
      {/* نوار هدر موبایل */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '10px'
            }}
            aria-label="Toggle sidebar"
          >
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`} />
          </button>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>پنل مدیریت</h2>
          {/* دکمه خروج در هدر موبایل */}
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '10px'
            }}
            aria-label="Logout"
          >
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* نوار کناری */}
        <aside style={styles.sidebar}>
          {!isMobile && (
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'right'
              }}
            >
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>
                پنل مدیریت
              </h3>
            </div>
          )}

          <ul style={styles.menuList}>
            {/* منوی اصلی */}
            {!isMobile && <li style={styles.menuSection}>منوی اصلی</li>}
            <li>
              <NavLink
                to="/admin"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                end
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-tachometer-alt" style={styles.icon} />
                <span>داشبورد</span>
              </NavLink>
            </li>

            {/* مدیریت دانش‌آموزان */}
            {!isMobile && <li style={styles.menuSection}>مدیریت دانش‌آموزان</li>}
            <li>
              <NavLink
                to="/admin/add-student"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-user-graduate" style={styles.icon} />
                <span>افزودن دانش‌آموز</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/pre-registrations"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-clipboard-list" style={styles.icon} />
                <span>پیش‌ثبت‌نام‌ها</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/student-debts"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-money-bill-wave" style={styles.icon} />
                <span>بدهی‌های دانش‌آموزان</span>
              </NavLink>
            </li>

            {/* مدیریت کارکنان */}
            {!isMobile && <li style={styles.menuSection}>مدیریت کارکنان</li>}
            <li>
              <NavLink
                to="/admin/add-teacher"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-chalkboard-teacher" style={styles.icon} />
                <span>افزودن معلم</span>
              </NavLink>
            </li>

            {/* مدیریت کلاس‌ها */}
            {!isMobile && <li style={styles.menuSection}>مدیریت کلاس‌ها</li>}
            <li>
              <NavLink
                to="/admin/create-class"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-school" style={styles.icon} />
                <span>ایجاد کلاس</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/class-list"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-list" style={styles.icon} />
                <span>لیست کلاس‌ها</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/add-extra-class"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-plus-circle" style={styles.icon} />
                <span>افزودن کلاس اضافه</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/EditWeeklySchuldent"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-edit" style={styles.icon} />
                <span> تنظیم برنامه هفتگی </span>
              </NavLink>
            </li>

                <li>
              <NavLink
                to="/admin/WeeklySchuldentTeacher"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-edit" style={styles.icon} />
                <span>تنظیم برنامه کاری معلم</span>
              </NavLink>
            </li>

            {/* حضور و غیاب */}
            {!isMobile && <li style={styles.menuSection}>حضور و غیاب</li>}
            <li>
              <NavLink
                to="/admin/view-absences"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-calendar-check" style={styles.icon} />
                <span>مشاهده غایب‌ها</span>
              </NavLink>
            </li>

            {/* فعالیت‌ها */}
            {!isMobile && <li style={styles.menuSection}>فعالیت‌ها</li>}
            <li>
              <NavLink
                to="/admin/create-trip"
                style={({ isActive }) => ({
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                })}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <i className="fas fa-bus" style={styles.icon} />
                <span>ایجاد اردو</span>
              </NavLink>
            </li>

            {/* بخش خروج */}
            {!isMobile && <li style={styles.menuSection}>حساب کاربری</li>}
            <li>
              <button
                onClick={handleLogout}
                style={{
                  ...styles.logoutButton,
                  ':hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <i className="fas fa-sign-out-alt" style={styles.icon} />
                <span>خروج</span>
              </button>
            </li>
          </ul>
        </aside>

        {/* محتوای اصلی */}
        <main style={styles.content}>
          <div style={styles.contentWrapper}>
            <AdminGuard>
              <Outlet />
            </AdminGuard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;