import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as TotalLeadsIcon,
  CheckCircle as QualifiedLeadsIcon,
  EventBusy as TasksDueTodayIcon,
  AssignmentTurnedIn as CompletedTasksIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
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
  const { showError } = useNotification();

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

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: <TotalLeadsIcon sx={{ fontSize: 32, color: '#2563eb' }} />,
      iconBg: '#eff6ff',
      textColor: '#1e293b',
    },
    {
      title: 'Qualified Leads',
      value: stats.qualifiedLeads,
      icon: <QualifiedLeadsIcon sx={{ fontSize: 32, color: '#16a34a' }} />,
      iconBg: '#f0fdf4',
      textColor: '#1e293b',
    },
    {
      title: 'Tasks Due Today',
      value: stats.tasksDueToday,
      icon: <TasksDueTodayIcon sx={{ fontSize: 32, color: '#ea580c' }} />,
      iconBg: '#fff7ed',
      textColor: '#1e293b',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: <CompletedTasksIcon sx={{ fontSize: 32, color: '#7c3aed' }} />,
      iconBg: '#f5f3ff',
      textColor: '#1e293b',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Title matching Wireframe 3 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Real-time aggregation metrics
          </Typography>
        </Box>
        <Tooltip title="Refresh metrics">
          <IconButton onClick={fetchStats} color="primary" size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        /* Full-width 4 cards layout across 100% of body width */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            width: '100%',
          }}
        >
          {statCards.map((card) => (
            <Card
              key={card.title}
              sx={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                },
              }}
            >
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#64748b',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: card.textColor,
                        mt: 1.5,
                      }}
                    >
                      [ {card.value} ]
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
