import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useState, useEffect, useMemo } from 'react';

const base_url = process.env.REACT_APP_API_URL;
const DAYS = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه'];
const PERIODS = ['زنگ اول','زنگ دوم','زنگ سوم','زنگ چهارم','زنگ پنجم'];

const buildInitialForm = (classes) => ({
  class_id: classes && classes.length ? classes[0].id : '',
  day_of_week: DAYS[0],
  period_number: PERIODS[0],
  subject_name: '',
  teacher_id: null,
  teacher_name: ''
});

const ClassScheduleForm = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(buildInitialForm([]));
  const [items, setItems] = useState([]); // آرایه رکوردهای موقت
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }
  const [autoClear, setAutoClear] = useState(true);
  const [teacherMode, setTeacherMode] = useState('select'); // 'select' | 'manual'

  // واکشی لیست کلاس‌ها و معلم‌ها از API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classRes, teacherRes] = await Promise.all([
          fetch(`${base_url}/dashbord/all-class`, { credentials: 'include' }),
          fetch(`${base_url}/dashbord/all-teacher`, { credentials: 'include' })
        ]);
        const classData = await classRes.json();
        const teacherData = await teacherRes.json();
        setClasses(classData.data || []);
        setTeachers(teacherData.data || []);
        setForm(buildInitialForm(classData.data || []));
      } catch (e) {
        setMessage({ type: 'error', text: 'خطا در دریافت داده‌ها از سرور' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // چک تکراری بودن
  const isDuplicate = useMemo(() => {
    return items.some(it =>
      it.class_id === form.class_id &&
      it.day_of_week === form.day_of_week &&
      it.period_number === form.period_number
    );
  }, [items, form.class_id, form.day_of_week, form.period_number]);

  const selectedTeacherName = useMemo(() => {
    if (!form.teacher_id) return '';
    const t = teachers.find(tt => tt.id === form.teacher_id);
    return t ? t.name : '';
  }, [form.teacher_id, teachers]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // همگام کردن teacher_name وقتی انتخاب لیست تغییر می‌کند
    if (key === 'teacher_id' && teacherMode === 'select') {
      const t = teachers.find(tt => tt.id === value);
      setForm(prev => ({ ...prev, teacher_name: t ? t.name : '' }));
    }
    if (key === 'teacher_name' && teacherMode === 'manual') {
      setForm(prev => ({ ...prev, teacher_id: null }));
    }
  };

  const resetForm = () => {
    setForm(f => ({
      ...buildInitialForm(classes),
      class_id: f.class_id // کلاس انتخاب‌شده باقی بماند
    }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addItem = () => {
    if (!form.subject_name.trim()) return showMessage('error', 'نام درس را وارد کنید.');
    if (teacherMode === 'select' && !form.teacher_id) return showMessage('error', 'معلم را انتخاب کنید.');
    if (teacherMode === 'manual' && !form.teacher_name.trim()) return showMessage('error', 'نام معلم دستی را وارد کنید.');
    if (isDuplicate) return showMessage('error', 'این ترکیب قبلاً در لیست است.');
    setItems(prev => [...prev, { ...form }]);
    showMessage('success', 'به لیست موقت افزوده شد.');
    if (autoClear) resetForm();
  };

  const removeItem = idx => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const submitSingle = async () => {
    if (!form.subject_name.trim()) return showMessage('error', 'نام درس الزامی است.');
    if (teacherMode === 'select' && !form.teacher_id) return showMessage('error', 'معلم را انتخاب کنید.');
    if (teacherMode === 'manual' && !form.teacher_name.trim()) return showMessage('error', 'نام معلم را بنویسید.');
    if (isDuplicate) return showMessage('error', 'در لیست موقت موجود است.');
    await sendToServer([form], true);
  };

  const submitAll = async () => {
    if (!items.length) return showMessage('error', 'لیست موقت خالی است.');
    await sendToServer(items, false);
  };

  const sendToServer = async (data, clearForm) => {
    setLoading(true);
    setMessage(null);
    try {
      // اطمینان از ارسال teacher_name برای هر رکورد (ترکیب first_name و last_name اگر teacher_id وجود داشت)
      const records = data.map(item => {
        let teacherName = item.teacher_name;
        if ((!teacherName || teacherName === '') && item.teacher_id) {
          const t = teachers.find(tt => tt.id === item.teacher_id);
          if (t && t.first_name && t.last_name) {
            teacherName = `${t.first_name} ${t.last_name}`;
          } else if (t) {
            teacherName = t.name || t.fullName || t.title || t.teacher_name || t.username || '';
          }
        }
        // اضافه کردن نام کلاس (حتی اگر مقدار قبلی وجود داشته باشد، بازنویسی شود)
        let className = '';
        if (item.class_id) {
          const c = classes.find(cc => cc.id === item.class_id);
          if (c) {
            className = c.title || c.name || c.class_name || c.className || '';
          }
        }
        // اگر item خودش class_name دارد و بالا مقداردهی نشد، از آن استفاده شود
        if (!className && item.class_name) {
          className = item.class_name;
        }
        return { ...item, teacher_name: teacherName, class_name: className };
      });
      const res = await fetch(`${base_url}/register/schedule-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('خطای سرور هنگام ارسال.');
      showMessage('success', 'ارسال موفق بود.');
      if (clearForm) resetForm();
      setItems(prev => prev.filter(p => !data.includes(p)));
    } catch (e) {
      showMessage('error', e.message || 'ارسال ناموفق.');
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles();

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>فرم برنامه هفتگی کلاس</h1>
      </div>

      {/* کارت فرم */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>افزودن رکورد</h2>

        <div style={styles.formGrid}>
          {/* کلاس */}
          <div style={styles.formGroup}>
            <label style={styles.label}>کلاس</label>
            <select
              value={form.class_id}
              onChange={e => handleChange('class_id', Number(e.target.value))}
              style={styles.select}
              disabled={loading || !classes.length}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.title || c.name || c.class_name}</option>
              ))}
            </select>
            <small style={styles.hint}>class_id: {form.class_id}</small>
          </div>

          {/* روز */}
          <div style={styles.formGroup}>
            <label style={styles.label}>روز هفته</label>
            <div style={styles.pillRow}>
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleChange('day_of_week', day)}
                  style={{
                    ...styles.pill,
                    background: form.day_of_week === day ? 'var(--c-accent)' : '#eee',
                    color: form.day_of_week === day ? '#fff' : '#333'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* زنگ */}
          <div style={styles.formGroup}>
            <label style={styles.label}>زنگ</label>
            <div style={styles.pillRow}>
              {PERIODS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange('period_number', p)}
                  style={{
                    ...styles.pill,
                    background: form.period_number === p ? 'var(--c-accent)' : '#eee',
                    color: form.period_number === p ? '#fff' : '#333'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* درس */}
          <div style={styles.formGroup}>
            <label style={styles.label}>نام درس</label>
            <input
              style={styles.input}
              placeholder="مثلاً ریاضی"
              value={form.subject_name}
              onChange={e => handleChange('subject_name', e.target.value)}
            />
          </div>

          {/* حالت معلم */}
          <div style={styles.formGroup}>
            <label style={styles.label}>حالت معلم</label>
            <div style={styles.toggleGroup}>
              <button
                type="button"
                onClick={() => {
                  setTeacherMode('select');
                  if (form.teacher_id) {
                    const t = TEACHERS.find(tt => tt.id === form.teacher_id);
                    handleChange('teacher_name', t ? t.name : '');
                  }
                }}
                style={{
                  ...styles.toggleBtn,
                  background: teacherMode === 'select' ? 'var(--c-accent)' : '#e0e0e0',
                  color: teacherMode === 'select' ? '#fff' : '#333'
                }}
              >
                انتخاب
              </button>
              <button
                type="button"
                onClick={() => {
                  setTeacherMode('manual');
                  handleChange('teacher_id', null);
                  handleChange('teacher_name', '');
                }}
                style={{
                  ...styles.toggleBtn,
                  background: teacherMode === 'manual' ? 'var(--c-accent)' : '#e0e0e0',
                  color: teacherMode === 'manual' ? '#fff' : '#333'
                }}
              >
                دستی
              </button>
            </div>
          </div>

          {/* انتخاب معلم */}
          {teacherMode === 'select' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>معلم (لیست)</label>
              <select
                style={styles.select}
                value={form.teacher_id || ''}
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  handleChange('teacher_id', val);
                  if (val) {
                    const t = teachers.find(tt => tt.id === val);
                    handleChange('teacher_name', t ? t.name : '');
                  } else {
                    handleChange('teacher_name', '');
                  }
                }}
                disabled={loading || !teachers.length}
              >
                <option value="">-- انتخاب --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{(t.first_name && t.last_name) ? `${t.first_name} ${t.last_name}` : (t.name || t.fullName || t.title || t.teacher_name || t.username)}</option>
                ))}
              </select>
            </div>
          )}

          {/* وارد کردن دستی معلم */}
          {teacherMode === 'manual' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>نام معلم (دستی)</label>
              <input
                style={styles.input}
                placeholder="مثلاً آقای عزتی"
                value={form.teacher_name}
                onChange={e => handleChange('teacher_name', e.target.value)}
              />
            </div>
          )}

          {/* Auto Clear */}
          <div style={styles.formGroup}>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                checked={autoClear}
                onChange={e => setAutoClear(e.target.checked)}
                style={{ marginLeft: 6 }}
              />
              پاک کردن فرم بعد از افزودن
            </label>
          </div>

          {/* دکمه‌ها + هشدار تکراری */}
          <div style={styles.formGroupFull}>
            {isDuplicate && (
              <div style={styles.warningBox}>
                این ترکیب (کلاس / روز / زنگ) در لیست موقت وجود دارد.
              </div>
            )}
            <div style={styles.actionsRow}>
              <button
                type="button"
                onClick={addItem}
                style={{ ...styles.actionBtn, background: 'var(--c-accent)' }}
                disabled={
                  !form.subject_name.trim() ||
                  (teacherMode === 'select' && !form.teacher_id) ||
                  (teacherMode === 'manual' && !form.teacher_name.trim())
                }
              >
                افزودن به لیست
              </button>
              <button
                type="button"
                onClick={submitSingle}
                disabled={loading}
                style={{ ...styles.actionBtn, background: '#3949ab' }}
              >
                ارسال تکی
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ ...styles.actionBtn, background: '#757575' }}
              >
                ریست فرم
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '1rem',
              padding: '.75rem 1rem',
              borderRadius: 12,
              fontSize: '.85rem',
              background: message.type === 'success' ? '#e8f5e9' : '#ffebee',
              color: message.type === 'success' ? '#2e7d32' : '#c62828',
              border: `1px solid ${message.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* لیست موقت */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>لیست موقت ({items.length})</h2>
        {items.length === 0 && <p style={styles.emptyText}>چیزی افزوده نشده است.</p>}
        <div style={styles.itemsContainer}>
          {items.map((it, idx) => (
            <div key={idx} style={styles.itemRow}>
              <div style={styles.itemMain}>
                <div style={styles.badgesRow}>
                  <span style={styles.badge}>{(classes.find(c => c.id === it.class_id) || {}).title}</span>
                  <span style={styles.badge}>{it.day_of_week}</span>
                  <span style={styles.badge}>{it.period_number}</span>
                </div>
                <div style={styles.itemText}>
                  <strong>{it.subject_name}</strong>
                  <span style={{ fontSize: '.7rem', color: '#555' }}>
                    {' '}| معلم: {it.teacher_name} {it.teacher_id ? `(ID:${it.teacher_id})` : ''}
                  </span>
                </div>
              </div>
              <div style={styles.itemActions}>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...it });
                    removeItem(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={styles.smallBtn}
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  style={{ ...styles.smallBtn, background: '#d32f2f' }}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={submitAll}
            disabled={!items.length || loading}
            style={{ ...styles.actionBtn, background: '#00897b' }}
          >
            ارسال همه
          </button>
          <button
            type="button"
            onClick={() => setItems([])}
            disabled={!items.length}
            style={{ ...styles.actionBtn, background: '#9e9e9e' }}
          >
            خالی کردن لیست
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={{ margin: 0, fontSize: '.7rem', opacity: .8 }}>
          میتوانید کلاس‌ها، معلم‌ها و Endpoint را از سرور واقعی واکشی کنید.
        </p>
      </footer>

      {/* استایل‌های سراسری */}
      <style>{`
        :root {
          --c-accent:#7e57c2;
          --c-bg:#f5f7fb;
          --c-card:#ffffff;
          --c-border:#e0e6f1;
          --c-shadow:0 4px 16px -4px rgba(40,40,90,.1),0 2px 6px -2px rgba(50,50,100,.08);
        }
        body {
          background: var(--c-bg);
        }
      `}</style>
    </div>
  );
};

// استایل‌ها را در یک تابع جدا نوشتیم تا شلوغ نشود
function getStyles() {
  return {
    wrapper: {
      fontFamily: 'IRANSans, Vazirmatn, sans-serif',
      direction: 'rtl',
      padding: '2rem 1.25rem',
      maxWidth: 980,
      margin: '0 auto',
      color: '#2f2f3a'
    },
    header: { textAlign: 'center', marginBottom: '1.5rem' },
    subtitle: { margin: '.25rem 0 0', fontSize: '.85rem', color: '#555' },
    card: {
      background: 'var(--c-card)',
      border: '1px solid var(--c-border)',
      borderRadius: 20,
      padding: '1.5rem 1.25rem 2rem',
      marginBottom: '1.75rem',
      boxShadow: 'var(--c-shadow)',
      position: 'relative',
      overflow: 'hidden'
    },
    sectionTitle: { margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '.3px' },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
      gap: '1.25rem'
    },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '.4rem' },
    formGroupFull: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      gap: '.75rem'
    },
    label: {
      fontSize: '.75rem',
      fontWeight: 600,
      letterSpacing: '.5px',
      textTransform: 'uppercase',
      color: '#666'
    },
    hint: { fontSize: '.6rem', color: '#888', marginTop: '-.3rem' },
    input: {
      border: '1px solid var(--c-border)',
      background: '#fafbff',
      borderRadius: 12,
      padding: '.65rem .8rem',
      fontSize: '.8rem',
      outline: 'none'
    },
    select: {
      border: '1px solid var(--c-border)',
      background: '#fafbff',
      borderRadius: 12,
      padding: '.6rem .7rem',
      fontSize: '.75rem',
      outline: 'none'
    },
    pillRow: { display: 'flex', flexWrap: 'wrap', gap: '.4rem' },
    pill: {
      border: 'none',
      padding: '.45rem .85rem',
      fontSize: '.7rem',
      borderRadius: 999,
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,.08)',
      letterSpacing: '.3px'
    },
    toggleGroup: { display: 'flex', gap: '.4rem' },
    toggleBtn: {
      flex: 1,
      border: 'none',
      borderRadius: 10,
      padding: '.55rem .4rem',
      fontSize: '.7rem',
      cursor: 'pointer',
      fontWeight: 600,
      letterSpacing: '.5px'
    },
    checkLabel: {
      fontSize: '.7rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      gap: '.2rem',
      color: '#444'
    },
    warningBox: {
      background: '#fff8e1',
      border: '1px solid #ffe082',
      color: '#8d6e63',
      padding: '.6rem .9rem',
      borderRadius: 14,
      fontSize: '.7rem'
    },
    actionsRow: { display: 'flex', flexWrap: 'wrap', gap: '.6rem' },
    actionBtn: {
      border: 'none',
      color: '#fff',
      fontSize: '.7rem',
      padding: '.7rem 1.1rem',
      borderRadius: 14,
      cursor: 'pointer',
      fontWeight: 600,
      letterSpacing: '.5px',
      boxShadow: '0 3px 10px -2px rgba(0,0,0,.18)'
    },
    itemsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '.8rem',
      maxHeight: 320,
      overflowY: 'auto',
      paddingRight: '.3rem'
    },
    itemRow: {
      background: '#f8f9fc',
      border: '1px solid #e5e9f3',
      borderRadius: 18,
      padding: '.75rem .9rem',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '.75rem',
      alignItems: 'center'
    },
    itemMain: { flex: 1, display: 'flex', flexDirection: 'column', gap: '.3rem' },
    badgesRow: { display: 'flex', gap: '.4rem', flexWrap: 'wrap' },
    badge: {
      background: '#eceffe',
      color: '#3949ab',
      fontSize: '.6rem',
      padding: '.3rem .55rem',
      borderRadius: 999,
      fontWeight: 600,
      letterSpacing: '.4px'
    },
    itemText: {
      fontSize: '.75rem',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '.25rem'
    },
    itemActions: { display: 'flex', flexDirection: 'column', gap: '.4rem' },
    smallBtn: {
      background: '#5e35b1',
      border: 'none',
      color: '#fff',
      fontSize: '.6rem',
      padding: '.45rem .6rem',
      borderRadius: 10,
      cursor: 'pointer',
      fontWeight: 600,
      letterSpacing: '.4px',
      minWidth: 60,
      textAlign: 'center'
    },
    emptyText: { fontSize: '.75rem', margin: '0 0 .5rem', color: '#777' },
    footer: { textAlign: 'center', marginTop: '2rem', opacity: .9 }
  };
}

export default ClassScheduleForm;