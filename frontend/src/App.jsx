import LandingPage from './Components/LandingPage/LandingPage';
import LandingPageLayout from './Layouts/LandingPageLayout/LandingPageLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatWithPDF from './Components/ChatWithPDF/ChatWithPDF';
import Dashboard from './Components/Dashboard/Dashboard';
import NotelogComponent from './Components/Notelog/NotelogComponent';
import SignupForm from './Components/SignUpForm/SignupForm';
import SignInForm from './Components/SignInForm/SigninForm';

// Blocks access if no token — redirects to /signin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<LandingPageLayout />}>
          <Route path='/' element={<LandingPage />} />
        </Route>

        <Route path='/chat-with-pdf' element={<ChatWithPDF />} />

        {/* Protected routes — must be signed in */}
        <Route path='/dashboard' element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path='/notelog' element={
          <ProtectedRoute><NotelogComponent /></ProtectedRoute>
        } />

        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;