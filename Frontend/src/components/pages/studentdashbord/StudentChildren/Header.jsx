import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faBell, faBars } from '@fortawesome/free-solid-svg-icons';

const API_BASE = process.env.REACT_APP_API_URL;

const Header = ({ notifications = 0, setMobileMenuOpen }) => {
  const [userData, setUserData] = useState({
    name: '',
    lastName: '',
    grade: '',
    avatarPath: ''
  });
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.jpg');

  useEffect(() => {
    let cancelled = false;
    let currentObjectUrl = null;

    const getFilenameFromPath = (p) => {
      if (!p) return null;
      try {
        // اگر full URL است
        if (/^https?:\/\//i.test(p)) {
          const u = new URL(p);
          const parts = u.pathname.split('/');
          return parts.pop() || parts.pop(); // handle trailing slash
        }
        // مسیر نسبی یا فقط filename
        const parts = p.replace(/^\/+/, '').split('/');
        return parts.pop();
      } catch (e) {
        const parts = p.replace(/^\/+/, '').split('/');
        return parts.pop();
      }
    };

    const loadUserAndAvatar = async () => {
      try {
        // 1) گرفتن اطلاعات دانش‌آموز (با credentials)
        const res = await axios.get(`${API_BASE}/dashbord/student`, { withCredentials: true });
        const raw = res.data.student || res.data || {};

        const studentId = raw.id || raw.student_id || raw.studentId || raw.userId;
        const avatarField = raw.photo_path || raw.photo || raw.avatar || raw.avatar_path || raw.photo_filename || '';

        if (cancelled) return;

        setUserData({
          name: raw.first_name || raw.name || '',
          lastName: raw.last_name || raw.lastName || '',
          grade: raw.grade || '',
          avatarPath: avatarField || ''
        });

        // اگر عکس ثبت نشده، از پیش‌فرض استفاده کن
        if (!avatarField) {
          setAvatarUrl('/default-avatar.jpg');
          return;
        }

        // استخراج filename
        const filename = getFilenameFromPath(avatarField);
        if (!studentId || !filename) {
          // اگر نتونستیم studentId یا filename رو بگیریم، تلاش می‌کنیم اول به صورت مستقیم (public) لود کنیم
          const trimmed = avatarField.replace(/^\/+/, '');
          const directUrl = /^https?:\/\//i.test(avatarField) ? avatarField : `${API_BASE}/${trimmed}`;
          setAvatarUrl(directUrl);
          return;
        }

        // 2) ساخت آدرس خصوصی و دانلود blob (با credentials) — مطابق بک‌اند تو
        const privateUrl = `${API_BASE}/upload/private/photo/student/${studentId}/${filename}`;

        try {
          const imgRes = await axios.get(privateUrl, {
            responseType: 'blob',
            withCredentials: true,
            // timeout: 10000,
          });

          if (cancelled) return;

          const blob = imgRes.data;
          currentObjectUrl = URL.createObjectURL(blob);
          setAvatarUrl(currentObjectUrl);
        } catch (imgErr) {
          // اگر خطایی در دریافت blob پیش اومد، fallback: تلاش برای لود مستقیم (ممکنه public باشه)
          console.warn('خطا در دانلود عکس محافظت‌شده، تلاش برای لود مستقیم:', imgErr);
          const trimmed = avatarField.replace(/^\/+/, '');
          const directUrl = /^https?:\/\//i.test(avatarField) ? avatarField : `${API_BASE}/${trimmed}`;
          setAvatarUrl(directUrl);
        }
      } catch (err) {
        console.error('خطا در دریافت اطلاعات داشبورد:', err);
        setAvatarUrl('/default-avatar.jpg');
      }
    };

    loadUserAndAvatar();

    return () => {
      cancelled = true;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, []);

  const styles = {
    header: {
      background: 'linear-gradient(135deg, #006fd6ff 0%, #06b6d4 100%)',
      color: '#fff',
      padding: '0.8rem 1rem',
      boxShadow: '0 4px 14px rgba(2,6,23,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.25rem',
      fontWeight: '700'
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    notificationBadge: {
      position: 'relative',
      cursor: 'pointer',
      fontSize: '1.2rem'
    },
    badgeCount: {
      position: 'absolute',
      top: '-8px',
      left: '-8px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '700'
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer'
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.2)',
      objectFit: 'cover'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    },
    userName: {
      fontWeight: '700',
      fontSize: '0.95rem'
    },
    userGrade: {
      fontSize: '0.8rem',
      opacity: 0.95
    },
    mobileMenuButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'inherit',
      fontSize: '1.2rem',
      cursor: 'pointer'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo}>
          <FontAwesomeIcon icon={faSchool} />
          <span>مدرسه هوشمند</span>
        </div>

        <div style={styles.headerActions}>
          

          <div style={styles.userProfile} title={`${userData.name} ${userData.lastName}`}>
            <img
              src={avatarUrl}
              alt="پروفایل دانش‌آموز"
              style={styles.avatar}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-avatar.jpg';
              }}
            />
            <div style={styles.userInfo}>
              <span style={styles.userName}>{userData.name} {userData.lastName}</span>
              <span style={styles.userGrade}>{userData.grade}</span>
            </div>
          </div>

          <button style={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(true)} aria-label="menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
