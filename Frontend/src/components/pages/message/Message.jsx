import React, { useState, useEffect } from 'react';
import {
  FaBullhorn,
  FaPaperPlane,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaUserGraduate,
  FaTrashAlt,
  FaEdit,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import TeacherLayout from '../../Layout/TeacherLayout';
import axios from 'axios';

const base_url = process.env.REACT_APP_API_URL;

const TeacherAnnouncementSystem = ({ senderId = 1, senderRole = "teacher" }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [apiError, setApiError] = useState(null);

  const colors = {
    primary: '#4361ee',
    secondary: '#3f37c9',
    accent: '#4895ef',
    dark: '#1b263b',
    light: '#f8f9fa',
    white: '#ffffff',
    gray: '#6c757d',
    lightGray: '#e9ecef',
    warning: '#faa307',
    danger: '#ef233c',
    success: '#4cc9f0'
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: "'Vazir', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: colors.dark,
      display: 'flex',
      flexDirection: 'column'
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
      marginBottom: '32px' 
    },
    titleContainer: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px' 
    },
    title: { 
      fontSize: '2rem', 
      fontWeight: '800', 
      margin: 0, 
      color: colors.dark 
    },
    subtitle: { 
      fontSize: '1rem', 
      color: colors.gray, 
      marginTop: '8px' 
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '28px',
      marginBottom: '32px',
      border: `1px solid ${colors.lightGray}`
    },
    formGroup: { 
      display: 'flex', 
      flexDirection: 'column', 
      marginBottom: '16px' 
    },
    formLabel: { 
      fontWeight: '600', 
      marginBottom: '8px' 
    },
    formInput: { 
      padding: '12px', 
      borderRadius: '10px', 
      border: `1px solid ${colors.lightGray}`, 
      fontSize: '1rem' 
    },
    formTextarea: { 
      padding: '12px', 
      borderRadius: '10px', 
      border: `1px solid ${colors.lightGray}`, 
      minHeight: '150px', 
      fontSize: '1rem', 
      resize: 'vertical' 
    },
    formActions: { 
      display: 'flex', 
      gap: '16px', 
      justifyContent: 'flex-end' 
    },
    primaryButton: { 
      backgroundColor: colors.primary, 
      color: colors.white, 
      padding: '12px 24px', 
      borderRadius: '10px', 
      border: 'none', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryButton: { 
      backgroundColor: 'transparent', 
      color: colors.primary, 
      border: `1px solid ${colors.primary}`, 
      padding: '12px 24px', 
      borderRadius: '10px', 
      cursor: 'pointer' 
    },
    announcementsContainer: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px' 
    },
    announcementsHeader: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '16px' 
    },
    searchContainer: { 
      position: 'relative', 
      width: '300px' 
    },
    searchInput: { 
      padding: '10px 12px 10px 36px', 
      borderRadius: '8px', 
      border: `1px solid ${colors.lightGray}`, 
      width: '100%' 
    },
    searchIcon: { 
      position: 'absolute', 
      left: '10px', 
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: colors.gray 
    },
    clearSearch: { 
      position: 'absolute', 
      right: '10px', 
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: colors.gray, 
      cursor: 'pointer' 
    },
    announcementsList: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px' 
    },
    announcementItem: { 
      backgroundColor: colors.white, 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)', 
      border: `1px solid ${colors.lightGray}` 
    },
    announcementHeader: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '12px' 
    },
    announcementTitle: { 
      fontWeight: '700', 
      fontSize: '1.2rem', 
      color: colors.dark 
    },
    announcementDate: { 
      color: colors.gray, 
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    announcementContent: { 
      lineHeight: '1.6', 
      whiteSpace: 'pre-line', 
      marginBottom: '12px', 
      color: colors.dark 
    },
    announcementFooter: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    },
    announcementStats: {
      display: 'flex',
      gap: '16px'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: colors.gray,
      fontSize: '0.9rem'
    },
    announcementActions: { 
      display: 'flex', 
      gap: '8px' 
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    editButton: { 
      color: colors.warning, 
      border: `1px solid ${colors.warning}`, 
      backgroundColor: 'transparent'
    },
    deleteButton: { 
      color: colors.danger, 
      border: `1px solid ${colors.danger}`, 
      backgroundColor: 'transparent'
    },
    loadingText: {
      textAlign: 'center',
      color: colors.gray,
      padding: '20px'
    },
    errorText: {
      textAlign: 'center',
      color: colors.danger,
      padding: '20px'
    }
  };

  // دریافت کلاس‌ها
  const fetchClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const { data } = await axios.get(`${base_url}/dashbord/all-class`, { 
        withCredentials: true 
      });
      
      // توجه: پاسخ API دارای ساختار { success: true, data: [...] } است
      if (data.success && Array.isArray(data.data)) {
        setClasses(data.data);
      } else {
        console.error('ساختار داده کلاس‌ها نامعتبر است:', data);
        setApiError('ساختار داده کلاس‌ها نامعتبر است');
      }
    } catch (error) {
      console.error('خطا در دریافت کلاس‌ها', error);
      setApiError('خطا در دریافت کلاس‌ها');
    } finally {
      setIsLoadingClasses(false);
    }
  };

  // دریافت اطلاعیه‌ها
  const fetchAnnouncements = async () => {
    try {
      setIsLoadingAnnouncements(true);
      const { data } = await axios.get(`${base_url}/dashbord/teacher/notifications/`, { 
        withCredentials: true 
      });
      
      // اگر ساختار اطلاعیه‌ها هم مشابه است، باید data.data را استفاده کنیم
      // اگر نه، مستقیماً از data استفاده می‌کنیم
      const announcementsData = data.success && Array.isArray(data.data) ? data.data : data;
      setAnnouncements(announcementsData);
      setFilteredAnnouncements(announcementsData);
    } catch (error) {
      console.error('خطا در دریافت اطلاعیه‌ها', error);
      setApiError('خطا در دریافت اطلاعیه‌ها');
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(
        announcements.filter(a =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, announcements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message || !selectedClass) {
      alert('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        const payload = {
          title,
          message,
          class_id: parseInt(selectedClass),
          sender_id: senderId,
          sender_role: senderRole,
          is_active: 1
        };
        await axios.put(`${base_url}/api/notifications/${currentEditId}`, payload, { 
          withCredentials: true 
        });
        setAnnouncements(announcements.map(a => a.id === currentEditId ? { ...a, ...payload } : a));
        setIsEditing(false);
        setCurrentEditId(null);
      } else {
        const payload = {
          title,
          message,
          class_id: parseInt(selectedClass),
          sender_id: senderId,
          sender_role: senderRole,
          is_active: 1
        };
        const { data } = await axios.post(`${base_url}/send/notifications`, payload, { 
          withCredentials: true 
        });
        const newAnn = {
          id: data.id || Date.now(),
          ...payload,
          created_at: data.created_at || new Date().toLocaleString('fa-IR'),
          views: 0,
          confirmed: 0
        };
        setAnnouncements([newAnn, ...announcements]);
      }

      setTitle('');
      setMessage('');
      setSelectedClass('');
    } catch (error) {
      console.error('خطا در ثبت اطلاعیه', error);
      alert('خطا در ثبت اطلاعیه. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (id) => {
    const ann = announcements.find(a => a.id === id);
    if (ann) {
      setTitle(ann.title);
      setMessage(ann.message);
      setSelectedClass(ann.class_id.toString());
      setIsEditing(true);
      setCurrentEditId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این اطلاعیه اطمینان دارید؟')) return;
    try {
      await axios.delete(`${base_url}/delete/notification/${id}`, { 
        withCredentials: true 
      });
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      console.error('خطا در حذف اطلاعیه', error);
      alert('خطا در حذف اطلاعیه. لطفاً دوباره تلاش کنید.');
    }
  };

  const getClassName = (id) => {
    const foundClass = classes.find(c => c.id === id);
    return foundClass ? foundClass.class_name : 'کلاس ناشناخته';
  };

  const clearSearch = () => setSearchTerm('');

  const cancelEdit = () => {
    setTitle('');
    setMessage('');
    setSelectedClass('');
    setIsEditing(false);
    setCurrentEditId(null);
  };

  return (
    <TeacherLayout>
      <div style={styles.container}>
        {/* نمایش خطا در صورت وجود */}
        {apiError && (
          <div style={{...styles.card, borderColor: colors.danger}}>
            <div style={{color: colors.danger, textAlign: 'center'}}>
              {apiError}
              <button 
                onClick={() => setApiError(null)}
                style={{marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer'}}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* فرم اطلاعیه */}
        <div style={styles.card}>
          <h2>{isEditing ? 'ویرایش اطلاعیه' : 'اطلاعیه جدید'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>عنوان</label>
              <input
                style={styles.formInput}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="عنوان اطلاعیه را وارد کنید"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>کلاس</label>
              <select
                style={styles.formInput}
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                disabled={isLoadingClasses}
              >
                <option value="">انتخاب کلاس</option>
                {isLoadingClasses ? (
                  <option value="" disabled>در حال دریافت کلاس‌ها...</option>
                ) : (
                  Array.isArray(classes) && classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.class_name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>متن اطلاعیه</label>
              <textarea
                style={styles.formTextarea}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="متن اطلاعیه را وارد کنید"
              />
            </div>
            
            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={cancelEdit}
                disabled={isSaving}
              >
                انصراف
              </button>
              <button 
                type="submit" 
                style={styles.primaryButton} 
                disabled={isSaving || isLoadingClasses}
              >
                {isSaving ? (
                  <>در حال ذخیره...</>
                ) : (
                  <>
                    <FaPaperPlane /> {isEditing ? 'ذخیره تغییرات' : 'ارسال اطلاعیه'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* جستجو */}
        <div style={styles.announcementsHeader}>
          <h3>لیست اطلاعیه‌ها ({filteredAnnouncements.length})</h3>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              style={styles.searchInput}
              placeholder="جستجو در اطلاعیه‌ها..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FaTimes style={styles.clearSearch} onClick={clearSearch} />
            )}
          </div>
        </div>

        {/* لیست اطلاعیه‌ها */}
        <div style={styles.announcementsContainer}>
          {isLoadingAnnouncements ? (
            <div style={styles.loadingText}>در حال دریافت اطلاعیه‌ها...</div>
          ) : filteredAnnouncements.length === 0 ? (
            <div style={styles.loadingText}>
              {searchTerm ? 'هیچ اطلاعیه‌ای با این جستجو یافت نشد' : 'هیچ اطلاعیه‌ای وجود ندارد'}
            </div>
          ) : (
            <div style={styles.announcementsList}>
              {filteredAnnouncements.map(ann => (
                <div key={ann.id} style={styles.announcementItem}>
                  <div style={styles.announcementHeader}>
                    <h3 style={styles.announcementTitle}>{ann.title}</h3>
                    <div style={styles.announcementDate}>
                      <FaClock /> {new Date(ann.created_at).toLocaleString('fa-IR')}
                    </div>
                  </div>
                  
                  <div style={styles.announcementContent}>{ann.message}</div>
                  
                  <div style={styles.announcementFooter}>
                    <div style={styles.announcementStats}>
                      <div style={styles.statItem}>
                        <FaUserGraduate /> {getClassName(ann.class_id)}
                      </div>
                     
                      
                    </div>
                    
                    <div style={styles.announcementActions}>
                     
                      <button 
                        style={{ ...styles.actionButton, ...styles.deleteButton }} 
                        onClick={() => handleDelete(ann.id)}
                      >
                        <FaTrashAlt /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherAnnouncementSystem;