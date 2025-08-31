// auth.js


export const authenticateTeacher = async (firstName, lastName, password) => {
  try {
    const { data } = await api.post('/auth/teacher/login', {
      firstName,
      lastName,
      password,
    });

  // Expected backend behavior: server sets HttpOnly cookie for session/JWT

    return {
      success: true,
      teacher: data?.teacher || null,
    };
  } catch (error) {
    const message = error?.response?.data?.message || 'اطلاعات وارد شده صحیح نیست';
    throw new Error(message);
  }
};

export const getTeacherDetails = async (teacherId) => {
  const { data } = await api.get(`/teachers/${teacherId}`);
  return data || null;
};

export const getAllTeachers = async () => {
  const { data } = await api.get('/teachers');
  return data || [];
};