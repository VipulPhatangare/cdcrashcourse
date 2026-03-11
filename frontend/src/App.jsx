import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrashCourseLanding from './pages/CrashCourseLanding';
import CrashCourseRegister from './pages/CrashCourseRegister';
import StudentLogin from './pages/StudentLogin';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Events from './pages/Events';
import Materials from './pages/Materials';
import Support from './pages/Support';
import StudentProfile from './pages/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/crash-course" replace />} />
        <Route path="/crash-course" element={<CrashCourseLanding />} />
        <Route path="/crash-course/register" element={<CrashCourseRegister />} />
        <Route path="/crash-course/login" element={<StudentLogin />} />
        <Route path="/crash-course/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/crash-course/home" element={<Home />} />
        <Route path="/crash-course/events" element={<Events />} />
        <Route path="/crash-course/materials" element={<Materials />} />
        <Route path="/crash-course/support" element={<Support />} />
        <Route path="/crash-course/my-profile" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
