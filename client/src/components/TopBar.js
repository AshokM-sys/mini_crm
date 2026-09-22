import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const drawerWidth = 240;

const TopBar = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { showInfo } = useNotification();

  const handleLogout = () => {
    logout();
    showInfo('Logged out successfully');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
        ml: { sm: `${drawerWidth}px`, xs: 0 },
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#1e293b',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side: Hamburger button + mobile title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 1.5, display: { sm: 'none' }, color: '#334155' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              fontSize: '1rem',
              letterSpacing: 0.5,
              display: { sm: 'none', xs: 'block' },
            }}
          >
            MINI CRM
          </Typography>
        </Box>

        {/* Right side: User avatar/name & Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user.name}
              </Typography>
            </Box>
          )}

          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<LogoutIcon fontSize="small" />}
            onClick={handleLogout}
            sx={{
              borderColor: '#fecaca',
              color: '#dc2626',
              px: { xs: 1, sm: 1.5 },
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#fee2e2',
                borderColor: '#f87171',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
