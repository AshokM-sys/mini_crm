import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  People as TotalLeadsIcon,
  CheckCircle as QualifiedLeadsIcon,
  EventBusy as TasksDueTodayIcon,
  AssignmentTurnedIn as CompletedTasksIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    tasksDueToday: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Menu anchor state for the settings dropdown
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeCardTitle, setActiveCardTitle] = useState(null);

  const navigate = useNavigate();
  const { showError, showInfo } = useNotification();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      showError('Failed to load dashboard statistics from aggregation API.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleOpenMenu = (event, cardTitle) => {
    setMenuAnchor(event.currentTarget);
    setActiveCardTitle(cardTitle);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setActiveCardTitle(null);
  };

  const handleAction = (actionPath) => {
    handleCloseMenu();
    if (actionPath === 'refresh') {
      fetchStats();
      showInfo('Dashboard metrics refreshed');
    } else {
      navigate(actionPath);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <TotalLeadsIcon sx={{ fontSize: 28, color: '#2563eb' }} />,
      iconBg: '#eff6ff',
      textColor: '#0f172a',
      actions: [
        { label: 'View Leads List', path: '/leads' },
        { label: 'Refresh Count', path: 'refresh' },
      ],
    },
    {
      title: 'Qualified Leads',
      value: stats.qualifiedLeads,
      icon: <QualifiedLeadsIcon sx={{ fontSize: 28, color: '#16a34a' }} />,
      iconBg: '#f0fdf4',
      textColor: '#0f172a',
      actions: [
        { label: 'View Leads List', path: '/leads' },
        { label: 'Refresh Count', path: 'refresh' },
      ],
    },
    {
      title: 'Tasks Due Today',
      value: stats.tasksDueToday,
      icon: <TasksDueTodayIcon sx={{ fontSize: 28, color: '#ea580c' }} />,
      iconBg: '#fff7ed',
      textColor: '#0f172a',
      actions: [
        { label: 'View Tasks List', path: '/tasks' },
        { label: 'Refresh Count', path: 'refresh' },
      ],
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: <CompletedTasksIcon sx={{ fontSize: 28, color: '#7c3aed' }} />,
      iconBg: '#f5f3ff',
      textColor: '#0f172a',
      actions: [
        { label: 'View Tasks List', path: '/tasks' },
        { label: 'Refresh Count', path: 'refresh' },
      ],
    },
  ];

  const currentCard = statCards.find((c) => c.title === activeCardTitle);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time business performance from MongoDB aggregation APIs
          </Typography>
        </Box>
        <Tooltip title="Refresh all metrics">
          <IconButton
            onClick={fetchStats}
            sx={{
              bgcolor: '#0f172a',
              color: '#ffffff',
              '&:hover': { bgcolor: '#1e293b' },
              width: 36,
              height: 36,
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        /* Full width 4-column layout: xs=12, sm=6, md=3 */
        <Grid container spacing={2.5}>
          {statCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  {/* Top row: Label & Action Settings Dropdown */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>

                    {/* Setting Icon with Black Background & White Icon */}
                    <Tooltip title="Card Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, card.title)}
                        sx={{
                          backgroundColor: '#0f172a', // Solid Black/Dark Slate background
                          color: '#ffffff',            // Pure White icon
                          width: 30,
                          height: 30,
                          '&:hover': {
                            backgroundColor: '#334155',
                          },
                        }}
                      >
                        <SettingsIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Metric Value */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#64748b',
                        fontSize: '0.85rem',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: card.textColor,
                        mt: 0.8,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      [ {card.value} ]
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Shared Dropdown Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            mt: 0.5,
          },
        }}
      >
        <Box sx={{ px: 2, py: 0.8 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            {activeCardTitle}
          </Typography>
        </Box>
        {currentCard?.actions.map((act) => (
          <MenuItem
            key={act.label}
            onClick={() => handleAction(act.path)}
            sx={{ fontSize: '0.875rem', py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: '#2563eb' }}>
              {act.path === 'refresh' ? <RefreshIcon fontSize="small" /> : <ArrowForwardIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary={act.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DashboardPage;
