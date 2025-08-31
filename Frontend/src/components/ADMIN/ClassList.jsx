import { useState, useEffect } from 'react';
import axios from 'axios';

const base_url = process.env.REACT_APP_API_URL;

const WeeklySchedule = ({ classId, onClose }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!classId) return;
      
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${base_url}/dashbord/weekly-schedule/${classId}`, {
          withCredentials: true,
        });
        
        console.log('API Response:', res.data);
        
        // بررسی ساختارهای مختلف پاسخ API با توجه به جدول جدید
        let scheduleData = [];
        
        if (Array.isArray(res.data)) {
          scheduleData = res.data;
        } else if (res.data && Array.isArray(res.data)) {
          scheduleData = res.data;
        } else if (res.data.schedules && Array.isArray(res.data.schedules)) {
          scheduleData = res.data.schedules;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          scheduleData = res.data.data;
        } else if (res.data.class_schedule && Array.isArray(res.data.class_schedule)) {
          scheduleData = res.data.class_schedule;
        } else if (res.data.result && Array.isArray(res.data.result)) {
          scheduleData = res.data.result;
        }
        console.log('Extracted schedule data:', scheduleData);
        setSchedule(scheduleData);
        
        if (scheduleData.length === 0) {
          setError('برنامه هفتگی برای این کلاس یافت نشد');
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        console.error('Error response:', err.response);
        setError('خطا در دریافت برنامه هفتگی');
        // داده‌های نمونه برای نمایش با ساختار جدید
        setSchedule([
          {
            day_of_week: 'شنبه',
            period_number: 'زنگ اول',
            subject_name: 'ریاضی',
            teacher_name: 'دکتر احمدی',
            class_name: 'کلاس اول ریاضی'
          },
          {
            day_of_week: 'شنبه',
            period_number: 'زنگ دوم',
            subject_name: 'فیزیک',
            teacher_name: 'خانم رضایی',
            class_name: 'کلاس اول ریاضی'
          },
          {
            day_of_week: 'یکشنبه',
            period_number: 'زنگ اول',
            subject_name: 'ادبیات',
            teacher_name: 'آقای حسینی',
            class_name: 'کلاس اول ریاضی'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [classId]);

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '900px',
      maxHeight: '80vh',
      overflowY: 'auto',
      textAlign: 'right',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    modalHeader: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#2c3e50',
      borderBottom: '1px solid #e0e6ed',
      paddingBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '500',
      marginTop: '20px',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#7f8c8d',
    },
    error: {
      backgroundColor: '#fdf2f2',
      color: '#c0392b',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '15px',
      textAlign: 'center',
    },
    scheduleTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      fontSize: '14px',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    tableHeaderCell: {
      padding: '12px',
      textAlign: 'center',
      fontWeight: '600',
    },
    tableCell: {
      padding: '10px',
      textAlign: 'center',
      borderBottom: '1px solid #e0e0e0',
    },
    tableRow: {
      '&:nth-child(even)': {
        backgroundColor: '#f9f9f9',
      },
    },
    noData: {
      textAlign: 'center',
      padding: '20px',
      color: '#7f8c8d',
      fontStyle: 'italic',
    },
  };

  // ترتیب روزهای هفته برای نمایش منظم
  const dayOrder = {
    'شنبه': 1,
    'یکشنبه': 2,
    'دوشنبه': 3,
    'سه‌شنبه': 4,
    'چهارشنبه': 5,
    'پنجشنبه': 6
  };

  // ترتیب زنگ‌های درسی
  const periodOrder = {
    'زنگ اول': 1,
    'زنگ دوم': 2,
    'زنگ سوم': 3,
    'زنگ چهارم': 4,
    'زنگ پنجم': 5
  };

  // مرتب‌سازی برنامه بر اساس روزهای هفته و زنگ‌های درسی
  const sortedSchedule = [...schedule].sort((a, b) => {
    const dayCompare = dayOrder[a.day_of_week] - dayOrder[b.day_of_week];
    if (dayCompare !== 0) return dayCompare;
    return periodOrder[a.period_number] - periodOrder[b.period_number];
  });

  // گروه‌بندی برنامه بر اساس روزهای هفته
  const groupedByDay = sortedSchedule.reduce((acc, item) => {
    const day = item.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <span>برنامه هفتگی کلاس (ID: {classId})</span>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#7f8c8d'
            }}
          >
            ×
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>
            <i className="fas fa-spinner fa-spin" style={{marginLeft: '10px'}}></i>
            در حال بارگذاری برنامه هفتگی...
          </div>
        ) : sortedSchedule.length > 0 ? (
          <div>
            {Object.entries(groupedByDay).map(([day, daySchedule]) => (
              <div key={day} style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  borderBottom: '2px solid #3498db', 
                  paddingBottom: '8px',
                  marginBottom: '15px'
                }}>
                  {day}
                </h3>
                <table style={styles.scheduleTable}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableHeaderCell}>زنگ</th>
                      <th style={styles.tableHeaderCell}>درس</th>
                      <th style={styles.tableHeaderCell}>معلم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySchedule.map((item, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.tableCell}>{item.period_number || 'نامشخص'}</td>
                        <td style={styles.tableCell}>{item.subject_name || 'نامشخص'}</td>
                        <td style={styles.tableCell}>{item.teacher_name || 'نامشخص'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noData}>برنامه هفتگی برای این کلاس ثبت نشده است.</div>
        )}

        <button style={styles.closeButton} onClick={onClose}>
          بستن
        </button>
      </div>
    </div>
  );
};

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const controller = new AbortController();

    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching classes from API...');
        const res = await axios.get(`${base_url}/dashbord/all-class`, {
          signal: controller.signal,
          withCredentials: true,
        });

        console.log('Classes API response:', res.data);
        
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.classes || res.data.data || res.data.result || [];
        
        console.log('Processed classes data:', data);
        setClasses(data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Fetch error:', err);
          console.error('Error response:', err.response);
          setError('خطا در دریافت داده‌ها از سرور. از داده‌ی محلی استفاده می‌شود.');
          setClasses([
            { id: '1', class_name: 'کلاس اول ریاضی', grade: '1', school_year: '1403-1404', student_count: 28 },
            { id: '2', class_name: 'کلاس دوم تجربی', grade: '2', school_year: '1403-1404', student_count: 32 },
            { id: '3', class_name: 'کلاس سوم انسانی', grade: '3', school_year: '1403-1404', student_count: 25 },
            { id: '4', class_name: 'کلاس چهارم هنر', grade: '4', school_year: '1402-1403', student_count: 20 },
            { id: '5', class_name: 'کلاس پنجم فیزیک', grade: '5', school_year: '1402-1403', student_count: 30 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();

    return () => {
      window.removeEventListener('resize', handleResize);
      controller.abort();
    };
  }, []);

  const handleDelete = async (classId) => {
    try {
      setDeletingId(classId);
      await axios.delete(`${base_url}/delete/class/${classId}`, {
        withCredentials: true,
      });
      setClasses(prev => prev.filter(cls => cls.id !== classId));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('خطا در حذف کلاس. لطفاً دوباره امتحان کنید.');
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (cls) => {
    setEditingClass({...cls});
  };

  const handleEditChange = (field, value) => {
    setEditingClass((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    try {
      await axios.put(`${base_url}/update/class/${editingClass.id}`, {
        school_year: editingClass.school_year, 
        grade: editingClass.grade, 
        student_count: editingClass.student_count, 
        class_name: editingClass.class_name
      }, {
        withCredentials: true,
      });

      setClasses(prev =>
        prev.map(cls => (cls.id === editingClass.id ? editingClass : cls))
      );
      setEditingClass(null);
    } catch (err) {
      console.error('Error updating class:', err);
      alert('خطا در به‌روزرسانی کلاس. لطفاً دوباره امتحان کنید.');
    }
  };

  const getClassName = (cls) => {
    return cls.class_name || cls.name || cls.title || cls.className || "نام کلاس نامشخص";
  };

  const styles = {
    container: {
      direction: 'rtl',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '20px',
    },
    headerContainer: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e0e6ed',
    },
    header: {
      color: '#2c3e50',
      fontSize: '24px',
      fontWeight: '700',
      margin: 0,
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#7f8c8d',
      fontSize: '18px',
      fontWeight: '500',
    },
    error: {
      backgroundColor: '#fdf2f2',
      color: '#c0392b',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      border: '1px solid #ebccd1',
    },
    tableWrapper: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    tableHeaderRow: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    tableHeaderCell: {
      padding: '14px 16px',
      fontWeight: '600',
      textAlign: 'right',
      fontSize: '15px',
    },
    tableRow: {
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s ease',
    },
    tableCell: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#34495e',
      fontWeight: '500',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #eaeaea',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      paddingBottom: '10px',
      borderBottom: '1px solid #f0f0f0',
    },
    cardTitle: {
      color: '#2c3e50',
      fontSize: '16px',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    cardRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
    },
    cardLabel: {
      color: '#7f8c8d',
    },
    cardValue: {
      color: '#34495e',
      fontWeight: '500',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '16px',
      flexWrap: 'wrap',
    },
    button: {
      flex: '1 1 auto',
      minWidth: '100px',
      padding: '10px 14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    viewButton: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    editButton: {
      backgroundColor: '#f39c12',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '500px',
      textAlign: 'right',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    modalHeader: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#2c3e50',
      borderBottom: '1px solid #e0e6ed',
      paddingBottom: '8px',
    },
  };

  if (loading) {
    return <div style={styles.loading}>در حال بارگذاری اطلاعات کلاس‌ها...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>
          <i className="fas fa-chalkboard" style={{ marginLeft: '10px', color: '#3498db' }}></i>
          لیست کلاس‌های آموزشی
        </h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {isMobile ? (
        <div>
          {classes.map((cls) => (
            <div key={cls.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  <i className="fas fa-chalkboard-teacher" style={{ color: '#3498db', marginLeft: '8px' }}></i>
                  {getClassName(cls)}
                </h3>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>پایه تحصیلی:</span>
                  <span style={styles.cardValue}>پایه {cls.grade}</span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>سال تحصیلی:</span>
                  <span style={styles.cardValue}>
                    <i className="fas fa-calendar-alt" style={{ color: '#9b59b6', marginLeft: '8px' }}></i>
                    {cls.school_year}
                  </span>
                </div>
                <div style={styles.cardRow}>
                  <span style={styles.cardLabel}>تعداد دانش‌آموزان:</span>
                  <span style={styles.cardValue}>
                    <i className="fas fa-users" style={{ color: '#e74c3c', marginLeft: '8px' }}></i>
                    {cls.student_count || 0} نفر
                  </span>
                </div>
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.button, ...styles.viewButton }}
                    onClick={() => {
                      setSelectedClass(cls.id);
                      setShowSchedule(true);
                    }}
                    disabled={deletingId === cls.id}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    برنامه هفتگی
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => openEditModal(cls)}
                    disabled={deletingId === cls.id}
                  >
                    <i className="fas fa-edit"></i>
                    ویرایش
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => setConfirmDelete(cls.id)}
                    disabled={deletingId === cls.id}
                  >
                    <i className="fas fa-trash"></i>
                    {deletingId === cls.id ? 'در حال حذف...' : 'حذف'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={{ ...styles.tableHeaderCell, width: '25%' }}>نام کلاس</th>
                <th style={{ ...styles.tableHeaderCell, width: '15%' }}>پایه تحصیلی</th>
                <th style={{ ...styles.tableHeaderCell, width: '20%' }}>سال تحصیلی</th>
                <th style={{ ...styles.tableHeaderCell, width: '15%' }}>تعداد دانش‌آموزان</th>
                <th style={{ ...styles.tableHeaderCell, width: '25%' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr
                  key={cls.id}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  }}
                >
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                      <i className="fas fa-chalkboard-teacher" style={{ color: '#3498db', marginLeft: '10px' }}></i>
                      {getClassName(cls)}
                    </div>
                  </td>
                  <td style={styles.tableCell}>پایه {cls.grade}</td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#9b59b6', marginLeft: '10px' }}></i>
                      {cls.school_year}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-users" style={{ color: '#e74c3c', marginLeft: '10px' }}></i>
                      {cls.student_count || 0} نفر
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actions}>
                      <button
                        style={{ ...styles.button, ...styles.viewButton }}
                        onClick={() => {
                          setSelectedClass(cls.id);
                          setShowSchedule(true);
                        }}
                        disabled={deletingId === cls.id}
                      >
                        <i className="fas fa-calendar-alt"></i>
                        برنامه هفتگی
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() => openEditModal(cls)}
                        disabled={deletingId === cls.id}
                      >
                        <i className="fas fa-edit"></i>
                        ویرایش
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() => setConfirmDelete(cls.id)}
                        disabled={deletingId === cls.id}
                      >
                        <i className="fas fa-trash"></i>
                        {deletingId === cls.id ? 'در حال حذف...' : 'حذف'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showSchedule && (
        <WeeklySchedule classId={selectedClass} onClose={() => setShowSchedule(false)} />
      )}

      {confirmDelete && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>تأیید حذف کلاس</h3>
            <p>
              آیا از حذف کلاس با شناسه <strong>{confirmDelete}</strong> اطمینان دارید؟
              این عمل غیرقابل بازگشت است.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginTop: '20px' }}>
              <button
                style={{
                  ...styles.button,
                  ...styles.deleteButton,
                  padding: '8px 16px',
                  fontSize: '14px',
                }}
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
              >
                {deletingId === confirmDelete ? 'در حال حذف...' : 'بله، حذف شود'}
              </button>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#95a5a6',
                  padding: '8px 16px',
                  fontSize: '14px',
                }}
                onClick={() => setConfirmDelete(null)}
                disabled={deletingId === confirmDelete}
              >
                خیر، انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {editingClass && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>ویرایش کلاس (ID: {editingClass.id})</h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  نام کلاس
                </label>
                <input
                  type="text"
                  value={editingClass.class_name || ''}
                  onChange={(e) => handleEditChange('class_name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  پایه تحصیلی
                </label>
                <input
                  type="text"
                  value={editingClass.grade || ''}
                  onChange={(e) => handleEditChange('grade', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  سال تحصیلی
                </label>
                <input
                  type="text"
                  value={editingClass.school_year || ''}
                  onChange={(e) => handleEditChange('school_year', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                  placeholder="مثلاً: 1403-1404"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                  تعداد دانش‌آموزان
                </label>
                <input
                  type="number"
                  value={editingClass.student_count || ''}
                  onChange={(e) => handleEditChange('student_count', Number(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    backgroundColor: '#27ae60',
                    padding: '10px 16px',
                    fontSize: '14px',
                  }}
                >
                  <i className="fas fa-save"></i> ذخیره تغییرات
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: '#95a5a6',
                    padding: '10px 16px',
                    fontSize: '14px',
                  }}
                  onClick={() => setEditingClass(null)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassList;