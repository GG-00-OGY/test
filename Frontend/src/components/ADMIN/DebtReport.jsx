import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DebtReport = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // وضعیت ویرایش
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [newDebtValue, setNewDebtValue] = useState('');
  const [saving, setSaving] = useState(false);

  // آدرس‌ها (در صورت نیاز تغییر بده)
  const base_url = process.env.REACT_APP_API_URL;
  const FETCH_URL = `${base_url}/dashbord/all-student`;
  const UPDATE_DEBT_URL = `${base_url}/update/update-debt`; 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const fetchStudents = async () => {
      try {
        const res = await axios.get(FETCH_URL, { withCredentials: true });
        console.log('API response (raw):', res.data);

        // چون API ممکنه مستقیم آرایه برگردونه یا داخل data قرار گرفته باشه
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        // نرمال‌سازی: debt, education_level, academic_year, national_code, fullName
        const normalized = raw.map(s => {
          const debt = Number(
            s.debt_amount ?? s.debt ?? s.remaining ?? s.remaining_amount ?? 0
          ) || 0;

          const education_level =
            s.education_level ??
            s.grade ??
            s.class_level ??
            s.level ??
            s.school_grade ??
            s.base ??
            '';

          const academic_year =
            s.academic_year ??
            s.school_year ??
            s.year ??
            s.schoolYear ??
            '';

          const national_code =
            s.national_code ??
            s.nationalCode ??
            s.national_id ??
            s.nationalId ??
            s.natid ??
            s.id_card ??
            s.idcard ??
            '';

          const fullName = [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || s.full_name || `#${s.id}`;

          return {
            ...s,
            debt,
            education_level,
            academic_year,
            national_code,
            fullName
          };
        });

        setStudents(normalized);
      } catch (err) {
        console.error('خطا در دریافت دانش‌آموزها:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
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
    filterSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#34495e'
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      width: '100%'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      padding: '15px',
      marginBottom: '15px'
    },
    cardRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: '1px solid #f0f0f0'
    },
    cardLabel: {
      color: '#7f8c8d',
      fontSize: '13px',
      fontWeight: '500'
    },
    cardValue: {
      color: '#34495e',
      fontSize: '13px',
      fontWeight: '600'
    },
    unpaidCard: {
      borderRight: '4px solid #e74c3c'
    },
    loading: {
      textAlign: 'center',
      padding: '30px',
      color: '#7f8c8d',
      fontSize: '16px'
    },
    tableWrapper: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white'
    },
    tableHeaderCell: {
      padding: '12px 15px',
      fontWeight: '600',
      textAlign: 'right'
    },
    tableRow: {
      borderBottom: '1px solid #f0f0f0'
    },
    unpaidRow: {
      backgroundColor: '#fff6f6'
    },
    tableCell: {
      padding: '12px 15px',
      color: '#34495e',
      fontWeight: '500'
    }
  };

  const formatCurrency = (n) => (Number(n) || 0).toLocaleString() + ' تومان';

  const filtered = students.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'paid') return (Number(s.debt) || 0) === 0;
    if (filter === 'unpaid') return (Number(s.debt) || 0) > 0;
    return true;
  });

  // ذخیره‌ی بدهی جدید
  const handleSaveDebt = async (studentId) => {
    const val = Number(newDebtValue);
    if (Number.isNaN(val) || val < 0) {
      alert('مقدار بدهی باید عدد صحیح و صفر یا بیشتر باشد');
      return;
    }

    try {
      setSaving(true);
      // درخواست PUT به سرور — اگر endpoint شما فرق داره این خط رو تغییر بده
      const res = await axios.put(`${UPDATE_DEBT_URL}/${studentId}`, { debt: val }, { withCredentials: true });
      console.log('update response:', res.data);

      // اگر آپدیت موفق بود، state را به‌روزرسانی کن
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, debt: val } : s));
      setEditingStudentId(null);
      setNewDebtValue('');
    } catch (err) {
      console.error('خطا در ذخیره بدهی:', err);
      alert('خطا در ذخیره بدهی. لاگ کنسول را بررسی کن.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.loading}>در حال بارگذاری گزارش بدهی‌ها...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <i className="fas fa-file-invoice-dollar" style={{ marginLeft: '10px', color: '#e74c3c' }}></i>
        گزارش بدهی‌های دانش‌آموزان
      </h2>

      <div style={styles.filterSection}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
          <label style={styles.filterLabel}>فیلتر:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
            <option value="all">همه دانش‌آموزان</option>
            <option value="paid">تسویه شده</option>
            <option value="unpaid">تسویه نشده</option>
          </select>
        </div>
      </div>

      {isMobile ? (
        <div>
          {filtered.map(s => (
            <div key={s.id} style={{ ...styles.card, ...((Number(s.debt) || 0) > 0 ? styles.unpaidCard : {}) }}>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>دانش‌آموز:</span>
                <span style={styles.cardValue}>{s.fullName}</span>
              </div>

              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>کد ملی:</span>
                <span style={styles.cardValue}>{s.national_code || '-'}</span>
              </div>

              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>پایه تحصیلی:</span>
                <span style={styles.cardValue}>{s.education_level || '-'}</span>
              </div>

              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>سال تحصیلی:</span>
                <span style={styles.cardValue}>{s.academic_year || '-'}</span>
              </div>

              <div style={styles.cardRow}>
                <span style={styles.cardLabel}>مبلغ بدهی:</span>
                <span style={{
                  ...styles.cardValue,
                  color: (Number(s.debt) || 0) > 0 ? '#e74c3c' : '#27ae60'
                }}>
                  {editingStudentId === s.id ? (
                    <input
                      type="number"
                      value={newDebtValue}
                      onChange={(e) => setNewDebtValue(e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6, width: 140 }}
                    />
                  ) : (
                    formatCurrency(s.debt)
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                {editingStudentId === s.id ? (
                  <>
                    <button
                      onClick={() => handleSaveDebt(s.id)}
                      disabled={saving}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #27ae60', background: '#27ae60', color: '#fff', cursor: 'pointer' }}
                    >
                      {saving ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <button
                      onClick={() => { setEditingStudentId(null); setNewDebtValue(''); }}
                      disabled={saving}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#333', cursor: 'pointer' }}
                    >
                      انصراف
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setEditingStudentId(s.id); setNewDebtValue(String(Number(s.debt) || 0)); }}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #3498db', background: '#3498db', color: '#fff', cursor: 'pointer' }}
                  >
                    تغییر بدهی
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>ID</th>
                <th style={styles.tableHeaderCell}>نام</th>
                <th style={styles.tableHeaderCell}>نام خانوادگی</th>
                <th style={styles.tableHeaderCell}>کد ملی</th>
                <th style={styles.tableHeaderCell}>پایه تحصیلی</th>
                <th style={styles.tableHeaderCell}>سال تحصیلی</th>
                <th style={styles.tableHeaderCell}>بدهی</th>
                <th style={styles.tableHeaderCell}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ ...styles.tableRow, ...((Number(s.debt) || 0) > 0 ? styles.unpaidRow : {}) }}>
                  <td style={styles.tableCell}>{s.id}</td>
                  <td style={styles.tableCell}>{s.first_name}</td>
                  <td style={styles.tableCell}>{s.last_name}</td>
                  <td style={styles.tableCell}>{s.national_code || '-'}</td>
                  <td style={styles.tableCell}>{s.education_level || '-'}</td>
                  <td style={styles.tableCell}>{s.academic_year || '-'}</td>
                  <td style={{ ...styles.tableCell, color: (Number(s.debt) || 0) > 0 ? '#e74c3c' : '#27ae60' }}>
                    {editingStudentId === s.id ? (
                      <input
                        type="number"
                        value={newDebtValue}
                        onChange={(e) => setNewDebtValue(e.target.value)}
                        style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 6, width: 140 }}
                      />
                    ) : (
                      formatCurrency(s.debt)
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {editingStudentId === s.id ? (
                      <>
                        <button
                          onClick={() => handleSaveDebt(s.id)}
                          disabled={saving}
                          style={{ marginInlineStart: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #27ae60', background: '#27ae60', color: '#fff', cursor: 'pointer' }}
                        >
                          {saving ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                        <button
                          onClick={() => { setEditingStudentId(null); setNewDebtValue(''); }}
                          disabled={saving}
                          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #bbb', background: '#fff', color: '#333', cursor: 'pointer' }}
                        >
                          انصراف
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setEditingStudentId(s.id); setNewDebtValue(String(Number(s.debt) || 0)); }}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #3498db', background: '#3498db', color: '#fff', cursor: 'pointer' }}
                      >
                        تغییر بدهی
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
};

export default DebtReport;
