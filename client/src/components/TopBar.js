import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const drawerWidth = 240;

const TopBar = () => {
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
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#1e293b',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
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
            '&:hover': {
              backgroundColor: '#fee2e2',
              borderColor: '#f87171',
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
