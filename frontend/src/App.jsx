import LandingPage from './Components/LandingPage/LandingPage';
import LandingPageLayout from './Layouts/LandingPageLayout/LandingPageLayout';
import {  Routes, Route } from 'react-router-dom';
import ChatWithPDF from './Components/ChatWithPDF/ChatWithPDF';
import Dashboard from './Components/Dashboard/Dashboard';
import NotelogComponent from './Components/Notelog/NotelogComponent';
import SignupForm from './Components/SignUpForm/SignupForm';
import SignInForm from './Components/SignInForm/SigninForm';

const App = () => {
  return (
    <>

      <Routes>
        <Route element={<LandingPageLayout />}>
          <Route path='/' element={<LandingPage />} />
        </Route>

        <Route path='/chat-with-pdf' element={<ChatWithPDF />} />
        <Route path='/dashboard' element={<Dashboard />} />

        <Route path='/notelog' element={<NotelogComponent />}/>
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />

      </Routes>
    </>
  );
};

export default App;