import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash,
  faEnvelope,
  faPhone,
  faUserPlus,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const base_url = process.env.REACT_APP_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('رمز عبور و تایید آن یکسان نیستند');
      }
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      await api.post('/auth/register', payload);
      setSuccess(true);
      // Redirect to login after short delay
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'خطا در ثبت نام';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">ثبت نام در سیستم</h1>
          <p className="register-subtitle">لطفاً اطلاعات خود را وارد نمایید</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* نام و نام خانوادگی */}
          <div className="name-row">
            <div className="input-group name-input">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="نام"
                className="form-input"
                required
              />
              <FontAwesomeIcon 
                icon={faUser} 
                className="input-icon"
              />
            </div>
            <div className="input-group name-input">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="نام خانوادگی"
                className="form-input"
                required
              />
              <FontAwesomeIcon 
                icon={faUser} 
                className="input-icon"
              />
            </div>
          </div>

          {/* ایمیل */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ایمیل"
              className="form-input"
              required
            />
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="input-icon"
            />
          </div>

          {/* شماره تلفن */}
          <div className="input-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="شماره تلفن"
              className="form-input"
              required
            />
            <FontAwesomeIcon 
              icon={faPhone} 
              className="input-icon"
            />
          </div>

          {/* رمز عبور */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="رمز عبور"
              className="form-input"
              required
            />
            <FontAwesomeIcon 
              icon={faLock} 
              className="input-icon"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              title={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            >
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
              />
            </button>
          </div>

          {/* تکرار رمز عبور */}
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="تکرار رمز عبور"
              className="form-input"
              required
            />
            <FontAwesomeIcon 
              icon={faLock} 
              className="input-icon"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="password-toggle"
              title={showConfirmPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            >
              <FontAwesomeIcon 
                icon={showConfirmPassword ? faEyeSlash : faEye} 
              />
            </button>
          </div>

          {/* دکمه ثبت نام */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                در حال ثبت نام...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} />
                ثبت نام
              </>
            )}
          </button>
        </form>
        {error && <div className="register-error" style={{color:'#b91c1c', marginTop: '10px'}}>{error}</div>}
        {success && <div className="register-success" style={{color:'#16a34a', marginTop: '10px'}}>ثبت نام با موفقیت انجام شد</div>}

        <div className="login-link">
          <span>قبلاً ثبت نام کرده‌اید؟</span>
          <Link to="/login" className="login-link-button">
            ورود به سیستم
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 