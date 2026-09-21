import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const drawerWidth = 240;

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Top Bar */}
      <TopBar />

      {/* Main Page Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
