import React, { useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import BackToTop from './components/BackToTop/index';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ConfirmEmailPage from './pages/auth/ConfirmEmailPage';
import FaceDetectImagePage from './pages/service/FaceDetectImagePage';
import FaceDetectRealtimePage from './pages/service/FaceDetectRealtimePage';
import FaceDetectImageMultiPeoplePage from './pages/service/FaceDetectImageMultiPeople';
import TensorflowPage from './pages/service/TensorflowPage';
import { MultiFaceDetectionImagePage } from './pages/service/MultiFaceDetectionImagePage';
import { RegisterFacePage } from './pages/auth/RegisterFacePage';

function App() {
  return(
    <div className="App">
      <Router>
        <Navbar />
        <BackToTop key={250} />
        <Routes>
          <Route path='*' element={<NotFound />} />

          <Route path="/" element={<Navigate to='/home' replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-face" element={<RegisterFacePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/face-detect-image" element={<FaceDetectImagePage />} />
          <Route path="/face-detect-realtime" element={<FaceDetectRealtimePage />} />
          <Route path="/face-detect-image-multipeople" element={<FaceDetectImageMultiPeoplePage />} />
          <Route path="/tensorflow" element={<TensorflowPage />} />
          <Route path='/multiface-detection-image' element={<MultiFaceDetectionImagePage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
