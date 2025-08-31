import React from "react";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <p style={styles.heroSubtitle}>مدرسه  آرمان دانش</p>
        <p style={styles.heroSubtitle}>تعالی آموزشی در عصر دیجیتال</p>
      </div>

      <div style={styles.contentSection}>
        <div style={styles.aboutCard}>
          <h2 style={styles.sectionTitle}>درباره ما</h2>
          <p style={styles.aboutText}>
            آکادمی پیشرو با بیش از دو دهه تجربه در زمینه آموزش، مرکزی برای پرورش استعدادها و شکوفایی خلاقیت است. 
            ما با ترکیبی از روش‌های آموزشی نوین و امکانات پیشرفته، محیطی ایده‌آل برای یادگیری فراهم کرده‌ایم.
          </p>
        </div>

        <div style={styles.missionVision}>
          <div style={styles.missionCard}>
            <h3 style={styles.cardTitle}>ماموریت ما</h3>
            <p style={styles.cardText}>
              ارائه آموزش با کیفیت جهانی و پرورش نسل آینده‌سازان با مهارت‌های علمی، فنی و اجتماعی.
            </p>
          </div>

          <div style={styles.visionCard}>
            <h3 style={styles.cardTitle}>چشم انداز</h3>
            <p style={styles.cardText}>
              تبدیل شدن به مرجع برتر آموزشی در منطقه با استانداردهای بین‌المللی تا سال 1404.
            </p>
          </div>
        </div>

        <div style={styles.statsSection}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>7+</span>
            <span style={styles.statLabel}>سال تجربه</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>12+</span>
            <span style={styles.statLabel}>استاد برجسته</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>۱۰۰۰+</span>
            <span style={styles.statLabel}>دانش آموخته</span>
          </div>
        </div>
      </div>

      <div style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>تیم مدیریتی</h2>
        <div style={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} style={styles.teamMember}>
              <div style={styles.memberImage}></div>
              <h3 style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberPosition}>{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const teamMembers = [
  { name: "دکتر علی محمدی", position: "مدیر " },
  { name: "پروفسور مهدی حسینی", position: "معاون  " },
  { name: "مهندس رضا نوروزی", position: "معاون " },
  { name: "دکتر محمد امیری", position: "معاون پرورشی " },
];

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    lineHeight: "1.6",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  heroSection: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    color: "white",
    padding: "120px 20px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "300",
    marginBottom: "20px",
    marginRight:"auto",
    marginLeft:"150px",
    letterSpacing: "2px",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
    fontWeight: "300",
    opacity: "0.9",
  },
  contentSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 20px",
  },
  aboutCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    marginBottom: "60px",
    borderTop: "4px solid #3498db",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "300",
    color: "#1a1a2e",
    marginBottom: "30px",
    position: "relative",
    paddingBottom: "15px",
  },
  aboutText: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#555",
  },
  missionVision: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    marginBottom: "60px",
  },
  missionCard: {
    flex: "1",
    minWidth: "300px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    borderTop: "4px solid #2ecc71",
  },
  visionCard: {
    flex: "1",
    minWidth: "300px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    borderTop: "4px solid #e74c3c",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "300",
    color: "#1a1a2e",
    marginBottom: "20px",
  },
  cardText: {
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#555",
  },
  statsSection: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "60px",
  },
  statItem: {
    textAlign: "center",
    minWidth: "150px",
  },
  statNumber: {
    display: "block",
    fontSize: "2.5rem",
    fontWeight: "300",
    color: "#3498db",
    marginBottom: "10px",
  },
  statLabel: {
    fontSize: "1rem",
    color: "#777",
  },
  teamSection: {
    backgroundColor: "#1a1a2e",
    padding: "80px 20px",
    color: "white",
  },
  teamGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    padding: "20px",
  },
  teamMember: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "8px",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  memberImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    margin: "0 auto 20px",
    backgroundImage: "linear-gradient(45deg, #3498db, #2c3e50)",
  },
  memberName: {
    fontSize: "1.3rem",
    fontWeight: "300",
    marginBottom: "10px",
  },
  memberPosition: {
    fontSize: "0.9rem",
    color: "#bbb",
  },
  
  // Responsive styles
  "@media (max-width: 768px)": {
    heroTitle: {
      fontSize: "2.5rem",
    },
    heroSubtitle: {
      fontSize: "1.2rem",
    },
    missionVision: {
      flexDirection: "column",
    },
    sectionTitle: {
      fontSize: "1.8rem",
    },
  },
};

export default AboutUs;