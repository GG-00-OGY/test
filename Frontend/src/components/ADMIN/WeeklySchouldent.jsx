import { useState, useEffect } from 'react';

const WeeklySchedule = ({ classId }) => {
  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  });
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // ساعت‌های کلاسی
  const classTimes = [
    { start: '8:00', end: '9:30' },
    { start: '9:40', end: '11:10' },
    { start: '11:20', end: '12:50' }
  ];

  useEffect(() => {
    // شبیه‌سازی دریافت داده از API
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // دریافت لیست معلمان
        setTeachers([
          { id: 1, name: 'استاد احمدی' },
          { id: 2, name: 'استاد محمدی' },
          { id: 3, name: 'استاد حسینی' }
        ]);
        
        // دریافت لیست دروس
        setSubjects([
          { id: 1, name: 'ریاضی' },
          { id: 2, name: 'فیزیک' },
          { id: 3, name: 'شیمی' },
          { id: 4, name: 'ادبیات' },
          { id: 5, name: 'زبان انگلیسی' }
        ]);
        
        // دریافت برنامه هفتگی
        setSchedule({
          Monday: [
            
          ],
          Tuesday: [
            { time: '8:00-9:30', subject: 'ادبیات', teacher: 'استاد کریمی' },
            { time: '9:40-11:10', subject: 'زبان انگلیسی', teacher: 'استاد رضایی' },
            { time: '11:20-12:50', subject: 'ریاضی', teacher: 'استاد احمدی' }
          ],
          // ... روزهای دیگر
        });
        
        setLoading(false);
      } catch (error) {
        console.error('خطا در دریافت داده:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [classId]);

  const handleEdit = (day, index) => {
    setEditData({ day, index, ...schedule[day][index] });
    setIsEditing(true);
  };

  const handleSave = () => {
    const { day, index, ...updatedItem } = editData;
    const updatedSchedule = { ...schedule };
    updatedSchedule[day][index] = updatedItem;
    setSchedule(updatedSchedule);
    setIsEditing(false);
    // در اینجا می‌توانید اطلاعات را به سرور ارسال کنید
  };

  const handleAddNew = (day) => {
    const newItem = { 
      time: `${classTimes[0].start}-${classTimes[0].end}`,
      subject: '',
      teacher: ''
    };
    const updatedSchedule = { ...schedule };
    updatedSchedule[day].push(newItem);
    setSchedule(updatedSchedule);
    setEditData({ day, index: updatedSchedule[day].length - 1, ...newItem });
    setIsEditing(true);
  };

  const handleDelete = (day, index) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule[day].splice(index, 1);
    setSchedule(updatedSchedule);
  };

  // استایل‌های پایه
  const styles = {
    container: {
      direction: 'rtl',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '20px'
    },
    header: {
      color: '#2c3e50',
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '25px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    daysContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    dayCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
      padding: '15px'
    },
    dayHeader: {
      color: '#3498db',
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    addButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center'
    },
    classItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '6px'
    },
    classTime: {
      color: '#7f8c8d',
      fontSize: '12px',
      fontWeight: '500'
    },
    classInfo: {
      flex: 1,
      marginRight: '10px'
    },
    className: {
      color: '#2c3e50',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '5px'
    },
    teacherName: {
      color: '#34495e',
      fontSize: '12px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    editButton: {
      backgroundColor: '#f39c12',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '90%',
      maxWidth: '500px'
    },
    modalHeader: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#2c3e50'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#34495e',
      fontSize: '14px',
      fontWeight: '500'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9'
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    saveButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    cancelButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#7f8c8d',
      fontSize: '18px'
    }
  };

  if (loading) return <div style={styles.loading}>در حال بارگذاری برنامه هفتگی...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <i className="fas fa-calendar-alt" style={{ marginLeft: '10px', color: '#3498db' }}></i>
        برنامه هفتگی کلاس
      </h2>
      
      <div style={styles.daysContainer}>
        {Object.keys(schedule).map(day => (
          <div key={day} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <span>
                {day === 'Monday' && 'دوشنبه'}
                {day === 'Tuesday' && 'سه‌شنبه'}
                {day === 'Wednesday' && 'چهارشنبه'}
                {day === 'Thursday' && 'پنجشنبه'}
                {day === 'Friday' && 'جمعه'}
              </span>
              <button 
                style={styles.addButton}
                onClick={() => handleAddNew(day)}
              >
                <i className="fas fa-plus" style={{ marginLeft: '5px' }}></i>
                افزودن
              </button>
            </div>
            
            {schedule[day].map((classItem, index) => (
              <div key={index} style={styles.classItem}>
                <div style={styles.classInfo}>
                  <div style={styles.classTime}>{classItem.time}</div>
                  <div style={styles.className}>{classItem.subject}</div>
                  <div style={styles.teacherName}>{classItem.teacher}</div>
                </div>
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.editButton}
                    onClick={() => handleEdit(day, index)}
                  >
                    <i className="fas fa-edit" style={{ marginLeft: '5px' }}></i>
                    ویرایش
                  </button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDelete(day, index)}
                  >
                    <i className="fas fa-trash" style={{ marginLeft: '5px' }}></i>
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {isEditing && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeader}>ویرایش برنامه کلاسی</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>زمان:</label>
              <select 
                value={editData.time}
                onChange={(e) => setEditData({...editData, time: e.target.value})}
                style={styles.select}
              >
                {classTimes.map((time, index) => (
                  <option key={index} value={`${time.start}-${time.end}`}>
                    {time.start} تا {time.end}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>درس:</label>
              <select 
                value={editData.subject}
                onChange={(e) => setEditData({...editData, subject: e.target.value})}
                style={styles.select}
              >
                <option value="">انتخاب درس</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>معلم:</label>
              <select 
                value={editData.teacher}
                onChange={(e) => setEditData({...editData, teacher: e.target.value})}
                style={styles.select}
              >
                <option value="">انتخاب معلم</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                انصراف
              </button>
              <button 
                style={styles.saveButton}
                onClick={handleSave}
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
      
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </div>
  );
};

export default WeeklySchedule;