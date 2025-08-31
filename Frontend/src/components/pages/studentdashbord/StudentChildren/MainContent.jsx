import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faBus, 
  faBullhorn,
  faChalkboardTeacher,
  faUser,
  faClock,
  faMapMarkerAlt,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { combineStyles } from '../Studentdashboard';

const base_url = process.env.REACT_APP_API_URL;

const MainContent = ({ activeTab, handleJoin }) => {
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [trips, setTrips] = useState([]);
  const [extraClasses, setExtraClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requests = [
          axios.get(`${base_url}/dashbord/student`, { withCredentials: true }),
          axios.get(`${base_url}/dashbord/tours`, { withCredentials: true }),
          axios.get(`${base_url}/dashbord/notifications`, { withCredentials: true }),
          axios.get(`${base_url}/dashbord/my-schedule`, { withCredentials: true }),
          axios.get(`${base_url}/dashbord/extracurricular`, { withCredentials: true }),
        ];

        const results = await Promise.allSettled(requests);

        // پروفایل دانش‌آموز
        setStudentProfile(results[0].status === 'fulfilled' ? results[0].value.data.student : null);

        // اردوها
        setTrips(results[1].status === 'fulfilled' ? results[1].value.data.trips || [] : []);

        // اطلاعیه‌ها
        setAnnouncements(results[2].status === 'fulfilled' ? results[2].value.data.announcements || [] : []);

        // برنامه هفتگی
        setWeeklySchedule(results[3].status === 'fulfilled' ? results[3].value.data.schedule || [] : []);

        // کلاس‌ها
        if (results[4].status === 'fulfilled') {
          setExtraClasses(results[4].value.data.classes || []);
        } else {
          console.warn('Error fetching classes:', results[4].reason.message);
          setExtraClasses([]);
        }

      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const styles = { 
    content: { flex: 1, padding: '2rem' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    sectionTitle: { fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-color)' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' },
    card: { backgroundColor: 'var(--white)', borderRadius: '12px', boxShadow: 'var(--shadow)', overflow: 'hidden', transition: 'var(--transition)' },
    cardImage: { width: '100%', height: '180px', objectFit: 'cover' },
    cardContent: { padding: '1.5rem' },
    cardTitle: { fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-color)' },
    cardMeta: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-light)' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    cardDescription: { color: 'var(--text-color)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.95rem' },
    button: { backgroundColor: 'var(--primary-color)', color: 'var(--white)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'center' },
    buttonDanger: { backgroundColor: 'var(--danger)' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' },
    emptyIcon: { fontSize: '3rem', color: 'var(--primary-light)', marginBottom: '1.5rem' },
    emptyText: { fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '1.5rem' }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid rgba(79, 70, 229, 0.1)', borderTop: '6px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={styles.content}>
      {/* تب برنامه هفتگی */}
      {activeTab === 'schedule' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>برنامه هفتگی</h2>
          </div>
          {weeklySchedule.length > 0 ? (
            weeklySchedule.map(item => (
              <div key={item.schedule_id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} /> {item.day_of_week}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{item.subject_name}</strong><br/>
                    <FontAwesomeIcon icon={faUser} /> {item.teacher || 'نامشخص'}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faClock} /> {item.period_number}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><FontAwesomeIcon icon={faCalendarAlt} /></div>
              <div style={styles.emptyText}>برنامه هفتگی موجود نیست</div>
            </div>
          )}
        </div>
      )}

      {/* تب اردوها */}
      {activeTab === 'trips' && (
        <div>
          <div style={styles.sectionHeader}><h2 style={styles.sectionTitle}>برنامه اردوها</h2></div>
          {trips.length > 0 ? (
            <div style={styles.cardGrid}>
              {trips.map(trip => (
                <div key={trip.id} style={styles.card}>
                  <img src={trip.image || '/default-trip.jpg'} alt={trip.tour_name} style={styles.cardImage} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{trip.tour_name}</h3>
                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}><FontAwesomeIcon icon={faCalendarAlt} /> {trip.tour_date}</div>
                      <div style={styles.metaItem}><FontAwesomeIcon icon={faMapMarkerAlt} /> {trip.tour_address}</div>
                    </div>
                    <p style={styles.cardDescription}>هزینه: {trip.cost}</p>
                    <button style={combineStyles(styles.button, trip.joined && styles.buttonDanger)} onClick={() => handleJoin('trip', trip.id)}>
                      <FontAwesomeIcon icon={faSignInAlt} /> {trip.joined ? 'انصراف از اردو' : 'ثبت نام در اردو'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><FontAwesomeIcon icon={faBus} /></div>
              <div style={styles.emptyText}>هیچ اردوی برنامه‌ریزی شده‌ای وجود ندارد</div>
            </div>
          )}
        </div>
      )}

      {/* تب کلاس‌های فوق برنامه */}
      {activeTab === 'extraClasses' && (
        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>کلاس‌های فوق برنامه</h2>
          </div>
          {extraClasses.length > 0 ? (
            <div style={styles.cardGrid}>
              {extraClasses.map(cls => (
                <div key={cls.id} style={styles.card}>
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{cls.title || cls.class_name || 'کلاس فوق برنامه'}</h3>
                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>
                        <FontAwesomeIcon icon={faUser} /> 
                        {cls.teacher || cls.instructor || 'نامشخص'}
                      </div>
                      <div style={styles.metaItem}>
                        <FontAwesomeIcon icon={faCalendarAlt} /> 
                        {cls.date || cls.class_date || 'تاریخ نامشخص'}
                      </div>
                      <div style={styles.metaItem}>
                        <FontAwesomeIcon icon={faClock} /> 
                        {cls.time || cls.class_time || 'زمان نامشخص'}
                      </div>
                    </div>
                    <p style={styles.cardDescription}>
                      {cls.description || 'توضیحاتی برای این کلاس موجود نیست.'}
                    </p>
                    <button 
                      style={combineStyles(styles.button, cls.joined && styles.buttonDanger)} 
                      onClick={() => handleJoin('class', cls.id)}
                    >
                      <FontAwesomeIcon icon={faSignInAlt} /> 
                      {cls.joined ? 'انصراف از کلاس' : 'ثبت نام در کلاس'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><FontAwesomeIcon icon={faChalkboardTeacher} /></div>
              <div style={styles.emptyText}>هیچ کلاس فوق برنامه‌ای وجود ندارد</div>
            </div>
          )}
        </div>
      )}

      {/* تب اطلاعیه‌ها */}
      {activeTab === 'announcements' && (
        <div>
          <div style={styles.sectionHeader}><h2 style={styles.sectionTitle}>اطلاعیه‌های مدرسه</h2></div>
          {announcements.length > 0 ? (
            <div>
              {announcements.map(announcement => (
                <div key={announcement.id} style={combineStyles(styles.card, announcement.important && styles.buttonDanger)}>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.message}</p>
                  <div><FontAwesomeIcon icon={faCalendarAlt} /> {announcement.created_at}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}><FontAwesomeIcon icon={faBullhorn} /></div>
              <div style={styles.emptyText}>هیچ اطلاعیه‌ای وجود ندارد</div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default MainContent;
