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
  TextField,
  MenuItem,
  Button,
  Chip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const statusColors = {
  New: { bg: '#eff6ff', color: '#1d4ed8' },
  Contacted: { bg: '#fffbeb', color: '#b45309' },
  Qualified: { bg: '#ecfdf5', color: '#047857' },
  Lost: { bg: '#fef2f2', color: '#b91c1c' },
};

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    assignedTo: '',
    company: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const { showSuccess, showError } = useNotification();

  const fetchDropdownData = async () => {
    try {
      const [usersRes, companiesRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/companies'),
      ]);
      setUsers(usersRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 5,
        search,
      };
      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter;
      }

      const res = await api.get('/leads', { params });
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error loading leads:', err);
      showError('Failed to fetch leads list');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, showError]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenAddDialog = () => {
    setEditingLeadId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'New',
      assignedTo: users[0]?._id || '',
      company: companies[0]?._id || '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (lead) => {
    setEditingLeadId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
      company: lead.company?._id || lead.company || '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.assignedTo) errs.assignedTo = 'Please select assigned user';
    if (!formData.company) errs.company = 'Please select company';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveLead = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingLeadId) {
        await api.put(`/leads/${editingLeadId}`, formData);
        showSuccess('Lead updated successfully!');
      } else {
        await api.post('/leads', formData);
        showSuccess('Lead created successfully!');
      }
      setDialogOpen(false);
      fetchLeads();
    } catch (err) {
      console.error('Error saving lead:', err);
      showError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePrompt = (lead) => {
    setLeadToDelete(lead);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      await api.delete(`/leads/${leadToDelete._id}`);
      showSuccess('Lead soft-deleted successfully (will not appear in normal queries)');
      setDeleteConfirmOpen(false);
      setLeadToDelete(null);
      fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
      showError('Failed to delete lead');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Leads
        </Typography>
      </Box>

      <Card sx={{ p: 2.5, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 220 }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              sx={{ width: 140 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </TextField>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: '#2563eb',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Add Lead
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
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
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No leads found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {lead.name}
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>{lead.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          backgroundColor: statusColors[lead.status]?.bg || '#f1f5f9',
                          color: statusColors[lead.status]?.color || '#475569',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>
                      {lead.assignedTo?.name || 'Unassigned'}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleOpenEditDialog(lead)}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 0.2,
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: '#eff6ff' },
                        }}
                      >
                        Edit
                      </Button>
                      <Typography component="span" sx={{ color: '#cbd5e1', mx: 0.5 }}>
                        |
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleDeletePrompt(lead)}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 0.2,
                          color: '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          '&:hover': { backgroundColor: '#fee2e2' },
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {editingLeadId ? 'Edit Lead' : 'Add / Edit Lead'}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              placeholder="e.g. Ravi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />

            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              placeholder="e.g. r@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />

            <TextField
              fullWidth
              size="small"
              label="Phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={Boolean(formErrors.phone)}
              helperText={formErrors.phone}
            />

            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Assigned To [ User Dropdown ]"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              error={Boolean(formErrors.assignedTo)}
              helperText={formErrors.assignedTo}
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Company [ Company Dropdown ]"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              error={Boolean(formErrors.company)}
              helperText={formErrors.company}
            >
              {companies.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name} - {c.location}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ borderColor: '#cbd5e1' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveLead}
            variant="contained"
            disabled={submitting}
            sx={{ backgroundColor: '#2563eb' }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Soft Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Are you sure you want to delete lead <strong>{leadToDelete?.name}</strong>?
            This will soft-delete the lead so it will not appear in normal queries.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsPage;
