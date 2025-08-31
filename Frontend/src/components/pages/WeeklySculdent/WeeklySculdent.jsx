import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiCalendar, FiClock, FiUser, FiSearch, 
  FiChevronRight, FiChevronLeft, FiBook, FiHome 
} from 'react-icons/fi';
import TeacherLayout from '../../Layout/TeacherLayout';

const WeeklySchedule = () => {
  const colors = {
    primary: '#4361ee', secondary: '#3f37c9', accent: '#4895ef',
    dark: '#1b263b', light: '#f8f9fa', white: '#ffffff',
    gray: '#6c757d', lightGray: '#e9ecef', success: '#4cc9f0'
  };

  const styles = {
    container: { maxWidth: '1800px', margin: '0 auto', padding: '24px', fontFamily: "'Vazir', 'Segoe UI', sans-serif", minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' },
    title: { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '700', color: colors.dark, display: 'flex', alignItems: 'center', gap: '12px' },
    controls: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
    dateNavigator: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: colors.white, padding: '12px 16px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    navButton: { background: 'none', border: 'none', cursor: 'pointer', color: colors.primary, fontSize: '1.2rem', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', transition: 'all 0.2s ease' },
    currentWeek: { fontWeight: '600', minWidth: '180px', textAlign: 'center', color: colors.dark },
    searchContainer: { position: 'relative', width: '280px' },
    searchInput: { padding: '12px 16px 12px 40px', border: `1px solid ${colors.lightGray}`, borderRadius: '8px', width: '100%', fontSize: '0.95rem', transition: 'all 0.3s ease' },
    searchIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.gray },
    scheduleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    dayColumn: { backgroundColor: colors.white, borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${colors.lightGray}` },
    dayTitle: { color: colors.primary, margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: `1px solid ${colors.lightGray}`, fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    classCard: { marginBottom: '16px', padding: '16px', backgroundColor: colors.light, borderRadius: '8px' },
    classTitle: { fontWeight: '600', margin: '0 0 8px 0', color: colors.dark, fontSize: '1.05rem' },
    classDetail: { display: 'flex', alignItems: 'center', gap: '8px', color: colors.gray, fontSize: '0.9rem', margin: '6px 0' },
    noClasses: { color: colors.gray, textAlign: 'center', padding: '16px', fontSize: '0.95rem' }
  };

  const daysOfWeek = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];

  const [schedule, setSchedule] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get('http://localhost:4000/dashbord/teacher-schedule', { withCredentials: true });
        console.log(res);
        
        setSchedule(res.data.schedule); // آرایه‌ای از کلاس‌ها
      } catch (err) {
        console.error('خطا در دریافت برنامه هفتگی:', err);
      }
    };
    fetchSchedule();
  }, []);

  const changeWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const filteredClasses = daysOfWeek.reduce((acc, day) => {
    const dayClasses = schedule.filter(cls => cls.day_of_week === day);
    const filtered = dayClasses.filter(cls => 
      cls.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.class_id.toString().includes(searchQuery)
    );
    if (filtered.length > 0) acc[day] = filtered;
    return acc;
  }, {});

  return (
    <TeacherLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}><FiCalendar size={24} /> برنامه هفتگی</h1>

          <div style={styles.controls}>
            <div style={styles.dateNavigator}>
              <button style={styles.navButton} onClick={() => changeWeek('prev')}><FiChevronRight size={18} /></button>
              <div style={styles.currentWeek}>
                {currentDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <button style={styles.navButton} onClick={() => changeWeek('next')}><FiChevronLeft size={18} /></button>
            </div>

            <div style={styles.searchContainer}>
              <FiSearch style={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="جستجوی کلاس..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={styles.scheduleGrid}>
          {daysOfWeek.map(day => (
            <div key={day} style={styles.dayColumn}>
              <h3 style={styles.dayTitle}><FiCalendar size={18} /> {day}</h3>

              {filteredClasses[day] ? (
                filteredClasses[day].map(cls => (
                  <div key={cls.schedule_id} style={styles.classCard}>
                    <h4 style={styles.classTitle}>{cls.teacher_name}</h4>
                    <div style={styles.classDetail}><FiClock size={14} /> ساعت: {cls.start_time} - {cls.end_time}</div>
                    <div style={styles.classDetail}><FiUser size={14} /> تعداد دانش‌آموز: {cls.student_count}</div>
                    <div style={styles.classDetail}><FiHome size={14} /> کلاس: {cls.class_id}</div>
                    {cls.description && (<div style={styles.classDetail}><FiBook size={14} /> {cls.description}</div>)}
                  </div>
                ))
              ) : (<p style={styles.noClasses}>کلاسی برای این روز وجود ندارد</p>)}
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default WeeklySchedule;
