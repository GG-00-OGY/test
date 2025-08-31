import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherStudentInfo = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const base_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // گرفتن داده‌ها با فلگ ignore (جلوگیری از دوبار اجرا در StrictMode)
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (ignore) return;
      ignore = true;

      setLoading(true);
      try {
        if (activeTab === 'teachers') {
          const res = await axios.get(
            `${base_url}/dashbord/all-teacher`,
            { withCredentials: true }
          );
          setTeachers(res.data.data);
        } else {
          const res = await axios.get(
            `${base_url}/dashbord/all-student`,
            { withCredentials: true }
          );
          setStudents(res.data.data);
        }
      } catch (err) {
        console.error('خطا در دریافت داده:', err);
      }
      setLoading(false);
    };

    fetchData();

    return () => {
      ignore = true; // cleanup برای جلوگیری از اجراهای ناخواسته
    };
  }, [activeTab]);

  const downloadExcel = async () => {
    try {
      const url =
        activeTab === 'teachers'
          ? `${base_url}/dashbord/excel-teacher`
          : `${base_url}/dashbord/excel-student`;

      const response = await axios.get(url, {
        withCredentials: true,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute(
        'download',
        activeTab === 'teachers' ? 'teachers.xlsx' : 'students.xlsx'
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('خطا در دانلود فایل:', error);
      alert('مشکل در دانلود فایل اکسل');
    }
  };

  const baseStyles = {
    container: {
      direction: 'rtl',
      padding: '15px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    tabs: { display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '15px' },
    tab: { padding: '10px 15px', cursor: 'pointer', borderBottom: '3px solid transparent' },
    activeTab: { borderBottom: '3px solid #3498db', color: '#3498db', fontWeight: '600' },
    exportButton: {
      backgroundColor: '#27ae60',
      color: '#fff',
      border: 'none',
      padding: '8px 15px',
      cursor: 'pointer',
    },
    loading: { textAlign: 'center', padding: '30px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      backgroundColor: '#3498db',
      color: '#fff',
      padding: '10px',
      textAlign: 'right',
    },
    td: { borderBottom: '1px solid #ddd', padding: '10px' },
    card: {
      background: '#fff',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
  };

  if (loading) return <div style={baseStyles.loading}>در حال بارگذاری اطلاعات...</div>;

  return (
    <div style={baseStyles.container}>
      <h2 style={baseStyles.header}>اطلاعات معلمان و دانش‌آموزان</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={baseStyles.tabs}>
          <div
            style={{ ...baseStyles.tab, ...(activeTab === 'teachers' ? baseStyles.activeTab : {}) }}
            onClick={() => setActiveTab('teachers')}
          >
            معلمان
          </div>
          <div
            style={{ ...baseStyles.tab, ...(activeTab === 'students' ? baseStyles.activeTab : {}) }}
            onClick={() => setActiveTab('students')}
          >
            دانش‌آموزان
          </div>
        </div>
        <button style={baseStyles.exportButton} onClick={downloadExcel}>
          خروجی اکسل
        </button>
      </div>

      {isMobile ? (
        activeTab === 'teachers' ? (
          teachers.map((t) => (
            <div key={t.id} style={baseStyles.card}>
              <p>
                <strong>نام:</strong> {t.first_name} {t.last_name}
              </p>
              <p>
                <strong>کد ملی:</strong> {t.national_code}
              </p>
              <p>
                <strong>نقش:</strong> {t.role}
              </p>
            </div>
          ))
        ) : (
          students.map((s) => (
            <div key={s.id} style={baseStyles.card}>
              <p>
                <strong>نام:</strong> {s.first_name} {s.last_name}
              </p>
              <p>
                <strong>نام پدر:</strong> {s.father_name}
              </p>
              <p>
                <strong>نام مادر:</strong> {s.mother_name}
              </p>
              <p>
                <strong>کد ملی:</strong> {s.national_code}
              </p>
              <p>
                <strong>پایه:</strong> {s.grade}
              </p>
              <p>
                <strong>کلاس:</strong> {s.class_name}
              </p>
              <p>
                <strong>سال تحصیلی:</strong> {s.school_year}
              </p>
            </div>
          ))
        )
      ) : activeTab === 'teachers' ? (
        <table style={baseStyles.table}>
          <thead>
            <tr>
              <th style={baseStyles.th}>شناسه</th>
              <th style={baseStyles.th}>نام</th>
              <th style={baseStyles.th}>کد ملی</th>
              <th style={baseStyles.th}>نقش</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td style={baseStyles.td}>{t.id}</td>
                <td style={baseStyles.td}>
                  {t.first_name} {t.last_name}
                </td>
                <td style={baseStyles.td}>{t.national_code}</td>
                <td style={baseStyles.td}>{t.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={baseStyles.table}>
          <thead>
            <tr>
              <th style={baseStyles.th}>شناسه</th>
              <th style={baseStyles.th}>نام</th>
              <th style={baseStyles.th}>نام پدر</th>
              <th style={baseStyles.th}>نام مادر</th>
              <th style={baseStyles.th}>کد ملی</th>
              <th style={baseStyles.th}>پایه</th>
              <th style={baseStyles.th}>کلاس</th>
              <th style={baseStyles.th}>سال تحصیلی</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td style={baseStyles.td}>{s.id}</td>
                <td style={baseStyles.td}>
                  {s.first_name} {s.last_name}
                </td>
                <td style={baseStyles.td}>{s.father_name}</td>
                <td style={baseStyles.td}>{s.mother_name}</td>
                <td style={baseStyles.td}>{s.national_code}</td>
                <td style={baseStyles.td}>{s.grade}</td>
                <td style={baseStyles.td}>{s.class_name}</td>
                <td style={baseStyles.td}>{s.school_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherStudentInfo;
