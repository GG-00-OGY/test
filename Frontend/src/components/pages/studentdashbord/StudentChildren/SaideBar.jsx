import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faBus, 
  faBullhorn,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';
import { combineStyles } from '../Studentdashboard';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const styles = {
    sidebar: {
      width: '280px',
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow)',
      padding: '2rem 1rem',
      display: 'none',
      flexDirection: 'column',
      '@media (min-width: 1024px)': {
        display: 'flex'
      }
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
    <div style={styles.sidebar}>
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
            onClick={() => setActiveTab(item.id)}
          >
            <span style={styles.navIcon}>
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;