import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faBus, 
  faBullhorn,
  faChalkboardTeacher,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { combineStyles } from '../Studentdashboard';

const MobileMenu = ({ userData, mobileMenuOpen, setMobileMenuOpen, activeTab, setActiveTab }) => {
  const styles = {
    mobileMenu: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 90,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'var(--transition)',
      opacity: mobileMenuOpen ? 1 : 0,
      pointerEvents: mobileMenuOpen ? 'all' : 'none'
    },
    mobileMenuContent: {
      width: '85%',
      maxWidth: '320px',
      backgroundColor: 'var(--white)',
      padding: '2rem 1.5rem',
      overflowY: 'auto',
      transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'var(--transition)'
    },
    mobileMenuHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--light-gray)'
    },
    mobileMenuClose: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'var(--text-color)',
      fontSize: '1.5rem',
      cursor: 'pointer'
    },
    navItem: {
      padding: '1rem 1.25rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      cursor: 'pointer',
      transition: 'var(--transition)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    activeNavItem: {
      backgroundColor: 'var(--primary-light)',
      color: 'var(--white)',
      boxShadow: 'var(--shadow)'
    },
    navIcon: {
      fontSize: '1.25rem',
      width: '24px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.mobileMenu}>
      <div style={styles.mobileMenuContent}>
        <div style={styles.mobileMenuHeader}>
          
          <button 
            style={styles.mobileMenuClose}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <nav>
          {[
            { id: 'schedule', label: 'برنامه هفتگی', icon: faCalendarAlt },
            { id: 'trips', label: 'اردوها', icon: faBus },
            { id: 'extraClasses', label: 'کلاس‌های فوق برنامه', icon: faChalkboardTeacher },
            { id: 'announcements', label: 'اطلاعیه‌ها', icon: faBullhorn }
          ].map(item => (
            <div
              key={item.id}
              style={combineStyles(
                styles.navItem,
                activeTab === item.id && styles.activeNavItem
              )}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span style={styles.navIcon}>
                <FontAwesomeIcon icon={item.icon} />
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;