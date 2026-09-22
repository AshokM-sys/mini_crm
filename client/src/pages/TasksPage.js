import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Lock as LockIcon } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [leadsList, setLeadsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchDropdownData = async () => {
    try {
      const [leadsRes, usersRes] = await Promise.all([
        api.get('/leads?limit=100'),
        api.get('/auth/users'),
      ]);
      setLeadsList(leadsRes.data.leads || []);
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Error loading dropdowns:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDropdownData();
  }, [fetchTasks]);

  const handleOpenAddDialog = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      lead: leadsList[0]?._id || '',
      assignedTo: user?._id || usersList[0]?._id || '',
      dueDate: todayStr,
      status: 'Pending',
    });
    setFormErrors({});
    setAddDialogOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.lead) errs.lead = 'Please select a lead';
    if (!formData.assignedTo) errs.assignedTo = 'Please assign to a user';
    if (!formData.dueDate) errs.dueDate = 'Due date is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await api.post('/tasks', formData);
      showSuccess('Task created successfully!');
      setAddDialogOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      showError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
      showSuccess(`Task marked as ${newStatus}!`);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      const msg =
        err.response?.data?.message ||
        'Forbidden: Only assigned user can update task status.';
      showError(msg);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1d4ed8' },
          }}
        >
          Add Task
        </Button>
      </Box>

      <Card sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No tasks found. Click "+ Add Task" to schedule one.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const isAssigned =
                    user &&
                    task.assignedTo &&
                    (task.assignedTo._id === user._id || task.assignedTo === user._id);

                  return (
                    <TableRow key={task._id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {task.title}
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>
                        {task.lead ? task.lead.name : 'Unknown'}
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>
                        {formatDate(task.dueDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor:
                              task.status === 'Completed' ? '#ecfdf5' : '#fffbeb',
                            color:
                              task.status === 'Completed' ? '#047857' : '#b45309',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {isAssigned ? (
                          <Button
                            size="small"
                            variant={task.status === 'Completed' ? 'outlined' : 'contained'}
                            color={task.status === 'Completed' ? 'inherit' : 'primary'}
                            onClick={() => handleToggleStatus(task)}
                            sx={{
                              fontSize: '0.8rem',
                              py: 0.3,
                              px: 1.5,
                              backgroundColor:
                                task.status === 'Completed' ? 'transparent' : '#2563eb',
                              '&:hover': {
                                backgroundColor:
                                  task.status === 'Completed'
                                    ? '#f1f5f9'
                                    : '#1d4ed8',
                              },
                            }}
                          >
                            {task.status === 'Completed' ? 'Reopen' : 'Done'}
                          </Button>
                        ) : (
                          <Tooltip title="Only assigned users can update task status">
                            <span>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled
                                startIcon={<LockIcon fontSize="inherit" />}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.3,
                                  px: 1,
                                  color: '#94a3b8',
                                  borderColor: '#e2e8f0',
                                }}
                              >
                                Done
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Task Modal */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Task</DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              placeholder="e.g. Call"
              size="small"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={Boolean(formErrors.title)}
              helperText={formErrors.title}
            />

            <TextField
              select
              label="Lead"
              size="small"
              fullWidth
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              error={Boolean(formErrors.lead)}
              helperText={formErrors.lead}
            >
              {leadsList.map((l) => (
                <MenuItem key={l._id} value={l._id}>
                  {l.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Assigned To"
              size="small"
              fullWidth
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              error={Boolean(formErrors.assignedTo)}
              helperText={formErrors.assignedTo}
            >
              {usersList.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name} {u._id === user?._id ? '(You)' : ''}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Due Date"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              error={Boolean(formErrors.dueDate)}
              helperText={formErrors.dueDate}
            />

            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ borderColor: '#cbd5e1' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            disabled={submitting}
            sx={{ backgroundColor: '#2563eb' }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksPage;
