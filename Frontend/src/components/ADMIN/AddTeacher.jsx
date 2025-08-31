import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const base_url = process.env.REACT_APP_API_URL;

const AddTeacher = () => {
  const [teacherData, setTeacherData] = useState({
    first_name: "",
    last_name: "",
    national_code: "",
    password: "",
    role: "teacher",
    photo_path: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({ ...teacherData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${base_url}/register/teacher` , teacherData , { withCredentials: true });
      
      toast.success("معلم با موفقیت ثبت شد!", {
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
      
      setTeacherData({
        first_name: "",
        last_name: "",
        national_code: "",
        password: "",
        role: "teacher",
        photo_path: "",
      });
    } catch (err) {
      console.error("خطا در ثبت معلم: کد ملی تکراری", err);
      
      toast.error("خطا در ثبت معلم: کد ملی تکراری", {
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
      background: "#f5f5f5",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      padding: "40px 30px",
      width: "100%",
      maxWidth: "500px",
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "30px",
      color: "#2c3e50",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "600",
      marginBottom: "6px",
      color: "#34495e",
    },
    input: {
      padding: "12px 15px",
      border: "1px solid #dce1e6",
      borderRadius: "8px",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none",
      backgroundColor: "#f9f9f9",
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
      transition: "all 0.3s ease",
    },
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
          <h2 style={styles.header}>ثبت معلم جدید</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>نام</label>
              <input
                type="text"
                name="first_name"
                value={teacherData.first_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="مثال: علی"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>نام خانوادگی</label>
              <input
                type="text"
                name="last_name"
                value={teacherData.last_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="مثال: رضایی"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>کد ملی</label>
              <input
                type="text"
                name="national_code"
                value={teacherData.national_code}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="مثال: 0012345678"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>پسورد</label>
              <input
                type="password"
                name="password"
                value={teacherData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="پسورد معلم"
              />
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "در حال ثبت..." : "ثبت معلم"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;