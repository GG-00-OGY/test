import React, { useState, useEffect } from 'react';
import './LoginSchool.css';
import { Link } from 'react-router-dom';
// تصاویر نمونه برای اسلایدر
const sliderImages = [
  './images/1 (1).jpg',
  './images/1 (2).jpg',
  './images/1 (3).jpg',
];

function Homepage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // اسلایدر خودکار
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {/* نوار ناوبری سفید برجسته */}
      <nav className="navbars">
        <div className="nav-links">
          <Link to={"chart"}> چارت</Link>
          <Link to={"about"}>درباره ما</Link>
         
          <Link to={"contact"}>ارتباط با ما</Link>
        </div>
      </nav>

      {/* محتوای اصلی */}
      <div className="content-container">
        {/* بخش چپ - اسلایدر */}
        <div className="left-section">
          <div className="slider">
            <img 
              src={sliderImages[currentSlide]} 
              alt={`اسلاید ${currentSlide + 1}`} 
              className="slide"
            />
            <div className="slider-dots">
              {sliderImages.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* بخش راست - دکمه‌ها */}
        <div className="right-section">
          <h1>مدیریت مدرسه خود را ساده کنید</h1>
          <p className="description">
            سیستم جامع مدیریت مدرسه ما به معلمان، دانش‌آموزان و مدیران قدرت می‌دهد تا همکاری کنند، پیشرفت را پیگیری کنند و عملیات را بهینه‌سازی کنند.
          </p>


          <div className="buttons-container">
            <Link to="/loginS">
            <button className="auth-btn student">ورود به عنوان دانش‌آموز</button>
            </Link>
            <Link to="/login">
            <button className="auth-btn teacher">ورود به عنوان معلم</button>
            </Link>
            <Link to="/loginS2">
            <button className="auth-btn student">پیش ثبت نام دانش آموز</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;