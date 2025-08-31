import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateClass = () => {
  const [classData, setClassData] = useState({
    class_name: "",
    school_year: "1402-1403",
    student_count: "",
    grade: ""
  });
  const [loading, setLoading] = useState(false);

  const base_url = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "student_count") {
      setClassData({ ...classData, [name]: value === "" ? "" : parseInt(value) });
    } else {
      setClassData({ ...classData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${base_url}/register/class` , classData , { withCredentials: true });
      
      toast.success("کلاس با موفقیت ثبت شد!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        rtl: true,
      });
      
      setClassData({
        class_name: "",
        school_year: "1402-1403",
        student_count: "",
        grade: ""
      });
    } catch (err) {
      console.error("خطا در ثبت کلاس:", err);
      
      toast.error("خطا در ثبت کلاس", {
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
      setLoading(false);
    }
  };

  const styles = {
    container: {
      direction: "rtl",
      fontFamily: "Vazir, Arial, sans-serif",
      background: "#f4f6f8",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      padding: "40px 30px",
      width: "100%",
      maxWidth: "500px",
      transition: "all 0.3s ease"
    },
    header: {
      textAlign: "center",
      fontSize: "26px",
      fontWeight: "700",
      marginBottom: "30px",
      color: "#2c3e50"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px"
    },
    label: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#34495e",
      marginBottom: "6px"
    },
    input: {
      padding: "12px 15px",
      border: "1px solid #dce1e6",
      borderRadius: "8px",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none",
      backgroundColor: "#f9f9f9"
    },
    select: {
      padding: "12px 15px",
      border: "1px solid #dce1e6",
      borderRadius: "8px",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none",
      backgroundColor: "#f9f9f9",
      cursor: "pointer"
    },
    inputFocus: {
      borderColor: "#3498db",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)",
      backgroundColor: "#fff"
    },
    submitButton: {
      backgroundColor: "#27ae60",
      color: "#fff",
      border: "none",
      padding: "14px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      transition: "all 0.3s ease"
    },
    submitHover: {
      backgroundColor: "#2ecc71",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(39,174,96,0.2)"
    }
  };

  return (
    <>
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
      
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.header}>ایجاد کلاس جدید</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>نام کلاس</label>
              <input
                type="text"
                name="class_name"
                value={classData.class_name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>سال تحصیلی</label>
              <input
                type="text"
                name="school_year"
                value={classData.school_year}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>تعداد دانش‌آموزان</label>
              <input
                type="number"
                name="student_count"
                value={classData.student_count}
                onChange={handleChange}
                required
                style={styles.input}
                min="1"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>پایه تحصیلی</label>
              <select
                name="grade"
                value={classData.grade}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">انتخاب پایه</option>
                <option value="هفتم">هفتم</option>
                <option value="هشتم">هشتم</option>
                <option value="نهم">نهم</option>
              </select>
            </div>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "در حال ثبت..." : "ثبت کلاس"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateClass;