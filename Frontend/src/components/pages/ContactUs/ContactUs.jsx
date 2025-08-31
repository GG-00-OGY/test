import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faUserTie,
  faChalkboardTeacher,
  faSchool
} from '@fortawesome/free-solid-svg-icons';

const SchoolContactPage = () => {
  // اطلاعات مدرسه
  const schoolInfo = {
    name: "دبیرستان نمونه آرمان دانش",
    address: " اصفهان خمینی شهر خیابان مرکزی نرسیده به 3راه",
    phone: "031-12345678",
    mobile: "09123456789",
   
    principal: "جناب آقای دکتر محمدی",
    
  };

  // ساعات کاری مدرسه
  const workingHours = [
    { day: "شنبه تا چهارشنبه", time: "7:30 صبح تا 14:30 بعدازظهر" },
    { day: "پنجشنبه", time: "تعطیل" },
    { day: "جمعه", time: "تعطیل" }
  ];

  // بخش‌های مدرسه
  const schoolSections = [
    {
      title: "دفتر مدیریت",
      contact: "داخلی ۱۰۱",
      icon: faUserTie,
      description: "ارتباط با مدیریت مدرسه"
    },
    {
      title: "معاونت آموزشی",
      contact: "داخلی ۱۰۲",
      icon: faChalkboardTeacher,
      description: "مسائل مربوط به آموزش و برنامه‌ریزی درسی"
    },
    {
      title: "امور دفتری",
      contact: "داخلی ۱۰۳",
      icon: faSchool,
      description: "ثبت نام و امور اداری دانش آموزان"
    }
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: 'Vazir, Tahoma, sans-serif',
      direction: 'rtl',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(0,0,0,0.1)'
    }}>
      {/* هدر صفحه */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2.2rem',
          marginBottom: '10px'
        }}>
          <FontAwesomeIcon icon={faSchool} style={{ marginLeft: '10px' }} />
          ارتباط با {schoolInfo.name}
        </h1>
        <p style={{
          color: '#555',
          fontSize: '1.1rem'
        }}>
          راه‌های ارتباطی با مدرسه و مسئولین مربوطه
        </p>
      </div>

      {/* اطلاعات اصلی مدرسه */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '1.5rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginLeft: '10px', color: '#e74c3c' }} />
            آدرس مدرسه
          </h2>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            {schoolInfo.address}
          </p>
          
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '1.5rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon icon={faPhone} style={{ marginLeft: '10px', color: '#3498db' }} />
            تلفن‌های تماس
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <span style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '10px'
              }}>
                <FontAwesomeIcon icon={faPhone} style={{ color: '#3498db' }} />
              </span>
              تلفن مدرسه: {schoolInfo.phone}
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <span style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '10px'
              }}>
                <FontAwesomeIcon icon={faPhone} style={{ color: '#3498db' }} />
              </span>
              تلفن همراه: {schoolInfo.mobile}
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              
             
            </li>
          </ul>
        </div>
      </div>

      {/* بخش‌های مدرسه */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{
          color: '#2c3e50',
          fontSize: '1.8rem',
          marginBottom: '25px',
          paddingRight: '15px',
          borderRight: '4px solid #3498db'
        }}>
          ارتباط با بخش‌های مختلف مدرسه
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {schoolSections.map((section, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <FontAwesomeIcon 
                  icon={section.icon} 
                  style={{ 
                    fontSize: '24px', 
                    color: '#3498db',
                    marginLeft: '15px'
                  }} 
                />
                <h3 style={{
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '1.3rem'
                }}>{section.title}</h3>
              </div>
              <p style={{ color: '#555', marginBottom: '15px' }}>{section.description}</p>
              <p style={{ 
                color: '#e74c3c',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
               
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ساعات کاری و اطلاعات مدیریت */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '1.5rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon icon={faClock} style={{ marginLeft: '10px', color: '#f39c12' }} />
            ساعات کاری مدرسه
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {workingHours.map((item, index) => (
              <li key={index} style={{
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#555' }}>{item.day}</span>
                <span style={{ fontWeight: 'bold' }}>{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '1.5rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon icon={faUserTie} style={{ marginLeft: '10px', color: '#2ecc71' }} />
            کادر مدیریت مدرسه
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#3498db', marginBottom: '5px' }}>مدیر مدرسه:</h3>
            <p style={{ color: '#555' }}>{schoolInfo.principal}</p>
          </div>
          <div>
            <h3 style={{ color: '#3498db', marginBottom: '5px' }}>معاون آموزشی:</h3>
            <p style={{ color: '#555' }}>{schoolInfo.vicePrincipal}</p>
          </div>
        </div>
      </div>

      {/* نکات مهم */}
      <div style={{
        backgroundColor: '#e8f4fc',
        borderRadius: '8px',
        padding: '20px',
        borderRight: '4px solid #3498db'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>نکات مهم:</h3>
        <ul style={{ color: '#555', paddingRight: '20px' }}>
          <li style={{ marginBottom: '10px' }}>برای ملاقات با مدیریت حتماً از قبل هماهنگ نمایید.</li>
          <li style={{ marginBottom: '10px' }}>ساعات پاسخگویی تلفنی: روزهای شنبه تا چهارشنبه از ساعت 8 تا 12</li>
          <li>پاسخ به پیام ها حداکثر طی 24 ساعت کاری انجام می‌شود.</li>
        </ul>
      </div>
      <link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
  integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" 
  crossorigin="anonymous" 
  referrerpolicy="no-referrer" 
/>
    </div>
  );
};
const styles = {
    // ... سایر استایل‌ها
    formDescription: {
      fontSize: "1rem",
      color: "#555",
      marginBottom: "20px",
      textAlign: "center",
    }
  };

  
export default SchoolContactPage;