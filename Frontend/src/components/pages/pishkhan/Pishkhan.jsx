import React, { useState, useEffect } from 'react';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaChartLine,
  FaSearch,
  FaEllipsisH
} from 'react-icons/fa';
import TeacherLayout from '../../Layout/TeacherLayout';

const base_url = process.env.REACT_APP_API_URL;

const TeacherDashboard = () => {
  // Color palette
  const colors = {
    primary: '#4361ee',
    secondary: '#3f37c9',
    accent: '#4895ef',
    dark: '#1b263b',
    light: '#f8f9fa',
    white: '#ffffff',
    gray: '#6c757d',
    lightGray: '#e9ecef',
    darkGray: '#343a40',
    success: '#4cc9f0',
    warning: '#faa307',
    danger: '#ef233c'
  };

  // Responsive styles
  const styles = {
    container: {
      maxWidth: '1800px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: "'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: colors.dark,
      minHeight: '100vh',
      '@media (max-width: 768px)': {
        padding: '16px'
      }
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px',
      padding: '0 16px',
      '@media (max-width: 768px)': {
        marginBottom: '32px'
      }
    },
    title: {
      fontSize: 'clamp(1.5rem, 5vw, 3rem)',
      marginBottom: '12px',
      color: colors.dark,
      fontWeight: 800,
      lineHeight: 1.2
    },
    subtitle: {
      fontSize: 'clamp(0.9rem, 2vw, 1.5rem)',
      color: colors.gray,
      maxWidth: '800px',
      margin: '0 auto'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
      padding: '0 8px',
      '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr',
        gap: '12px'
      }
    },
    statCard: {
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: colors.white,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
      },
      '@media (max-width: 768px)': {
        padding: '20px'
      }
    },
    statContent: {
      flex: 1
    },
    statTitle: {
      fontSize: '1rem',
      marginBottom: '8px',
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: 500,
      '@media (max-width: 768px)': {
        fontSize: '0.9rem'
      }
    },
    statValue: {
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: 700,
      lineHeight: 1.2
    },
    statIcon: {
      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
      opacity: 0.9,
      marginLeft: '16px',
      '@media (max-width: 768px)': {
        marginLeft: '12px',
        fontSize: '2rem'
      }
    },
    mainContent: {
      backgroundColor: colors.white,
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      marginBottom: '32px'
    },
    sectionHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: `1px solid ${colors.lightGray}`,
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '16px'
      }
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: colors.dark,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      '@media (max-width: 768px)': {
        fontSize: '1.1rem'
      }
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '300px',
      '@media (max-width: 768px)': {
        maxWidth: '100%'
      }
    },
    searchInput: {
      padding: '10px 16px 10px 40px',
      border: `1px solid ${colors.lightGray}`,
      borderRadius: '8px',
      fontSize: '0.9rem',
      width: '100%',
      transition: 'all 0.3s ease',
      '&:focus': {
        outline: 'none',
        borderColor: colors.primary,
        boxShadow: `0 0 0 3px ${colors.primary}20`
      }
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.gray,
      fontSize: '0.9rem'
    },
    classList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
      padding: '20px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        padding: '16px'
      }
    },
    classCard: {
      backgroundColor: colors.white,
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${colors.lightGray}`,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        borderColor: colors.primary
      }
    },
    classHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '14px'
    },
    className: {
      fontSize: '1.1rem',
      marginBottom: '6px',
      fontWeight: 700,
      color: colors.dark,
      '@media (max-width: 768px)': {
        fontSize: '1rem'
      }
    },
    classTeacher: {
      color: colors.gray,
      fontSize: '0.85rem',
      '@media (max-width: 768px)': {
        fontSize: '0.8rem'
      }
    },
    classDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '14px'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    detailIcon: {
      color: colors.primary,
      fontSize: '0.95rem'
    },
    detailText: {
      fontSize: '0.85rem',
      color: colors.darkGray
    },
    progressContainer: {
      marginTop: '16px'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px'
    },
    progressLabel: {
      fontSize: '0.8rem',
      color: colors.gray
    },
    progressBar: {
      height: '6px',
      borderRadius: '3px',
      backgroundColor: colors.lightGray,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '3px',
      backgroundColor: colors.success,
      transition: 'width 0.5s ease'
    },
    menuButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: colors.gray,
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '6px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: colors.lightGray,
        color: colors.dark
      }
    },
    noClasses: {
      textAlign: 'center',
      padding: '40px 20px',
      gridColumn: '1 / -1'
    },
    noClassesIcon: {
      fontSize: '3rem',
      color: colors.lightGray,
      marginBottom: '16px'
    },
    noClassesText: {
      fontSize: '1.1rem',
      color: colors.gray,
      marginBottom: '10px',
      '@media (max-width: 768px)': {
        fontSize: '1rem'
      }
    },
    noClassesSubtext: {
      fontSize: '0.9rem',
      color: colors.gray,
      maxWidth: '500px',
      margin: '0 auto',
      '@media (max-width: 768px)': {
        fontSize: '0.85rem'
      }
    },
    upcomingSection: {
      backgroundColor: colors.white,
      borderRadius: '12px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      marginBottom: '32px'
    },
    upcomingHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        marginBottom: '16px'
      }
    },
    upcomingTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: colors.dark,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      '@media (max-width: 768px)': {
        fontSize: '1.1rem'
      }
    },
    upcomingList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    upcomingItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px',
      borderRadius: '8px',
      backgroundColor: colors.light,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: colors.lightGray
      },
      '@media (max-width: 480px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px'
      }
    },
    upcomingTime: {
      backgroundColor: colors.primary,
      color: colors.white,
      borderRadius: '6px',
      padding: '6px 10px',
      minWidth: '70px',
      textAlign: 'center',
      marginRight: '14px',
      fontWeight: 600,
      fontSize: '0.85rem',
      '@media (max-width: 480px)': {
        marginRight: '0',
        alignSelf: 'flex-start'
      }
    },
    upcomingClass: {
      flex: 1,
      fontWeight: 600,
      fontSize: '0.95rem',
      '@media (max-width: 480px)': {
        width: '100%'
      }
    },
    viewAll: {
      color: colors.primary,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem',
      '&:hover': {
        color: colors.secondary
      }
    }
  };

  // Apply responsive styles
  const getResponsiveStyle = (styleObj) => {
    return {
      ...styleObj,
      ...(styleObj['@media (max-width: 768px)'] || {}),
      ...(styleObj['@media (max-width: 480px)'] || {})
    };
  };

  const [currentDay, setCurrentDay] = useState('');
  const [todayClasses, setTodayClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/dashbord/class`); 
      const data = res.data; // داده‌هایی که بک‌اند برمی‌گردونه

      const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
      const today = new Date();
      const dayIndex = today.getDay();
      const todayPersian = persianDays[dayIndex];
      setCurrentDay(todayPersian);

      const filteredClasses = data.classes
        .filter(cls => cls.schedule.some(session => session.day === todayPersian))
        .map(cls => {
          const todaySession = cls.schedule.find(s => s.day === todayPersian);
          return {
            ...cls,
            todayTime: todaySession.time,
            todayDuration: todaySession.duration,
            progress: Math.floor(Math.random() * 100)
          };
        });

      const upcoming = data.classes
        .filter(cls => !cls.schedule.some(session => session.day === todayPersian))
        .slice(0, 3)
        .map(cls => {
          const nextSession = cls.schedule[0];
          return {
            ...cls,
            nextDay: nextSession.day,
            nextTime: nextSession.time
          };
        });

      const totalStudents = filteredClasses.reduce((sum, cls) => sum + cls.students, 0);
      const avgAttendance = filteredClasses.length > 0 
        ? Math.round(filteredClasses.reduce((sum, cls) => sum + cls.attendanceRate, 0) / filteredClasses.length)
        : 0;

      setStats([
        {
          id: 1,
          title: "کلاس‌های امروز",
          value: filteredClasses.length,
          icon: <FaCalendarAlt />,
          color: colors.primary
        },
        {
          id: 2,
          title: "دانش‌آموزان",
          value: totalStudents,
          icon: <FaUsers />,
          color: colors.accent
        },
        {
          id: 3,
          title: "میانگین حضور",
          value: `${avgAttendance}%`,
          icon: <FaChartLine />,
          color: colors.success
        }
      ]);

      setTodayClasses(filteredClasses);
      setUpcomingClasses(upcoming);
    } catch (err) {
      console.error("خطا در گرفتن داده‌ها:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const filteredClasses = todayClasses.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <TeacherLayout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 200px)'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '30px',
            borderRadius: '12px',
            backgroundColor: colors.white,
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `4px solid ${colors.lightGray}`,
              borderTopColor: colors.primary,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ 
              fontSize: '1rem',
              color: colors.dark
            }}>در حال بارگذاری اطلاعات...</p>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div style={getResponsiveStyle(styles.container)}>
        {/* Header */}
        <header style={getResponsiveStyle(styles.header)}>
          <h1 style={getResponsiveStyle(styles.title)}>پیشخوان مدرس</h1>
          <p style={getResponsiveStyle(styles.subtitle)}>برنامه درسی امروز ({currentDay})</p>
        </header>

        {/* Stats Cards */}
        <div style={getResponsiveStyle(styles.statsGrid)}>
          {stats.map(stat => (
            <div 
              key={stat.id} 
              style={{
                ...getResponsiveStyle(styles.statCard),
                backgroundColor: stat.color
              }}
            >
              <div style={getResponsiveStyle(styles.statContent)}>
                <h3 style={getResponsiveStyle(styles.statTitle)}>{stat.title}</h3>
                <p style={getResponsiveStyle(styles.statValue)}>{stat.value}</p>
              </div>
              <div style={getResponsiveStyle(styles.statIcon)}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Today's Classes */}
        <div style={getResponsiveStyle(styles.mainContent)}>
          <div style={getResponsiveStyle(styles.sectionHeader)}>
            <h2 style={getResponsiveStyle(styles.sectionTitle)}>
              <FaChalkboardTeacher />
              کلاس‌های امروز
            </h2>
            <div style={getResponsiveStyle(styles.searchContainer)}>
              <FaSearch style={getResponsiveStyle(styles.searchIcon)} />
              <input
                type="text"
                style={getResponsiveStyle(styles.searchInput)}
                placeholder="جستجوی کلاس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredClasses.length > 0 ? (
            <div style={getResponsiveStyle(styles.classList)}>
              {filteredClasses.map(cls => (
                <div key={cls.id} style={getResponsiveStyle(styles.classCard)}>
                  <div style={getResponsiveStyle(styles.classHeader)}>
                    <div>
                      <h3 style={getResponsiveStyle(styles.className)}>{cls.name}</h3>
                      <p style={getResponsiveStyle(styles.classTeacher)}>{cls.teacher}</p>
                    </div>
                    <button style={getResponsiveStyle(styles.menuButton)}>
                      <FaEllipsisH />
                    </button>
                  </div>
                  
                  <div style={getResponsiveStyle(styles.classDetails)}>
                    <div style={getResponsiveStyle(styles.detailRow)}>
                      <FaClock style={getResponsiveStyle(styles.detailIcon)} />
                      <span style={getResponsiveStyle(styles.detailText)}>
                        {cls.todayTime} ({cls.todayDuration})
                      </span>
                    </div>
                    <div style={getResponsiveStyle(styles.detailRow)}>
                      <FaUserGraduate style={getResponsiveStyle(styles.detailIcon)} />
                      <span style={getResponsiveStyle(styles.detailText)}>
                        {cls.students} دانش‌آموز
                      </span>
                    </div>
                  </div>

                  <div style={getResponsiveStyle(styles.progressContainer)}>
                    <div style={getResponsiveStyle(styles.progressHeader)}>
                      <span style={getResponsiveStyle(styles.progressLabel)}>میزان حضور</span>
                      <span style={getResponsiveStyle(styles.progressLabel)}>{cls.attendanceRate}%</span>
                    </div>
                    <div style={getResponsiveStyle(styles.progressBar)}>
                      <div 
                        style={{ 
                          ...getResponsiveStyle(styles.progressFill), 
                          width: `${cls.attendanceRate}%`,
                          backgroundColor: cls.attendanceRate > 75 ? colors.success : 
                                          cls.attendanceRate > 50 ? colors.warning : colors.danger
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={getResponsiveStyle(styles.noClasses)}>
              <div style={getResponsiveStyle(styles.noClassesIcon)}>
                <FaChalkboardTeacher />
              </div>
              <h3 style={getResponsiveStyle(styles.noClassesText)}>
                {searchTerm ? 'کلاسی یافت نشد' : 'هیچ کلاسی برای امروز برنامه‌ریزی نشده است'}
              </h3>
              <p style={getResponsiveStyle(styles.noClassesSubtext)}>
                {searchTerm 
                  ? 'لطفاً عبارت جستجوی خود را تغییر دهید'
                  : 'می‌توانید برنامه هفتگی خود را در بخش مربوطه بررسی کنید'}
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <div style={getResponsiveStyle(styles.upcomingSection)}>
            <div style={getResponsiveStyle(styles.upcomingHeader)}>
              <h2 style={getResponsiveStyle(styles.upcomingTitle)}>
                <FaCalendarAlt />
                کلاس‌های آینده
              </h2>
              <div style={getResponsiveStyle(styles.viewAll)}>
                مشاهده همه
                <FaSearch />
              </div>
            </div>
            
            <div style={getResponsiveStyle(styles.upcomingList)}>
              {upcomingClasses.map(cls => (
                <div key={cls.id} style={getResponsiveStyle(styles.upcomingItem)}>
                  <div style={getResponsiveStyle(styles.upcomingTime)}>{cls.nextTime}</div>
                  <div style={getResponsiveStyle(styles.upcomingClass)}>{cls.name}</div>
                  <div style={{ color: colors.gray, fontSize: '0.85rem' }}>{cls.nextDay}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;