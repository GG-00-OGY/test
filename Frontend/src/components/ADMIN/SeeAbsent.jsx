import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const AbsencesList = () => {
  const [absences, setAbsences] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const base_url = process.env.REACT_APP_API_URL;
  // گرفتن داده‌ها از سرور
  useEffect(() => {
    axios
      .get(`${base_url}/dashbord/absences`, { withCredentials: true })
      .then((res) => setAbsences(res.data))
      .catch((err) => console.error("خطا در گرفتن داده‌ها:", err));
  }, []);

  const uniqueClasses = [...new Set(absences.map((item) => item.class_name))];

  // فیلتر و جستجو
  const filteredData = useMemo(() => {
    return absences.filter(({ student_name, class_name }) => {
      const matchesName = student_name.includes(searchName);
      const matchesClass = filterClass ? class_name === filterClass : true;
      return matchesName && matchesClass;
    });
  }, [searchName, filterClass, absences]);

  // تغییر وضعیت مجاز/غیرمجاز
  const toggleExcuse = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await axios.put(
        `${base_url}/update/attendance/${id}/excuse`,
        { is_excused: newStatus },
        { withCredentials: true }
      );

      setAbsences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_excused: newStatus } : item
        )
      );
    } catch (err) {
      console.error("خطا در تغییر وضعیت:", err);
    }
  };

  // تغییر وضعیت حضور
  const toggleStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${base_url}/update/attendance/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setAbsences((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("خطا در تغییر وضعیت حضور:", err);
    }
  };

  // استایل‌ها
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: 24,
      fontFamily: "'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      direction: "rtl",
      color: "#2c3e50",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      maxWidth: 1000,
      width: "100%",
      marginBottom: 24,
      color: "#1a73e8",
      textAlign: "center",
      fontWeight: "700",
      fontSize: 28,
      paddingBottom: 12,
      borderBottom: "2px solid #e0e0e0",
    },
    controls: {
      display: "flex",
      gap: 16,
      marginBottom: 24,
      maxWidth: 1000,
      width: "100%",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    input: {
      padding: "12px 16px",
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #e0e0e0",
      outline: "none",
      minWidth: 240,
      color: "#2c3e50",
      fontWeight: "500",
      backgroundColor: "#f8f9fa",
      transition: "all 0.3s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    select: {
      padding: "12px 16px",
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #e0e0e0",
      outline: "none",
      minWidth: 200,
      color: "#2c3e50",
      fontWeight: "500",
      cursor: "pointer",
      backgroundColor: "#f8f9fa",
      transition: "all 0.3s ease",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    tableWrapper: {
      maxWidth: 1000,
      width: "100%",
      overflowX: "auto",
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#1a73e8",
      padding: "16px 12px",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 16,
      color: "#ffffff",
      borderBottom: "1px solid #e0e0e0",
    },
    td: {
      padding: "14px 12px",
      textAlign: "center",
      borderBottom: "1px solid #e0e0e0",
      fontSize: 15,
      color: "#2c3e50",
    },
    statusAbsent: { color: "#d32f2f", fontWeight: "600" },
    statusPresent: { color: "#388e3c", fontWeight: "600" },
    statusExcused: { color: "#388e3c", fontWeight: "600" },
    statusNotExcused: { color: "orange", fontWeight: "600" },
    button: {
      padding: "8px 16px",
      fontSize: 14,
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      backgroundColor: "#1a73e8",
      color: "#fff",
      fontWeight: "600",
      transition: "all 0.3s ease",
      marginBottom: 4,
    },
    noData: {
      padding: 24,
      textAlign: "center",
      color: "#d32f2f",
      fontWeight: "600",
      fontSize: 16,
    },
    totalCount: {
      marginTop: 24,
      fontWeight: "600",
      fontSize: 16,
      color: "#1a73e8",
      backgroundColor: "#e8f0fe",
      padding: "10px 20px",
      borderRadius: 20,
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>لیست غایب‌ها</h1>

      {/* کنترل‌ها */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="جستجوی نام دانش‌آموز"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.input}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          style={styles.select}
        >
          <option value="">همه کلاس‌ها</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      {/* جدول */}
      <div style={styles.tableWrapper}>
        {filteredData.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>نام دانش‌آموز</th>
                <th style={styles.th}>کلاس</th>
                <th style={styles.th}>تاریخ</th>
                <th style={styles.th}>وضعیت</th>
                <th style={styles.th}>مجاز/غیرمجاز</th>
                <th style={styles.th}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(
                ({ id, student_name, class_name, date, status, is_excused }) => (
                  <tr key={id}>
                    <td style={styles.td}>{student_name}</td>
                    <td style={styles.td}>{class_name}</td>
                    <td style={styles.td}>{date}</td>
                    <td
                      style={{
                        ...styles.td,
                        ...(status === "absent" ? styles.statusAbsent : styles.statusPresent),
                      }}
                    >
                      {status === "present" ? "حاضر" : "غایب"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        ...(is_excused
                          ? styles.statusExcused
                          : styles.statusNotExcused),
                      }}
                    >
                      {is_excused ? "مجاز" : "غیرمجاز"}
                    </td>
                    <td style={styles.td}>
                      {/* تغییر وضعیت مجاز/غیرمجاز */}
                      <button
                        style={styles.button}
                        onClick={() => toggleExcuse(id, is_excused)}
                      >
                        {is_excused ? "غیرمجاز کن" : "مجاز کن"}
                      </button>

                      {/* تغییر وضعیت حضور */}
                      <select
                        value={status}
                        onChange={(e) => toggleStatus(id, e.target.value)}
                        style={{ ...styles.select, marginTop: 6 }}
                      >
                        <option value="present" style={{color:"green"}}>حاضر</option>
                        <option value="absent" style={{color:"red"}}>غایب</option>
                      </select>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <div style={styles.noData}>هیچ داده‌ای برای نمایش وجود ندارد.</div>
        )}
      </div>

      <div style={styles.totalCount}>
        تعداد کل غایب‌ها: {filteredData.length}
      </div>
    </div>
  );
};

export default AbsencesList;