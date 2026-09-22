import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Responsive Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

      {/* Responsive Top Bar */}
      <TopBar onDrawerToggle={handleDrawerToggle} />

      {/* Main Page Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          boxSizing: 'border-box',
          overflowX: 'hidden',
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
