import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUsers, 
  faCheckCircle, 
  faTimesCircle,
  faSave,
  faSearch,
  faFilter,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import styles from './AttendancePage.module.css';

const base_url = process.env.REACT_APP_API_URL;

const gregorianToJalali = (date) => {
  if (!date) return '';
  return moment(date).format('jYYYY/jMM/jDD');
};

// کامپوننت اصلی حضور و غیاب
const AttendancePage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState({
    classInfo: null,
    students: [],
    date: '',
    day: '',
    session: null
  });
  
  // State for filters and search
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  // State for mobile menu
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch class info
        const classRes = await axios.get(`${base_url}/dashbord/class/${classId}`, { withCredentials: true });
        const classInfo = classRes.data.class_info;
        
        // Fetch students of the class
        const studentsRes = await axios.get(`${base_url}/dashbord/class/${classId}/students`, { withCredentials: true });
        
        // Handle both array and object response for students
        let studentsData = studentsRes.data;
        if (!Array.isArray(studentsData)) {
          studentsData = studentsData.students || [];
        }
        
        // Fetch today's attendance records
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const attendanceRes = await axios.get(`${base_url}/dashbord/teacher/class/${classId}/attendance`, { withCredentials: true });
        const attendanceRecords = attendanceRes.data.attendance || [];
        
        // Map students with full name and attendance status
        let students = studentsData.map(s => {
          // ✅ ترکیب نام و نام خانوادگی
          const fullName = `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'نامشخص';

          const attendanceRecord = attendanceRecords.find(ar => 
            ar.student_id === s.id || ar.student_national_code === s.national_code
          );
          
          return { 
            ...s,
            fullName, // ✅ اضافه کردن نام کامل
            present: attendanceRecord ? attendanceRecord.status === 'present' : true,
            attendanceId: attendanceRecord ? attendanceRecord.id : null
          };
        });
        
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
        const date = new Date();
        const dayIndex = date.getDay();

        setAttendanceData({
          classInfo,
          students,
          date: gregorianToJalali(dateStr),
          day: persianDays[dayIndex],
          session: classInfo.schedule ? classInfo.schedule.find(s => s.day === persianDays[dayIndex]) : null
        });
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchData();
  }, [classId]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle attendance toggle
  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => {
      const updatedStudents = prev.students.map(student => 
        student.id === studentId ? { ...student, present: !student.present } : student
      );
      return { ...prev, students: updatedStudents };
    });
  };

  // Handle save attendance
  const saveAttendance = async () => {
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      // Prepare payload for all students
      const payload = attendanceData.students.map(s => {
        // ✅ ترکیب first_name و last_name برای ارسال
        const studentName = `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'نامشخص';
        
        
        return {
          student_id: s.id,
          student_name: studentName,
          teacher_name: attendanceData.classInfo[0].teacher_name, // ✅ ارسال نام معلم
          class_name: attendanceData.classInfo[0].class_name,
          student_national_code: s.national_code || '',
          teacher_id: attendanceData.classInfo[0].teacher_id || 0,
          class_id: attendanceData.classInfo[0].id,
          status: s.present ? 'present' : 'absent',
          is_excused: 0,
          date: gregorianToJalali(dateStr),
          attendance_id: s.attendanceId || null
        };
      });
      
      await axios.post(`${base_url}/register/attendance`, payload, { withCredentials: true });
      alert('حضور و غیاب با موفقیت ثبت شد');
      
      // Refresh data after saving
      const attendanceRes = await axios.get(`${base_url}/dashbord/teacher/class/${classId}/attendance`, { withCredentials: true });
      const attendanceRecords = attendanceRes.data.attendance || [];
      
      // Update attendance IDs for future updates
      setAttendanceData(prev => {
        const updatedStudents = prev.students.map(student => {
          const attendanceRecord = attendanceRecords.find(ar => 
            ar.student_id === student.id || ar.student_national_code === student.national_code
          );
          return {
            ...student,
            attendanceId: attendanceRecord ? attendanceRecord.id : null
          };
        });
        
        return { ...prev, students: updatedStudents };
      });
      
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('خطا در ثبت حضور و غیاب');
    }
  };

  // Filter students based on filters
  const filteredStudents = attendanceData.students.filter(student => {
    const fullName = student.fullName || '';
    const studentId = student.studentId || '';
    const nationalCode = student.national_code || '';
    const matchesSearch = fullName.includes(filters.search) || 
                         studentId.includes(filters.search) || 
                         nationalCode.includes(filters.search);
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'present' && student.present) || 
                         (filters.status === 'absent' && !student.present);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const presentCount = attendanceData.students.filter(s => s.present).length;
  const absentCount = attendanceData.students.length - presentCount;

  if (!attendanceData.classInfo) {
    return (
      <div className={styles.loading}>در حال بارگذاری اطلاعات کلاس...</div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          {!isMobile && <span className={styles.buttonText}>بازگشت</span>}
        </button>
        
        <h1 className={styles.headerTitle}>
          {isMobile ? 'حضور و غیاب' : 'حضور و غیاب دانش‌آموزان'}
        </h1>
        
        {isMobile && (
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      </div>

      {/* Class Info - Mobile */}
      {isMobile && (
        <div className={styles.mobileClassInfo}>
          <div className={styles.mobileInfoItem}>
            <span className={styles.mobileInfoLabel}>کلاس:</span>
            <span className={styles.mobileInfoValue}>{attendanceData.classInfo.class_name || attendanceData.classInfo.name}</span>
          </div>
          <div className={styles.mobileInfoItem}>
            <span className={styles.mobileInfoLabel}>تاریخ:</span>
            <span className={styles.mobileInfoValue}>{attendanceData.date}</span>
          </div>
        </div>
      )}

      {/* Class Info - Desktop */}
      {!isMobile && (
        <div className={styles.infoContainer}>
          <div className={styles.infoGroup}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>کلاس:</span>
              <span className={styles.infoValue}>{attendanceData.classInfo.class_name || attendanceData.classInfo.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>استاد:</span>
              <span className={styles.infoValue}>{attendanceData.classInfo.teacher_name || attendanceData.classInfo.teacher}</span>
            </div>
          </div>
          
          <div className={styles.infoGroup}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>تاریخ:</span>
              <span className={styles.infoValue}>{attendanceData.date}</span>
            </div>
            {attendanceData.session && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>زمان کلاس:</span>
                <span className={styles.infoValue}>{attendanceData.session.time}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className={`${styles.filtersContainer} ${showMobileFilters ? styles.showMobileFilters : ''}`}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            name="search"
            placeholder="جستجوی دانش‌آموز..."
            value={filters.search}
            onChange={handleFilterChange}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="present">فقط حاضرین</option>
            <option value="absent">فقط غایبین</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={`${styles.statCard} ${styles.presentCard}`}>
          <div className={styles.statIconWrapper}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{presentCount}</span>
            <span className={styles.statLabel}>حاضر</span>
            {!isMobile && (
              <span className={styles.statPercent}>
                {Math.round((presentCount / attendanceData.students.length) * 100)}%
              </span>
            )}
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.absentCard}`}>
          <div className={styles.statIconWrapper}>
            <FontAwesomeIcon icon={faTimesCircle} className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{absentCount}</span>
            <span className={styles.statLabel}>غایب</span>
            {!isMobile && (
              <span className={styles.statPercent}>
                {Math.round((absentCount / attendanceData.students.length) * 100)}%
              </span>
            )}
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.totalCard}`}>
          <div className={styles.statIconWrapper}>
            <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{attendanceData.students.length}</span>
            <span className={styles.statLabel}>کل دانش‌آموزان</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            لیست دانش‌آموزان {!isMobile && `(${filteredStudents.length})`}
          </h2>
          <div className={styles.tableActions}>
            <button 
              className={`${styles.actionButton} ${styles.saveButton}`} 
              onClick={saveAttendance}
            >
              <FontAwesomeIcon icon={faSave} />
              <span className={styles.buttonText}>ثبت حضور و غیاب</span>
            </button>
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          {filteredStudents.length > 0 ? (
            isMobile ? (
              <div className={styles.mobileList}>
                {filteredStudents.map((student, index) => (
                  <div key={student.id} className={styles.mobileListItem}>
                    <div className={styles.mobileStudentInfo}>
                      <span className={styles.mobileStudentNumber}>{index + 1}.</span>
                      <div>
                        {/* ✅ نمایش نام کامل */}
                        <div className={styles.mobileStudentName}>{student.fullName}</div>
                        <div className={styles.mobileStudentId}>کد ملی: {student.national_code || 'نامشخص'}</div>
                      </div>
                    </div>
                    <div className={styles.mobileActions}>
                      <div className={styles.attendanceToggle}>
                        <label className={styles.toggleSwitch}>
                          <input 
                            type="checkbox" 
                            checked={student.present}
                            onChange={() => toggleAttendance(student.id)}
                            className={styles.toggleInput}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={`${styles.statusText} ${student.present ? styles.present : styles.absent}`}>
                          {student.present ? 'حاضر' : 'غایب'}
                        </span>
                      </div>
                      <button 
                        className={styles.smallButton}
                        onClick={() => toggleAttendance(student.id)}
                      >
                        {student.present ? 'غایب' : 'حاضر'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeaderCell}>ردیف</th>
                    <th className={styles.tableHeaderCell}>کد دانش‌آموزی</th>
                    <th className={styles.tableHeaderCell}>کد ملی</th>
                    <th className={styles.tableHeaderCell}>نام دانش‌آموز</th>
                    <th className={styles.tableHeaderCell}>وضعیت حضور</th>
                    <th className={styles.tableHeaderCell}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{index + 1}</td>
                      <td className={styles.tableCell}>{student.studentId || 'نامشخص'}</td>
                      <td className={styles.tableCell}>{student.national_code || 'نامشخص'}</td>
                      <td className={`${styles.tableCell} ${styles.studentName}`}>{student.fullName}</td>
                      <td className={styles.tableCell}>
                        <div className={styles.attendanceToggle}>
                          <label className={styles.toggleSwitch}>
                            <input 
                              type="checkbox" 
                              checked={student.present}
                              onChange={() => toggleAttendance(student.id)}
                              className={styles.toggleInput}
                            />
                            <span className={styles.toggleSlider}></span>
                          </label>
                          <span className={`${styles.statusText} ${student.present ? styles.present : styles.absent}`}>
                            {student.present ? 'حاضر' : 'غایب'}
                          </span>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <button 
                          className={styles.smallButton}
                          onClick={() => toggleAttendance(student.id)}
                        >
                          {student.present ? 'غایب' : 'حاضر'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <div className={styles.noResults}>
              دانش‌آموزی با این فیلترها یافت نشد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;