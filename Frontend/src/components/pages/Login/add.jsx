import React, { useState } from "react";
import axios from "axios";
const base_url = process.env.REACT_APP_API_URL;
export default function StudentRegister() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    elementary_school_name: "",
    sixth_grade_teacher_name: "",
    father_phone: "",
    mother_phone: "",
    home_phone: "",
    notes: "",
  });

  const [focusField, setFocusField] = useState("");
  const [hoverBtn, setHoverBtn] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${base_url}/pre/pre-register`,
        formData
      );
      console.log("ثبت موفق:", res.data);
      alert("ثبت‌نام موفقیت‌آمیز بود!");
    } catch (error) {
      console.error("خطا در ثبت:", error);
      alert("ثبت‌نام انجام نشد!");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      fontFamily: "Vazirmatn, sans-serif",
      padding: "30px",
      position: "relative",
    },
    card: {
      background: "rgba(0,0,0,0.85)",
      color: "white",
      borderRadius: "16px",
      padding: "40px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    },
    title: {
      fontSize: "1.8rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    formGrid: {
      display: "grid",
      gap: "15px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      color: "white",
      fontSize: "0.95rem",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 12px rgba(59,130,246,0.8)",
    },
    textarea: {
      minHeight: "80px",
      resize: "vertical",
    },
    button: {
      padding: "14px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(270deg, #3b82f6, #1e3a8a)",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    buttonHover: {
      transform: "scale(1.03)",
      boxShadow: "0 4px 20px rgba(59,130,246,0.6)",
    },
    buttonActive: {
      transform: "scale(0.97)",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>پیش ثبت دانش‌آموز</h2>
        <div style={styles.formGrid}>
          {[
            { name: "first_name", placeholder: "نام" },
            { name: "last_name", placeholder: "نام خانوادگی" },
            { name: "elementary_school_name", placeholder: "نام مدرسه ابتدایی" },
            { name: "sixth_grade_teacher_name", placeholder: "نام معلم پایه ششم" },
            { name: "father_phone", placeholder: "شماره تلفن پدر" },
            { name: "mother_phone", placeholder: "شماره تلفن مادر" },
            { name: "home_phone", placeholder: "شماره تلفن خانه" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type="text"
              placeholder={field.placeholder}
              style={{
                ...styles.input,
                ...(focusField === field.name ? styles.inputFocus : {}),
              }}
              value={formData[field.name]}
              onFocus={() => setFocusField(field.name)}
              onBlur={() => setFocusField("")}
              onChange={handleChange}
            />
          ))}

          <textarea
            name="notes"
            placeholder="یادداشت‌ها"
            style={{
              ...styles.input,
              ...styles.textarea,
              ...(focusField === "notes" ? styles.inputFocus : {}),
            }}
            value={formData.notes}
            onFocus={() => setFocusField("notes")}
            onBlur={() => setFocusField("")}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(hoverBtn ? styles.buttonHover : {}),
              ...(activeBtn ? styles.buttonActive : {}),
            }}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => {
              setHoverBtn(false);
              setActiveBtn(false);
            }}
            onMouseDown={() => setActiveBtn(true)}
            onMouseUp={() => setActiveBtn(false)}
          >
            ثبت دانش‌آموز
          </button>
        </div>
      </form>
    </div>
  );
}
