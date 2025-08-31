import { useState, useEffect } from 'react';
import axios from 'axios';

const PreRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const base_url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchData = async () => {
  try {
    const res = await axios.get(`${base_url}/pre/all/pre-register` , { withCredentials: true });

    const dataArray = Array.isArray(res.data.preRegistrations) ? res.data.preRegistrations : [];

    const formattedData = dataArray.map(item => ({
      id: item.id,
      studentName: `${item.first_name} ${item.last_name}`,
      elementarySchool: item.elementary_school_name,
      teacherName: item.sixth_grade_teacher_name,
      fatherPhone: item.father_phone,
      motherPhone: item.mother_phone,
      homePhone: item.home_phone,
      notes: item.notes,
      isSelected: item.is_selected,
      createdAt: item.created_at
    }));

    setRegistrations(formattedData);
  } catch (err) {
    console.error('خطا در دریافت داده‌ها:', err);
  } finally {
    setLoading(false);
  }
};



    fetchData();

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${base_url}/update/pre-register/${id}`  , { isSelected: 1 } , { withCredentials: true });
      setRegistrations(prev =>
        prev.map(reg => reg.id === id ? { ...reg, isSelected: 1 } : reg)
      );
    } catch (err) {
      console.error('خطا در تایید:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`${base_url}/delete/pre-register/${id}` , { withCredentials: true });
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    } catch (err) {
      console.error('خطا در رد کردن:', err);
    }
  };

  const baseStyles = {
    container: {
      direction: 'rtl',
      fontFamily: '"Vazir", "Segoe UI", Tahoma, sans-serif',
      padding: '15px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    },
    header: {
      color: '#2c3e50',
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '20px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      padding: '15px',
      marginBottom: '15px'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: '1px solid #f0f0f0'
    },
    cardTitle: { color: '#2c3e50', fontSize: '16px', fontWeight: '600', margin: '0' },
    cardContent: { display: 'flex', flexDirection: 'column', gap: '8px' },
    cardRow: { display: 'flex', justifyContent: 'space-between' },
    cardLabel: { color: '#7f8c8d', fontSize: '13px' },
    cardValue: { color: '#34495e', fontSize: '13px', fontWeight: '500' },
    badge: { padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    pendingBadge: { backgroundColor: '#f39c12', color: 'white' },
    approvedBadge: { backgroundColor: '#27ae60', color: 'white' },
    rejectedBadge: { backgroundColor: '#e74c3c', color: 'white' },
    actions: { display: 'flex', gap: '8px', marginTop: '10px' },
    approveButton: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center' },
    rejectButton: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center' },
    loading: { textAlign: 'center', padding: '30px', color: '#7f8c8d', fontSize: '16px' }
  };

  const desktopStyles = { container: { padding: '25px' }, header: { fontSize: '24px', marginBottom: '25px' } };

  const tableStyles = {
    tableWrapper: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    tableHeader: { backgroundColor: '#3498db', color: 'white' },
    tableHeaderCell: { padding: '12px 15px', fontWeight: '600', textAlign: 'right' },
    tableRow: { borderBottom: '1px solid #f0f0f0' },
    tableCell: { padding: '12px 15px', color: '#34495e', fontWeight: '500' },
    tableBadge: { padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    tableButtonGroup: { display: 'flex', gap: '8px' }
  };

  const getStyles = () => isMobile ? baseStyles : { ...baseStyles, container: { ...baseStyles.container, ...desktopStyles.container }, header: { ...baseStyles.header, ...desktopStyles.header } };
  const styles = getStyles();

  if (loading) return <div style={styles.loading}>در حال بارگذاری درخواست‌ها...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <i className="fas fa-clipboard-list" style={{ marginLeft: '10px', color: '#3498db' }}></i>
        درخواست‌های پیش‌ثبت‌نام
      </h2>

      {isMobile ? (
        <div>
          {registrations.map(reg => (
            <div key={reg.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{reg.studentName}</h3>
                <span style={{
                  ...styles.badge,
                  ...(reg.isSelected ? styles.approvedBadge : styles.pendingBadge)
                }}>
                  {reg.isSelected ? 'تایید شده' : 'در حال بررسی'}
                </span>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.cardRow}><span style={styles.cardLabel}>نام مدرسه:</span><span style={styles.cardValue}>{reg.elementarySchool}</span></div>
                <div style={styles.cardRow}><span style={styles.cardLabel}>نام معلم:</span><span style={styles.cardValue}>{reg.teacherName}</span></div>
                <div style={styles.cardRow}><span style={styles.cardLabel}>تلفن والد:</span><span style={styles.cardValue}>{reg.fatherPhone}</span></div>
                <div style={styles.cardRow}><span style={styles.cardLabel}>تلفن مادر:</span><span style={styles.cardValue}>{reg.motherPhone}</span></div>
                <div style={styles.cardRow}><span style={styles.cardLabel}>تلفن منزل:</span><span style={styles.cardValue}>{reg.homePhone}</span></div>
                <div style={styles.cardRow}><span style={styles.cardLabel}>یادداشت:</span><span style={styles.cardValue}>{reg.notes}</span></div>

                {!reg.isSelected && (
                  <div style={styles.actions}>
                    <button style={styles.approveButton} onClick={() => handleApprove(reg.id)}>تایید</button>
                    <button style={styles.rejectButton} onClick={() => handleReject(reg.id)}>رد</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={tableStyles.tableWrapper}>
          <table style={tableStyles.table}>
            <thead>
              <tr style={tableStyles.tableHeader}>
                <th style={tableStyles.tableHeaderCell}>نام دانش‌آموز</th>
                <th style={tableStyles.tableHeaderCell}>نام مدرسه</th>
                <th style={tableStyles.tableHeaderCell}>نام معلم</th>
                <th style={tableStyles.tableHeaderCell}>تلفن والد</th>
                <th style={tableStyles.tableHeaderCell}>تلفن مادر</th>
                <th style={tableStyles.tableHeaderCell}>تلفن منزل</th>
                <th style={tableStyles.tableHeaderCell}>یادداشت</th>
                <th style={tableStyles.tableHeaderCell}>وضعیت</th>
                <th style={tableStyles.tableHeaderCell}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id} style={tableStyles.tableRow}>
                  <td style={tableStyles.tableCell}>{reg.studentName}</td>
                  <td style={tableStyles.tableCell}>{reg.elementarySchool}</td>
                  <td style={tableStyles.tableCell}>{reg.teacherName}</td>
                  <td style={tableStyles.tableCell}>{reg.fatherPhone}</td>
                  <td style={tableStyles.tableCell}>{reg.motherPhone}</td>
                  <td style={tableStyles.tableCell}>{reg.homePhone}</td>
                  <td style={tableStyles.tableCell}>{reg.notes}</td>
                  <td style={tableStyles.tableCell}>
                    <span style={{
                      ...tableStyles.tableBadge,
                      ...(reg.isSelected ? styles.approvedBadge : styles.pendingBadge)
                    }}>
                      {reg.isSelected ? 'تایید شده' : 'در حال بررسی'}
                    </span>
                  </td>
                  <td style={tableStyles.tableCell}>
                    {!reg.isSelected && (
                      <div style={tableStyles.tableButtonGroup}>
                        <button style={styles.approveButton} onClick={() => handleApprove(reg.id)}>تایید</button>
                        <button style={styles.rejectButton} onClick={() => handleReject(reg.id)}>رد</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default PreRegistration;
