import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
// import MainPage from './pages/MainPage'; // MainPage가 있다고 가정
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL이 /login 이면 LoginPage를 보여줌 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* URL이 / 이면 MainPage를 보여줌 */}
        {/* <Route path="/" element={<MainPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
