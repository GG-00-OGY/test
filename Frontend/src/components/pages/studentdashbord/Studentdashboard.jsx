import React, { useState, useEffect } from 'react';
import Header from './StudentChildren/Header';
import MobileMenu from './StudentChildren/MobileMenu';
import Sidebar from './StudentChildren/SaideBar';
import MainContent from './StudentChildren/MainContent';

const StudentDashboard = () => {
  // State مدیریت UI
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [notifications, setNotifications] = useState(3);
  
  // State برای داده‌های کاربر و محتوا
  const [userData, setUserData] = useState({});
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [trips, setTrips] = useState([]);
  const [extraClasses, setExtraClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);



  // تابع برای شرکت در کلاس یا اردو
  const handleJoin = (type, id) => {
    if (type === 'class') {
      setExtraClasses(prev => prev.map(cls => 
        cls.id === id ? {...cls, joined: !cls.joined} : cls
      ));
    } else if (type === 'trip') {
      setTrips(prev => prev.map(trip => 
        trip.id === id ? {...trip, joined: !trip.joined} : trip
      ));
    }
  };

  return (
    <div style={styles.root}>
      {/* هدر */}
      <Header 
        userData={userData} 
        notifications={notifications} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      {/* منوی موبایل */}
      <MobileMenu 
        userData={userData} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      {/* محتوای اصلی */}
      <div style={styles.mainContainer}>
        {/* سایدبار برای دسکتاپ */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* محتوای صفحه */}
        <MainContent 
          activeTab={activeTab} 
          loading={loading} 
          weeklySchedule={weeklySchedule} 
          trips={trips} 
          extraClasses={extraClasses} 
          announcements={announcements} 
          handleJoin={handleJoin} 
        />
      </div>

      {/* انیمیشن اسپینر */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// استایل‌های پیشرفته با فونت وزیر
const styles = {
  root: {
    '--primary-color': '#4f46e5',
    '--primary-light': '#6366f1',
    '--primary-lighter': '#818cf8',
    '--secondary-color': '#f9fafb',
    '--accent-color': '#3730a3',
    '--text-color': '#1f2937',
    '--text-light': '#6b7280',
    '--light-gray': '#e5e7eb',
    '--white': '#ffffff',
    '--danger': '#ef4444',
    '--success': '#10b981',
    '--warning': '#f59e0b',
    '--shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    direction: 'rtl',
    fontFamily: 'Vazir, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6'
  },
  app: {
    minHeight: '100vh',
    backgroundColor: 'var(--secondary-color)',
    display: 'flex',
    flexDirection: 'column'
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid rgba(79, 70, 229, 0.1)',
    borderTop: '6px solid var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// تابع ترکیب استایل‌ها
export const combineStyles = (...styleObjects) => {
  return Object.assign({}, ...styleObjects);
};

export default StudentDashboard;