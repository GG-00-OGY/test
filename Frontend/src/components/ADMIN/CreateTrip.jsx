import { useState, useEffect } from "react";
import axios from "axios";

// کامپوننت Toast برای نمایش پیام
const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyles = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "600",
    zIndex: 1000,
    transition: "opacity 0.3s ease-in-out",
    opacity: visible ? 1 : 0,
    cursor: "pointer",
    backgroundColor: type === "success" ? "#27ae60" : "#e74c3c"
  };

  return (
    <div style={toastStyles} onClick={onClose}>
      {message}
    </div>
  );
};

// تابع‌های تبدیل تاریخ میلادی به شمسی
const gregorianToJalali = (gy, gm, gd) => {
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) 
    + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * (parseInt(days / 12053)); 
  days %= 12053;
  jy += 4 * (parseInt(days / 1461));
  days %= 1461;
  jy += parseInt((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return [jy, jm, jd];
};

const jalaliToGregorian = (jy, jm, jd) => {
  jy += 1595;
  let days = -355668 + (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) 
    + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * parseInt(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * parseInt(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * parseInt(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += parseInt((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm;
  for (gm = 0; gm < 13; gm++) {
    let v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
};

// کامپوننت تقویم شمسی
const PersianDatePicker = ({ value, onChange, name, required, style }) => {
  const [jalaliDate, setJalaliDate] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
      setJalaliDate(`${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`);
    } else {
      setJalaliDate("");
    }
  }, [value]);

  const handleJalaliChange = (e) => {
    const value = e.target.value;
    setJalaliDate(value);
    
    if (value.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
      const [jy, jm, jd] = value.split('/').map(Number);
      const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
      const gregorianDate = new Date(gy, gm - 1, gd);
      onChange({ target: { name, value: gregorianDate.toISOString().split('T')[0] } });
    }
  };

  const generateCalendar = () => {
    const today = new Date();
    const [jy, jm] = gregorianToJalali(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    
    const firstDayOfMonth = new Date(jalaliToGregorian(jy, jm, 1));
    const lastDayOfMonth = new Date(jalaliToGregorian(jy, jm + 1, 0));
    
    const days = [];
    const daysInMonth = lastDayOfMonth.getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div style={{
        position: "absolute",
        top: "100%",
        left: 0,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
            قبلی
          </button>
          <span>{jy}/{jm}</span>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
            بعدی
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
            <div key={day} style={{ textAlign: "center", fontWeight: "bold" }}>{day}</div>
          ))}
          {days.map(day => (
            <div
              key={day}
              style={{
                padding: "5px",
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "3px",
                backgroundColor: day === today.getDate() ? "#eee" : "transparent"
              }}
              onClick={() => {
                const [gy, gm, gd] = jalaliToGregorian(jy, jm, day);
                const date = new Date(gy, gm - 1, gd);
                onChange({ target: { name, value: date.toISOString().split('T')[0] } });
                setShowPicker(false);
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={jalaliDate}
        onChange={handleJalaliChange}
        onFocus={() => setShowPicker(true)}
        placeholder="۱۳۸۰/۰۱/۰۱"
        required={required}
        style={style}
      />
      {showPicker && generateCalendar()}
    </div>
  );
};

const CreateTrip = () => {
  const [tripData, setTripData] = useState({
    tour_name: "",
    tour_address: "",
    cost: "",
    capacity: "",
    remaining_capacity: "",
    tour_date: "",
    grade: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const base_url = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        tour_name: tripData.tour_name,
        tour_address: tripData.tour_address,
        cost: Number(tripData.cost),
        capacity: Number(tripData.capacity),
        tour_date: tripData.tour_date,
        grade: tripData.grade,
      };

      if (tripData.remaining_capacity !== "") {
        dataToSend.remaining_capacity = Number(tripData.remaining_capacity);
      }

      await axios.post(`${base_url}/register/tour`, dataToSend, { withCredentials: true });
      showToast("اردو با موفقیت ثبت شد", "success");

      setTripData({
        tour_name: "",
        tour_address: "",
        cost: "",
        capacity: "",
        remaining_capacity: "",
        tour_date: "",
        grade: "",
      });
    } catch (err) {
      console.error("خطا در ثبت اردو:", err);
      showToast("خطا در ثبت اردو", "error");
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = {
    container: { direction: "rtl", fontFamily: '"Vazir", sans-serif', background: "#f5f7fa", minHeight: "100vh", padding: "20px" },
    header: { textAlign: "center", fontSize: "24px", fontWeight: "700", marginBottom: "25px", color: "#2c3e50" },
    form: { background: "white", borderRadius: "10px", padding: "20px", maxWidth: "800px", margin: "0 auto", boxShadow: "0 2px 15px rgba(0,0,0,0.1)" },
    formGroup: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "8px", fontWeight: "600" },
    input: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px" },
    submitButton: { background: "#27ae60", color: "#fff", padding: "12px", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" },
  };

  const styles = baseStyles;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>ایجاد اردوی جدید</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>عنوان اردو</label>
          <input type="text" name="tour_name" value={tripData.tour_name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>آدرس اردو</label>
          <input type="text" name="tour_address" value={tripData.tour_address} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>هزینه (تومان)</label>
          <input type="number" name="cost" value={tripData.cost} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>ظرفیت کل</label>
          <input type="number" name="capacity" value={tripData.capacity} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>ظرفیت باقی‌مانده (اختیاری)</label>
          <input type="number" name="remaining_capacity" value={tripData.remaining_capacity} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>تاریخ اردو</label>
          <PersianDatePicker
            name="tour_date"
            value={tripData.tour_date}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>پایه تحصیلی</label>
          <select name="grade" value={tripData.grade} onChange={handleChange} required style={styles.input}>
            <option value="">انتخاب کنید</option>
            <option value="هفتم">هفتم</option>
            <option value="هشتم">هشتم</option>
            <option value="نهم">نهم</option>
          </select>
        </div>

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? "در حال ثبت..." : "ثبت اردو"}
        </button>
      </form>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default CreateTrip;