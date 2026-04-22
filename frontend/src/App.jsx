import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import VotePage from "./pages/VotePage";
import SubmitPage from "./pages/SubmitPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;