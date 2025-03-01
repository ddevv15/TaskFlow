import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import TaskManager from './pages/TaskManager';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute> } />
        <Route path="/task-manager" element={<PrivateRoute> <TaskManager /> </PrivateRoute>} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
