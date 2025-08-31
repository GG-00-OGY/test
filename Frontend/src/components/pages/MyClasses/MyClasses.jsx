import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaCalendarAlt,
  FaSearch
} from 'react-icons/fa';
import TeacherLayout from '../../Layout/TeacherLayout';
import './MyClasses.css';

const base_url = process.env.REACT_APP_API_URL;

const MyClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDay, setCurrentDay] = useState('');


  // Set current day in Persian (only once)
  useEffect(() => {
    // روزهای فارسی بدون نیم‌فاصله برای هماهنگی با کلیدهای API
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const today = new Date();
    let dayIndex = today.getDay();
    setCurrentDay(persianDays[dayIndex]);
    console.log('Current day (fa):', persianDays[dayIndex]);
  }, []);

  // Fetch classes when currentDay is set
  useEffect(() => {
    if (!currentDay) return;
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${base_url}/dashbord/my-classes`, { credentials: 'include' });
        const data = await res.json();
        console.log(currentDay);
        
        console.log('API data:', data);
        let todayClasses = [];
        if (data.classes_by_day && Array.isArray(data.classes_by_day[currentDay])) {
          todayClasses = data.classes_by_day[currentDay];
        }
        console.log('todayClasses:', todayClasses, 'for currentDay:', currentDay);
        setClasses(todayClasses);
      } catch (e) {
        setClasses([]);
      }
    };
    fetchClasses();
  }, [currentDay]);

  // فیلتر بر اساس جستجو
  const filteredClasses = classes.filter(cls => {
    const className = (cls.class_name || '').toLowerCase();
    const teacherName = (cls.teacher_name || '').toLowerCase();
    const matchesSearch = className.includes(searchTerm.toLowerCase()) || teacherName.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAttendance = (classId) => {
    navigate(`/attendance/${classId}`);
  };

  const handleAddClass = () => {
    navigate('/add-class');
  };

  return (
    <TeacherLayout>
      <div className="my-classes-container">
        <div className="my-classes-header">
          <h1>کلاس‌های من - امروز ({currentDay})</h1>
          
          <div className="header-actions">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="جستجوی کلاس  ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="classes-grid">
          {filteredClasses.length > 0 ? (
            filteredClasses.map(cls => (
              <div key={cls.schedule_id} className="class-card">
                <div className="class-header">
                  <div className="class-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <div className="class-info">
                    <h3>{cls.class_name || `کلاس ${cls.class_id}`}</h3>
                    <p className="teacher-name">{cls.teacher_name}</p>
                  </div>
                </div>

                <div className="class-details">
                  <div className="detail-item">
                    <FaUsers />
                    <span>{cls.students ? `${cls.students} دانش‌آموز` : ''}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>{cls.day_of_week} - {cls.period_number}</span>
                  </div>
                  <div className="detail-item attendance">
                    <span>{cls.subject_name ? `درس: ${cls.subject_name}` : ''}</span>
                  </div>
                </div>

                <div className="class-actions">
                  <button 
                    className="attendance-button"
                    onClick={() => handleAttendance(cls.class_id)}
                  >
                    <FaCalendarAlt />
                    حضور و غیاب
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              {searchTerm 
                ? 'کلاسی یافت نشد' 
                : `هیچ کلاسی برای امروز (${currentDay}) برنامه‌ریزی نشده است`}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default MyClasses;