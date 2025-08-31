import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const base_url = process.env.REACT_APP_API_URL;

export default function AddStudent() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    father_name: '',
    mother_name: '',
    national_code: '',
    father_phone: '',
    mother_phone: '',
    home_phone: '',
    password: '',
    grade: '',
    school_year: '',
    class_name: '',
    debt: 0,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setIsLoadingClasses(true);
    setClassesError(null);
    
    try {
      const res = await axios.get(`${base_url}/dashbord/all-class`, { withCredentials: true });
      console.log(res);
      
      if (res.data.data && Array.isArray(res.data.data)) {
        setClasses(res.data.data);
      } else {
        throw new Error('فرمت داده دریافتی نامعتبر است');
      }
    } catch (err) {
      console.error('خطا در بارگیری کلاس‌ها:', err?.message || err);
      setClassesError('خطا در دریافت لیست کلاس‌ها');
      // استفاده از داده‌های نمونه فقط در حالت توسعه
      if (process.env.NODE_ENV === 'development') {
        setClasses([
          { id: '1', class_name: 'کلاس ۱ الف', grade: '1' },
          { id: '2', class_name: 'کلاس ۲ ب', grade: '2' },
          { id: '3', class_name: 'کلاس ۳ ج', grade: '3' },
        ]);
      }
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsed = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData((p) => ({ ...p, [name]: parsed }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setPhotoFile(file || null);
  };

  const validate = () => {
    if (!formData.first_name.trim()) return 'نام را وارد کنید.';
    if (!formData.last_name.trim()) return 'نام خانوادگی را وارد کنید.';
    if (!formData.national_code.trim()) return 'کد ملی را وارد کنید.';
    if (!birthDate) return 'تاریخ تولد را انتخاب کنید.';
    if (!formData.grade) return 'پایه تحصیلی را انتخاب کنید.';
    return null;
  };

  const uploadPhotoToServer = async () => {
    if (!photoFile) return null;
    const fd = new FormData();
    fd.append('photo', photoFile);
    if (formData.national_code) fd.append('national_code', formData.national_code);

    try {
      const res = await axios.post(`${base_url}/upload/student/`, fd, {
        withCredentials: true,
      });

      if (res.status === 200 || res.status === 201) {
        return res.data.photo_path || res.data.filename || null;
      } else {
        throw new Error('آپلود عکس ناموفق بود');
      }
    } catch (err) {
      console.error('خطا در آپلود عکس:', err?.response?.data || err.message || err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        rtl: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const birth_date_str = birthDate.format('YYYY-MM-DD');

      let photo_path = null;
      if (photoFile) {
        photo_path = await uploadPhotoToServer();
        if (!photo_path) {
          throw new Error('آپلود عکس موفق نبود یا مسیر عکس بازنگردانده شد.');
        }
      }

      const payload = {
        ...formData,
        birth_date: birth_date_str,
        photo_path: photo_path,
      };

      const res = await axios.post(`${base_url}/register/student`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('دانش‌آموز با موفقیت ثبت شد.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          rtl: true,
          onClose: () => navigate('/admin')
        });
      } else {
        console.error('پاسخ غیرمنتظره از سرور:', res);
        toast.error('ثبت انجام نشد — پاسخ سرور را بررسی کنید.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          rtl: true,
        });
      }
    } catch (err) {
      console.error('خطا در ثبت دانش‌آموز:', err?.response?.data || err.message || err);
      const msg = err?.response?.data?.message || err.message || 'خطای نامشخص';
      toast.error('ثبت با خطا مواجه شد: ' + msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        rtl: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // استایل‌های به‌روز شده
  const styles = {
    container: {
      direction: 'rtl',
      fontFamily: 'Vazir, Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f9f9fb',
      borderRadius: '10px',
      maxWidth: '100%',
      margin: '20px auto',
      boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
    },
    header: { 
      color: '#1f2937', 
      marginBottom: '20px', 
      textAlign: 'center',
      fontSize: '24px'
    },
    formGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    fullRow: { gridColumn: '1 / -1' },
    formGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px'
    },
    label: { 
      fontWeight: 700, 
      fontSize: '14px', 
      color: '#334155'
    },
    input: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'right',
      background: '#fff',
    },
    select: { 
      padding: '12px', 
      borderRadius: '8px', 
      border: '1px solid #e2e8f0',
      width: '100%',
      background: '#fff'
    },
    datePicker: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      width: '100%',
      background: '#fff',
      boxSizing: 'border-box'
    },
    fileInput: {
      width: '100%',
      padding: '10px 0',
      display: 'none' // فایل اینپوت اصلی را مخفی می‌کنیم
    },
    fileInputLabel: {
      display: 'inline-block',
      padding: '12px 20px',
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '1px solid #ced4da',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      width: '100%',
      boxSizing: 'border-box',
      '&:hover': {
        backgroundColor: '#e9ecef',
        borderColor: '#adb5bd'
      }
    },
    fileName: {
      marginTop: '8px',
      fontSize: '14px',
      color: '#6c757d',
      textAlign: 'center'
    },
    submitButton: {
      backgroundColor: 'rgb(39, 174, 96)',
      color: 'white',
      border: 'none',
      padding: '14px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 700,
      width: '100%',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: 'blue'
      },
      '&:disabled': {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed'
      }
    },
    smallNote: { 
      fontSize: '12px', 
      color: '#64748b',
      marginTop: '8px'
    },
    loadingText: {
      textAlign: 'center',
      color: '#64748b',
      fontStyle: 'italic'
    },
    errorText: {
      textAlign: 'center',
      color: '#e53e3e',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container} className="add-student-root">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <style>{`
        .add-student-root form { }
        .add-student-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
          gap: 20px; 
        }
        .add-student-full { grid-column: 1 / -1; }
        
        @media (max-width: 768px) {
          .add-student-grid { grid-template-columns: 1fr; }
          .add-student-root { padding: 15px; margin: 10px; }
          .add-student-root h2 { font-size: 20px; }
        }
        
        @media (max-width: 480px) {
          .add-student-root { padding: 10px; margin: 5px; }
          .add-student-root h2 { font-size: 18px; }
        }
      `}</style>

      <h2 style={styles.header}>ثبت نام دانش‌آموز جدید</h2>

      <form onSubmit={handleSubmit} className="add-student-grid">
        <div style={styles.formGroup}>
          <label style={styles.label}>نام</label>
          <input name="first_name" value={formData.first_name} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>نام خانوادگی</label>
          <input name="last_name" value={formData.last_name} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>نام پدر</label>
          <input name="father_name" value={formData.father_name} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>نام مادر</label>
          <input name="mother_name" value={formData.mother_name} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>کد ملی</label>
          <input name="national_code" value={formData.national_code} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>تلفن پدر</label>
          <input name="father_phone" value={formData.father_phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>تلفن مادر</label>
          <input name="mother_phone" value={formData.mother_phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>تلفن منزل</label>
          <input name="home_phone" value={formData.home_phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>رمز عبور</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>پایه تحصیلی</label>
          <select name="grade" value={formData.grade} onChange={handleChange} style={styles.select} required>
            <option value="">انتخاب پایه تحصیلی</option>
            <option value="هفتم">هفتم</option>
            <option value="هشتم">هشتم</option>
            <option value="نهم">نهم</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>سال تحصیلی</label>
          <input name="school_year" value={formData.school_year} onChange={handleChange} placeholder="مثلاً: ۱۴۰۳-۱۴۰۴" style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>نام کلاس</label>
          <select name="class_name" value={formData.class_name} onChange={handleChange} style={styles.select}>
            <option value="">انتخاب کلاس</option>
            {isLoadingClasses ? (
              <option value="" disabled>در حال بارگیری کلاس‌ها...</option>
            ) : classesError ? (
              <option value="" disabled>خطا در بارگیری کلاس‌ها</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={c.class_name}>{c.class_name}</option>
              ))
            )}
          </select>
          {classesError && (
            <div style={styles.errorText}>
              {classesError}
              <button 
                type="button" 
                onClick={loadClasses}
                style={{marginRight: '10px', padding: '5px 10px', cursor: 'pointer'}}
              >
                تلاش مجدد
              </button>
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>بدهی (عدد)</label>
          <input name="debt" type="number" min={0} value={formData.debt} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>تاریخ تولد (شمسی)</label>
          <DatePicker
            value={birthDate}
            onChange={setBirthDate}
            calendar={persian}
            locale={persian_fa}
            style={styles.datePicker}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>عکس دانش‌آموز (اختیاری)</label>
          <input 
            id="fileInput"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
          <label htmlFor="fileInput" style={styles.fileInputLabel}>
            انتخاب فایل
          </label>
          {photoFile && (
            <div style={styles.fileName}>
              فایل انتخاب شده: {photoFile.name}
            </div>
          )}
          <div style={styles.smallNote}>
            اگر عکس آپلود شود، ابتدا به سرویس آپلود ارسال می‌شود و سپس مسیر آن به همراه داده دانش‌آموز ثبت خواهد شد.
          </div>
        </div>

        <div className="add-student-full" style={{ ...styles.formGroup, ...styles.fullRow }}>
          <button disabled={isSubmitting} type="submit" style={styles.submitButton}>
            {isSubmitting ? 'در حال ارسال...' : 'ثبت دانش‌آموز'}
          </button>
        </div>
      </form>
    </div>
  );
}