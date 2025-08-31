import React from 'react';

const OrganizationalChart = () => {
  // داده‌های چارت از JSON
  const orgData = {
    manager: {
      name: "محمد رضایی",
      position: "مدیر مدرسه",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      deputies: [
        {
          name: "فاطمه محمدی",
          position: "معاون آموزشی",
          image: "https://randomuser.me/api/portraits/men/1.jpg",
          teachers: [
            {
              name: "مریم احمدی",
              position: "دبیر ریاضی",
              image: "https://randomuser.me/api/portraits/men/2.jpg"
            },
            {
              name: "رضا نوروزی",
              position: "دبیر علوم",
              image: "https://randomuser.me/api/portraits/men/2.jpg"
            }
          ]
        },
        {
          name: "علی کریمی",
          position: "معاون پرورشی",
          image: "https://randomuser.me/api/portraits/men/3.jpg",
          teachers: [
            {
              name: "سارا امینی",
              position: "مربی پرورشی",
              image: "https://randomuser.me/api/portraits/men/3.jpg"
            },
            {
              name: "امیرحسین صالحی",
              position: "مربی ورزش",
              image: "https://randomuser.me/api/portraits/men/4.jpg"
            }
          ]
        },
        {
          name: "زهرا حسینی",
          position: "معاون اجرایی",
          image: "https://randomuser.me/api/portraits/men/4.jpg",
          teachers: [
            {
              name: "لیلا موسوی",
              position: "دبیر ادبیات",
              image: "https://randomuser.me/api/portraits/men/5.jpg"
            },
            {
              name: "حسین اکبری",
              position: "دبیر زبان",
              image: "https://randomuser.me/api/portraits/men/5.jpg"
            }
          ]
        }
      ]
    }
  };

  // استایل‌ها
  const styles = {
    container: {
      fontFamily: "'Vazir', Arial, sans-serif",
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '3rem 1rem',
      direction: 'rtl'
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '800',
      color: '#111827',
      lineHeight: '1.2',
      '@media (max-width: 768px)': {
        fontSize: '1.8rem'
      }
    },
    chartContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2rem'
    },
    row: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '2rem',
      width: '100%'
    },
    node: {
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      position: 'relative',
      margin: '1rem',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    managerNode: {
      backgroundColor: '#eff6ff',
      borderColor: '#2563eb'
    },
    deputyNode: {
      backgroundColor: '#eef2ff',
      borderColor: '#4f46e5'
    },
    teacherNode: {
      backgroundColor: '#f1f5f9',
      borderColor: '#475569'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #fff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem'
    },
    nodeTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      color: '#1e293b'
    },
    nodePosition: {
      color: '#4b5563',
      marginBottom: '0.5rem'
    },
    connector: {
      position: 'absolute',
      width: '2px',
      backgroundColor: '#9ca3af',
      height: '2rem',
      bottom: '-2rem',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    horizontalConnector: {
      position: 'absolute',
      height: '2px',
      backgroundColor: '#9ca3af',
      width: '2rem',
      top: '50%',
      transform: 'translateY(-50%)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* هدر صفحه */}
        <div style={styles.header}>
          <h1 style={styles.title}>چارت سازمانی آموزشی</h1>
          <p style={{ ...styles.title, fontSize: '1.25rem', fontWeight: 'normal', color: '#6b7280' }}>
            ساختار مدیریتی و آموزشی مدرسه
          </p>
        </div>

        {/* چارت سازمانی */}
        <div style={styles.chartContainer}>
          {/* سطح 1: مدیر */}
          <div style={styles.row}>
            <div style={{ ...styles.node, ...styles.managerNode }}>
              <img src={orgData.manager.image} alt={orgData.manager.name} style={styles.avatar} />
              <div style={styles.nodeTitle}>{orgData.manager.name}</div>
              <div style={styles.nodePosition}>{orgData.manager.position}</div>
              <div style={styles.connector}></div>
            </div>
          </div>

          {/* سطح 2: معاونین */}
          <div style={styles.row}>
            {orgData.manager.deputies.map((deputy, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div style={{ ...styles.node, ...styles.deputyNode }}>
                  <img src={deputy.image} alt={deputy.name} style={styles.avatar} />
                  <div style={styles.nodeTitle}>{deputy.name}</div>
                  <div style={styles.nodePosition}>{deputy.position}</div>
                  <div style={styles.connector}></div>
                </div>
                {index !== orgData.manager.deputies.length - 1 && (
                  <div style={{ ...styles.horizontalConnector, right: '-2rem' }}></div>
                )}
              </div>
            ))}
          </div>

          {/* سطح 3: معلمان */}
          <div style={{ ...styles.row, justifyContent: 'space-around' }}>
            {orgData.manager.deputies.map((deputy, depIndex) => (
              <div key={`dep-${depIndex}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {deputy.teachers.map((teacher, teacherIndex) => (
                  <div key={`teacher-${depIndex}-${teacherIndex}`} style={{ margin: '1rem' }}>
                    <div style={{ ...styles.node, ...styles.teacherNode }}>
                      <img src={teacher.image} alt={teacher.name} style={styles.avatar} />
                      <div style={styles.nodeTitle}>{teacher.name}</div>
                      <div style={styles.nodePosition}>{teacher.position}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalChart;             