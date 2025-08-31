import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const base_url = process.env.REACT_APP_API_URL;

const classTypes = [
  { value: "jebrani", label: "جبرانی" },
  { value: "taghviti", label: "تقویتی" },
  { value: "amoozeshi", label: "آموزشی" },
  { value: "other", label: "سایر" },
];

const grades = [
  "هفتم", "هشتم", "نهم"
];

// کامپوننت تقویم شمسی
const PersianDatePicker = ({ value, onChange, disabled }) => {
  const handleDateChange = (dateObject) => {
    if (dateObject) {
      const jalaliDateString = dateObject.format("YYYY/MM/DD");
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = new Date(dateObject.convert(persian).toDate());
      const gregorianDateString = gregorianDate.toISOString().split('T')[0];
      
      onChange(jalaliDateString, gregorianDateString);
    } else {
      onChange("", "");
    }
  };

  return (
    <DatePicker
      value={value || ""}
      onChange={handleDateChange}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      disabled={disabled}
      inputClass="persian-datepicker"
      containerClassName="datepicker-wrapper"
      placeholder="انتخاب تاریخ"
      format="YYYY/MM/DD"
    />
  );
};

const AddAdvancedClassForm = () => {
  const [teachers, setTeachers] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [formData, setFormData] = useState({
    className: "",
    classType: "",
    teacherId: "",
    date: "",
    jalaliDate: "",
    time: "",
    description: "",
    grade: "",
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [isLoadingClassNames, setIsLoadingClassNames] = useState(true);

  useEffect(() => {
    // دریافت لیست مدرسین از API
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${base_url}/dashbord/all-teacher`, {
          withCredentials: true
        });
        
        // ترکیب نام و نام خانوادگی معلم‌ها
        const teachersWithFullName = response.data.data.map(teacher => ({
          ...teacher,
          fullName: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()
        }));
        
        setTeachers(teachersWithFullName);
      } catch (error) {
        console.error("خطا در دریافت لیست مدرسین:", error);
        // استفاده از لیست پیش‌فرض در صورت خطا
        setTeachers([
          { id: 1, fullName: "خانم احمدی" },
          { id: 2, fullName: "آقای رضایی" },
          { id: 3, fullName: "خانم موسوی" },
        ]);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    // دریافت لیست نام کلاس‌ها از API
    const fetchClassNames = async () => {
      try {
        const response = await axios.get(`${base_url}/dashbord/all-class`, {
          withCredentials: true
        });
        
        // اصلاح: استفاده از response.data.data که آرایه‌ای از کلاس‌هاست
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // استخراج نام کلاس‌ها از آرایه
          const classNamesList = response.data.data.map(classItem => classItem.class_name);
          setClassNames(classNamesList);
        } else {
          throw new Error("فرمت داده‌های دریافتی نامعتبر است");
        }
      } catch (error) {
        console.error("خطا در دریافت لیست نام کلاس‌ها:", error);
        // استفاده از لیست پیش‌فرض در صورت خطا
        setClassNames([
          "ریاضی پایه هفتم",
          "علوم پایه هشتم",
          "ادبیات پایه نهم",
          "زبان انگلیسی",
          "عربی",
          "فیزیک",
          "شیمی"
        ]);
      } finally {
        setIsLoadingClassNames(false);
      }
    };

    fetchTeachers();
    fetchClassNames();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.className.trim()) tempErrors.className = "نام کلاس الزامی است.";
    if (!formData.classType) tempErrors.classType = "نوع کلاس را انتخاب کنید.";
    if (!formData.teacherId) tempErrors.teacherId = "مدرس کلاس را انتخاب کنید.";
    if (!formData.date) tempErrors.date = "تاریخ کلاس را وارد کنید.";
    
    // اعتبارسنجی زمان به فرمت 24 ساعته
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!formData.time.trim()) {
      tempErrors.time = "زمان کلاس را وارد کنید.";
    } else if (!timeRegex.test(formData.time)) {
      tempErrors.time = "زمان باید به فرمت 24 ساعته (مثلاً 14:30) باشد.";
    }
    
    if (!formData.grade) tempErrors.grade = "پایه کلاس را انتخاب کنید.";
    return tempErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (jalaliDate, gregorianDate) => {
    setFormData((prev) => ({ 
      ...prev, 
      jalaliDate: jalaliDate,
      date: gregorianDate
    }));
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitSuccess(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${base_url}/register/extracurricular`,
        {
          class_name: formData.className,
          class_type: formData.classType,
          teacher_id: formData.teacherId,
          teacher_name: teachers.find(t => t.id === parseInt(formData.teacherId))?.fullName || "",
          class_date: formData.jalaliDate, // ارسال تاریخ شمسی
          class_time: formData.time,
          notes: formData.description,
          grade: formData.grade,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSubmitSuccess(true);
        setFormData({
          className: "",
          classType: "",
          teacherId: "",
          date: "",
          jalaliDate: "",
          time: "",
          description: "",
          grade: "",
        });
      } else {
        setSubmitSuccess(false);
        alert(response.data.message || "خطا در ثبت کلاس");
      }
    } catch (error) {
      console.error("خطا در اتصال به سرور:", error);
      alert(error.response?.data?.message || "خطا در اتصال به سرور");
      setSubmitSuccess(false);
    }

    setIsSubmitting(false);
  };

  // استایل‌های CSS برای تاریخ‌پیکر
  const datePickerStyles = `
    .persian-datepicker {
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      font-size: 15px;
      outline: none;
      color: #202124;
      font-weight: 500;
      background-color: #f8f9fa;
      width: 100%;
      box-sizing: border-box;
      text-align: right;
      direction: rtl;
      font-family: 'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .datepicker-wrapper {
      width: 100%;
    }
    
    .rmdp-wrapper {
      width: 100%;
    }
    
    .rmdp-top-class {
      width: 100%;
    }
    
    .rmdp-calendar {
      width: 100%;
      font-family: 'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .rmdp-day.rmdp-selected span {
      background-color: #1a73e8;
    }
    
    .rmdp-day.rmdp-today span {
      background-color: #e6f0ff;
    }
    
    .rmdp-header-values {
      color: #1a73e8;
    }
    
    .rmdp-week-day {
      color: #5f6368;
    }
  `;

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      fontFamily: "'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      direction: "rtl",
    },
    form: {
      backgroundColor: "#ffffff",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      maxWidth: 500,
      width: "100%",
      border: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
      gap: 20,
    },
    title: {
      color: "#1a73e8",
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottom: "1px solid #e0e0e0",
    },
    label: {
      fontWeight: "600",
      fontSize: 14,
      marginBottom: 8,
      color: "#5f6368",
      display: "block",
    },
    input: {
      padding: "12px 16px",
      borderRadius: 8,
      border: "1px solid #e0e0e0",
      fontSize: 15,
      outline: "none",
      color: "#202124",
      fontWeight: "500",
      backgroundColor: "#f8f9fa",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    select: {
      padding: "12px 16px",
      borderRadius: 8,
      border: "1px solid #e0e0e0",
      fontSize: 15,
      outline: "none",
      color: "#202124",
      fontWeight: "500",
      backgroundColor: "#f8f9fa",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    textarea: {
      padding: "12px 16px",
      borderRadius: 8,
      border: "1px solid #e0e0e0",
      fontSize: 15,
      outline: "none",
      resize: "vertical",
      minHeight: 100,
      color: "#202124",
      fontWeight: "500",
      backgroundColor: "#f8f9fa",
      transition: "all 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    errorText: {
      color: "#d32f2f",
      fontSize: 13,
      marginTop: 6,
      fontWeight: "500",
    },
    button: {
      marginTop: 12,
      padding: "14px 0",
      borderRadius: 8,
      border: "none",
      backgroundColor: "#1a73e8",
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
    },
    successMessage: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#34a853",
      color: "#ffffff",
      fontWeight: "600",
      textAlign: "center",
      fontSize: 14,
    },
    loadingText: {
      textAlign: "center",
      color: "#5f6368",
      padding: "12px 0",
    }
  };

  return (
    <div style={styles.container}>
      <style>{datePickerStyles}</style>
      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 style={styles.title}>ثبت کلاس فوق برنامه</h2>

        <div>
          <label style={styles.label} htmlFor="className">نام کلاس</label>
          {isLoadingClassNames ? (
            <p style={styles.loadingText}>در حال دریافت لیست کلاس‌ها...</p>
          ) : (
            <>
              <select
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                style={{...styles.select, ...(errors.className ? {borderColor: "#d32f2f"} : {})}}
                disabled={isSubmitting}
              >
                <option value="">انتخاب کنید...</option>
                {classNames.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
              {errors.className && <p style={styles.errorText}>{errors.className}</p>}
            </>
          )}
        </div>

        <div>
          <label style={styles.label} htmlFor="classType">نوع کلاس</label>
          <select
            id="classType"
            name="classType"
            value={formData.classType}
            onChange={handleChange}
            style={{...styles.select, ...(errors.classType ? {borderColor: "#d32f2f"} : {})}}
            disabled={isSubmitting}
          >
            <option value="">انتخاب کنید...</option>
            {classTypes.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.classType && <p style={styles.errorText}>{errors.classType}</p>}
        </div>

        <div>
          <label style={styles.label} htmlFor="teacherId">مدرس کلاس</label>
          {isLoadingTeachers ? (
            <p style={styles.loadingText}>در حال دریافت لیست مدرسین...</p>
          ) : (
            <>
              <select
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                style={{...styles.select, ...(errors.teacherId ? {borderColor: "#d32f2f"} : {})}}
                disabled={isSubmitting}
              >
                <option value="">انتخاب کنید...</option>
                {teachers.map(({ id, fullName }) => (
                  <option key={id} value={id}>{fullName}</option>
                ))}
              </select>
              {errors.teacherId && <p style={styles.errorText}>{errors.teacherId}</p>}
            </>
          )}
        </div>

        <div>
          <label style={styles.label} htmlFor="date">تاریخ کلاس (شمسی)</label>
          <PersianDatePicker
            value={formData.jalaliDate}
            onChange={handleDateChange}
            disabled={isSubmitting}
          />
          {errors.date && <p style={styles.errorText}>{errors.date}</p>}
        </div>

        <div>
          <label style={styles.label} htmlFor="time">زمان کلاس (فرمت 24 ساعته، مثال: 14:30)</label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="مثال: 14:30"
            style={{...styles.input, ...(errors.time ? {borderColor: "#d32f2f"} : {})}}
            disabled={isSubmitting}
          />
          {errors.time && <p style={styles.errorText}>{errors.time}</p>}
        </div>

        <div>
          <label style={styles.label} htmlFor="grade">پایه تحصیلی</label>
          <select
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            style={{...styles.select, ...(errors.grade ? {borderColor: "#d32f2f"} : {})}}
            disabled={isSubmitting}
          >
            <option value="">انتخاب کنید...</option>
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.grade && <p style={styles.errorText}>{errors.grade}</p>}
        </div>

        <div>
          <label style={styles.label} htmlFor="description">توضیحات (اختیاری)</label>
          <textarea
            id="description"
            name="description"
            placeholder="مثلاً مدرس، محل کلاس و غیره"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1
          }}
          disabled={isSubmitting || isLoadingTeachers || isLoadingClassNames}
        >
          {isSubmitting ? "در حال ارسال ..." : "ثبت کلاس"}
        </button>

        {submitSuccess && (
          <div style={styles.successMessage}>
            کلاس با موفقیت ثبت شد!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddAdvancedClassForm;