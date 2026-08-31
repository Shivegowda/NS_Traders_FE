import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LoginForm } from './componants/Login/LoginForm';

// A simple home dashboard placeholder component
const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Welcome to the Dashboard!</h1>
      <p>You have successfully bypassed the login page.</p>
      <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
        Log Out
      </Link>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect empty root paths straight to login, or load a landing page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Render your Formik Login Page when visiting /login */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Secure or subsequent view target path */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all 404 Route redirecting back to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
