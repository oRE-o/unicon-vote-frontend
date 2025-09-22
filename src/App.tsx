import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL이 /login 이면 LoginPage를 보여줌 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/main" element={<MainPage />} />{" "}
        {/* MainPage 라우트 추가 */}
        {/* URL이 / 이면 MainPage를 보여줌 */}
        {/* <Route path="/" element={<MainPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
