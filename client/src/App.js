import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import CompaniesPage from './pages/CompaniesPage';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes inside Persistent Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                </Route>
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
