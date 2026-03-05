import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // You could fetch current user data here
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="app-wrapper login-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <div className="app-wrapper dashboard-wrapper">
      <BrowserRouter>
        <Navbar onLogout={handleLogout} user={user} />
        <Routes>
          <Route path="/" element={<Dashboard token={token} />} />
          <Route path="/users" element={<Users token={token} />} />
          <Route path="/tasks" element={<Tasks token={token} />} />
          <Route path="/reports" element={<Reports token={token} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
