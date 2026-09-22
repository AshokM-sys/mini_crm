import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as LeadsIcon,
  Business as CompaniesIcon,
  AssignmentTurnedIn as TasksIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Leads', icon: <LeadsIcon />, path: '/leads' },
  { text: 'Companies', icon: <CompaniesIcon />, path: '/companies' },
  { text: 'Tasks', icon: <TasksIcon />, path: '/tasks' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <div>
      <Toolbar sx={{ px: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          C
        </Box>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white', fontWeight: 700, letterSpacing: 0.5 }}>
          MINI CRM
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#1e293b' }} />
      <Box sx={{ overflow: 'auto', mt: 1.5 }}>
        <List>
          {menuItems.map((item) => {
            const isSelected =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (onClose) onClose();
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                    color: isSelected ? '#60a5fa' : '#94a3b8',
                    borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: isSelected
                        ? 'rgba(37, 99, 235, 0.3)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? '#60a5fa' : '#64748b',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="crm navigation"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRight: '1px solid #1e293b',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
