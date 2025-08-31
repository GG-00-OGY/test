import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeeklyScheduleManager = () => {
  const [scheduleData, setScheduleData] = useState({
    teacher_id: 0,
    teacher_name: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    class_id: 0,
    student_count: 0
  });

  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [editIndex, setEditIndex] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base_url = process.env.REACT_APP_API_URL;
  const daysOfWeek = [
    'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه',
    'چهارشنبه', 'پنجشنبه', 'جمعه'
  ];

  // دریافت اساتید از بک‌اند
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/dashbord/all-teacher`, { withCredentials: true });
      setTeachers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در دریافت اطلاعات اساتید');
    } finally {
      setLoading(false);
    }
  };

  // دریافت کلاس‌ها
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/dashbord/all-class`, { withCredentials: true });
      setClasses(response.data.data.slice(0, 10));
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در دریافت اطلاعات کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  // دریافت برنامه‌های هفتگی
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${base_url}/dashbord/all-schedule-teacher`, { withCredentials: true });
      console.log(response);
      
      const scheduleList = response.data.data?.schedule;
      setSchedules(Array.isArray(scheduleList) ? scheduleList : []);
    } catch (err) {
      console.warn('دریافت برنامه‌ها با خطا مواجه شد:', err.message);
      setSchedules([]); // ✅ fallback ایمن
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'teacher_id') {
      const selectedTeacher = teachers.find(teacher => teacher.id == value);
      setScheduleData(prev => ({
        ...prev,
        teacher_id: value,
        teacher_name: selectedTeacher ? `${selectedTeacher.first_name} ${selectedTeacher.last_name}` : ''
      }));
    } else if (name === 'class_id') {
      const selectedClass = classes.find(cls => cls.id == value);
      setScheduleData(prev => ({
        ...prev,
        [name]: value,
        student_count: selectedClass ? selectedClass.student_count || 0 : 0
      }));
    } else {
      setScheduleData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ تابع اصلاح شده: رفع خطای schedules is not iterable و مدیریت صحیح موفقیت
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editIndex !== null) {
        // ویرایش برنامه
        await axios.put(`${base_url}/schedule/${editIndex}`, scheduleData);
        setSchedules(prev => {
          const updated = Array.isArray(prev) ? [...prev] : [];
          updated[editIndex] = scheduleData;
          return updated;
        });
        setEditIndex(null);
      } else {
        // افزودن برنامه جدید
        const response = await axios.post(`${base_url}/register/schedule-teacher`, scheduleData, { withCredentials: true });

        // ✅ فقط اگر status 201 یا 200 باشد
        if (response.status === 201 || response.status === 200) {
          setSchedules(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [...safePrev, { ...scheduleData }];
          });
          alert("✅ برنامه با موفقیت ثبت شد.");
        } else {
          alert("⚠️ پاسخ غیرمنتظره از سرور. لطفاً در لیست بررسی کنید.");
        }
      }

      // ✅ ریست فرم
      setScheduleData({
        teacher_id: 0,
        teacher_name: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        class_id: 0,
        student_count: 0
      });

    } catch (err) {
      console.error('❌ خطای کامل در ارسال:', err);

      // ✅ حتی اگر catch اجرا شد، ولی احتمالاً داده ذخیره شده
      if (err.response) {
        const { status } = err.response;
        if (status === 201 || status === 200) {
          // احتمالاً موفق بوده، فقط parse مشکل داشته
          setSchedules(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [...safePrev, { ...scheduleData }];
          });
          return alert("✅ برنامه ثبت شد (پاسخ عجیب، اما احتمالاً موفق).");
        }
      }

      // برای خطاهای واقعی
      alert('❌ ثبت برنامه با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleEdit = (index) => {
    setScheduleData(schedules[index]);
    setEditIndex(index);
    setActiveTab('add');
  };

  const handleDelete = async (index) => {
    if (!window.confirm('آیا از حذف این برنامه اطمینان دارید؟')) return;

    try {
      const res = await axios.delete(`${base_url}/delete/schedule_Teacher/${schedules[index].id || index}` , {withCredentials: true});
      console.log(res);
      
      setSchedules(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.filter((_, i) => i !== index);
      });
    } catch (err) {
      setError('حذف برنامه با خطا مواجه شد.');
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchTeachers();
    fetchClasses();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>در حال دریافت اطلاعات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>خطا در دریافت اطلاعات</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={handleRetry} style={styles.retryBtn}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>سیستم مدیریت برنامه هفتگی اساتید</h1>
        <p style={styles.description}>مدیریت و برنامه‌ریزی زمان‌بندی کلاس‌های آموزشی</p>
      </header>

      <div style={styles.content}>
        <div style={styles.tabsContainer}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'add' ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('add')}
          >
            افزودن برنامه جدید
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'view' ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab('view')}
          >
            مشاهده برنامه‌ها
          </button>
        </div>

        {activeTab === 'add' ? (
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>{editIndex !== null ? 'ویرایش برنامه' : 'برنامه جدید'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="teacher_id" style={styles.inputLabel}>نام استاد</label>
                  <select
                    id="teacher_id"
                    name="teacher_id"
                    value={scheduleData.teacher_id}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">انتخاب استاد</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name + " " + teacher.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="class_id" style={styles.inputLabel}>کلاس</label>
                  <select
                    id="class_id"
                    name="class_id"
                    value={scheduleData.class_id}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">انتخاب کلاس</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name.length > 30 ? cls.class_name.substring(0, 30) + '...' : cls.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="day_of_week" style={styles.inputLabel}>روز هفته</label>
                  <select
                    id="day_of_week"
                    name="day_of_week"
                    value={scheduleData.day_of_week}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">انتخاب روز</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="start_time" style={styles.inputLabel}>ساعت شروع</label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={scheduleData.start_time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="end_time" style={styles.inputLabel}>ساعت پایان</label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={scheduleData.end_time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={styles.submitBtn}>
                {editIndex !== null ? 'ویرایش برنامه' : 'ثبت برنامه'}
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.viewSection}>
            <h2 style={styles.viewTitle}>برنامه‌های هفتگی</h2>

            {schedules.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📅</div>
                <p style={styles.emptyText}>هیچ برنامه‌ای ثبت نشده است</p>
              </div>
            ) : (
              <div style={styles.schedulesContainer}>
                {schedules.map((schedule, index) => {
                  const teacher = teachers.find(t => t.id == schedule.teacher_id);
                  const classInfo = classes.find(c => c.id == schedule.class_id);
                  
                  return (
                    <div key={index} style={styles.scheduleCard}>
                      <div style={styles.cardHeader}>
                        <h3 style={styles.teacherName}>
                          {schedule.teacher_name || (teacher ? `${teacher.first_name} ${teacher.last_name}` : 'نامعلوم')}
                        </h3>
                        <span style={styles.className}>
                          {classInfo ? classInfo.class_name : schedule.class_id}
                        </span>
                      </div>
                      <div style={styles.cardContent}>
                        <div style={styles.scheduleDetail}>
                          <span style={styles.detailLabel}>روز:</span>
                          <span style={styles.detailValue}>{schedule.day_of_week}</span>
                        </div>
                        <div style={styles.scheduleDetail}>
                          <span style={styles.detailLabel}>ساعت:</span>
                          <span style={styles.detailValue}>{schedule.start_time} - {schedule.end_time}</span>
                        </div>
                      </div>
                      <div style={styles.cardActions}>
                        <button style={styles.editBtn} onClick={() => handleEdit(index)}>ویرایش</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(index)}>حذف</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- استایل‌های داخلی (کامل) ---
const styles = {
  app: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    direction: 'rtl'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px 20px',
    background: 'linear-gradient(120deg, #2c3e50, #4a6491)',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  description: {
    fontSize: '18px',
    opacity: '0.9',
    margin: '0',
    fontWeight: '300'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  },
  tabsContainer: {
    display: 'flex',
    borderBottom: '1px solid #eaeaea',
    backgroundColor: '#f8f9fa'
  },
  tabButton: {
    flex: '1',
    padding: '18px',
    fontSize: '18px',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#6c757d',
    position: 'relative'
  },
  tabButtonActive: {
    color: '#2c3e50',
    backgroundColor: 'white'
  },
  formSection: {
    padding: '40px'
  },
  viewSection: {
    padding: '40px'
  },
  formTitle: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f1f1f1',
    fontWeight: '600'
  },
  viewTitle: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f1f1f1',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -15px 25px'
  },
  formGroup: {
    flex: '1 0 calc(50% - 30px)',
    margin: '0 15px',
    minWidth: '250px'
  },
  inputLabel: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#34495e',
    fontSize: '16px'
  },
  input: {
    width: '100%',
    padding: '15px',
    border: '2px solid #e1e5eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa'
  },
  select: {
    width: '100%',
    padding: '15px',
    border: '2px solid #e1e5eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235a6c7d\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left 15px center',
    backgroundSize: '16px'
  },
  submitBtn: {
    padding: '16px 30px',
    background: 'linear-gradient(90deg, #3498db, #2c3e50)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    marginTop: '20px',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6c757d'
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  emptyText: {
    fontSize: '18px',
    margin: '0'
  },
  schedulesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px'
  },
  scheduleCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #eaeaea'
  },
  cardHeader: {
    padding: '20px',
    background: 'linear-gradient(90deg, #4a6491, #2c3e50)',
    color: 'white'
  },
  teacherName: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '600'
  },
  className: {
    fontSize: '14px',
    opacity: '0.8'
  },
  cardContent: {
    padding: '20px'
  },
  scheduleDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f1f1f1'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  detailValue: {
    color: '#5a6c7d'
  },
  cardActions: {
    padding: '15px 20px',
    display: 'flex',
    borderTop: '1px solid #eaeaea',
    backgroundColor: '#f9f9f9'
  },
  editBtn: {
    flex: '1',
    padding: '10px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backgroundColor: '#f39c12',
    color: 'white'
  },
  deleteBtn: {
    flex: '1',
    padding: '10px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    backgroundColor: '#e74c3c',
    color: 'white'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '18px',
    color: '#5a6c7d'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    margin: '20px'
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  errorTitle: {
    fontSize: '24px',
    color: '#e74c3c',
    marginBottom: '10px'
  },
  errorMessage: {
    fontSize: '16px',
    color: '#5a6c7d',
    marginBottom: '20px'
  },
  retryBtn: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  }
};

// --- استایل‌های global ---
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f7fa;
  }
  input:focus, select:focus {
    border-color: #3498db !important;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2) !important;
    background-color: white !important;
  }
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

// افزودن استایل‌های global به صفحه
const styleSheet = document.createElement('style');
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default WeeklyScheduleManager;