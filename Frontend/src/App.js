import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSchool from './components/pages/first page/LoginSchool';
import TeacherLayout from './components/Layout/TeacherLayout';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import MyClasses from './components/pages/MyClasses/MyClasses';
import TeacherAnnouncementsystem from './components/pages/message/Message';
import AttendancePage from './components/pages/Attendance/AttendancePage';
import WeeklySchedule from './components/pages/WeeklySculdent/WeeklySculdent';
import TeacherDashboard from './components/pages/pishkhan/Pishkhan';
import StudentDashboard from './components/pages/studentdashbord/Studentdashboard';
import SchoolContactPage from './components/pages/ContactUs/ContactUs';
import AboutUs from './components/pages/aboutus/aboutus';

import OrganizationalChart from './components/pages/chart/chart';
import AdminLayout from './components/ADMIN/a/AdminLayout';
import AddStudent from './components/ADMIN/AddStudent';
import AddTeacher from './components/ADMIN/AddTeacher';
import ClassLists from './components/ADMIN/ClassList';
import CreateClass from './components/ADMIN/CreateClass';
import CreateTrip from './components/ADMIN/CreateTrip';
import DebtReport from './components/ADMIN/DebtReport';
import PreRegistration from './components/ADMIN/PreRegistration';
import TeacherStudentInfo from './components/ADMIN/TeacherStudentInfo';
import LoginS from './components/pages/Login/add';
import StudentRegisterAdvanced from './components/pages/Login/add';
import AbsencesList from './components/ADMIN/SeeAbsent';
import AddAdvancedClassForm from './components/ADMIN/AddExtraClasses';
import PreRegisterLogin from './components/pages/Login/StudentLogin';
import LoginPage from './components/pages/Login/Login';
import LoginPageA from './components/pages/Login/AdminLogin';
import PremiumLoginPage from './components/pages/Login/AdminLogin';
import WeeklyScheduleAdmin from './components/ADMIN/WeeklySchuldentEditor';
import NotFoundPage from './components/NotFound';
import StudentGuard from './components/pages/StudentGuard'
import WeeklyScheduleManager from './components/ADMIN/WeeklySchuldentTeacher';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginSchool />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<SchoolContactPage />} />
        
        <Route path="/chart" element={<OrganizationalChart />} />
        <Route path="/loginS" element={<PreRegisterLogin />} />
        <Route path="/loginS2" element={<StudentRegisterAdvanced />} />
        {/* Teacher Routes */}
          <Route path='/teacher' element={<TeacherLayout />} />
          <Route path='/pishkhan' element={<TeacherDashboard />} />
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/my-classes" element={<MyClasses />} />
          <Route path="/message" element={<TeacherAnnouncementsystem />} />
          <Route path="/attendance/:classId" element={<AttendancePage />} />
          <Route path="/schedule" element={<WeeklySchedule />} />
       
        
        {/* Student Routes */}
          <Route
            path="/student"
            element={
              <StudentGuard>
                <StudentDashboard />
              </StudentGuard>
            }
          >
          </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<TeacherStudentInfo />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="create-class" element={<CreateClass />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="class-list" element={<ClassLists />} />
          <Route path="student-debts" element={<DebtReport />} />
          <Route path="pre-registrations" element={<PreRegistration />} />
          <Route path="teacher-student-info" element={<TeacherStudentInfo />} />
          <Route path="view-absences" element={<AbsencesList />} />
          <Route path="add-extra-class" element={<AddAdvancedClassForm />} />
          <Route path="EditWeeklySchuldent" element={<WeeklyScheduleAdmin />} />
          <Route path="WeeklySchuldentTeacher" element={<WeeklyScheduleManager/>} />
          
        </Route>
          <Route path="/AdminLogin" element={<PremiumLoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;