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
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const statusColors = {
  New: { bg: '#eff6ff', color: '#1d4ed8' },
  Contacted: { bg: '#fffbeb', color: '#b45309' },
  Qualified: { bg: '#ecfdf5', color: '#047857' },
  Lost: { bg: '#fef2f2', color: '#b91c1c' },
};

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      showError('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenAddDialog = () => {
    setFormData({ name: '', industry: '', location: '' });
    setFormErrors({});
    setAddDialogOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Company name is required';
    if (!formData.industry.trim()) errs.industry = 'Industry is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await api.post('/companies', formData);
      showSuccess('Company created successfully!');
      setAddDialogOpen(false);
      fetchCompanies();
    } catch (err) {
      console.error('Error creating company:', err);
      showError(err.response?.data?.message || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (companyId) => {
    setDetailDialogOpen(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/companies/${companyId}`);
      setSelectedCompanyData(res.data);
    } catch (err) {
      console.error('Error fetching company details:', err);
      showError('Failed to load company details');
      setDetailDialogOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Companies
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
          Add Company
        </Button>
      </Box>

      <Card sx={{ p: 2.5, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No companies found. Click "+ Add Company" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((comp) => (
                  <TableRow key={comp._id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {comp.name}
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>{comp.industry}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{comp.location}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleViewDetails(comp._id)}
                        sx={{
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#eff6ff' },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Company Modal */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Company</DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Company Name"
              placeholder="e.g. ABC Corp"
              size="small"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
            />
            <TextField
              label="Industry"
              placeholder="e.g. IT"
              size="small"
              fullWidth
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              error={Boolean(formErrors.industry)}
              helperText={formErrors.industry}
            />
            <TextField
              label="Location"
              placeholder="e.g. Chennai"
              size="small"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={Boolean(formErrors.location)}
              helperText={formErrors.location}
            />
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
            onClick={handleCreateCompany}
            variant="contained"
            disabled={submitting}
            sx={{ backgroundColor: '#2563eb' }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Company Detail</DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#f1f5f9' }}>
          {loadingDetails || !selectedCompanyData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      COMPANY NAME
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {selectedCompanyData.company.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      INDUSTRY
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#334155' }}>
                      {selectedCompanyData.company.industry}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      LOCATION
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#334155' }}>
                      {selectedCompanyData.company.location}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
                Associated Leads ({selectedCompanyData.leads.length})
              </Typography>

              {selectedCompanyData.leads.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', py: 2 }}>
                  No leads associated with this company yet.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Lead Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assigned To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCompanyData.leads.map((lead) => (
                        <TableRow key={lead._id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{lead.name}</TableCell>
                          <TableCell sx={{ color: '#475569' }}>{lead.email}</TableCell>
                          <TableCell sx={{ color: '#475569' }}>{lead.phone}</TableCell>
                          <TableCell>
                            <Chip
                              label={lead.status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                backgroundColor: statusColors[lead.status]?.bg || '#f1f5f9',
                                color: statusColors[lead.status]?.color || '#475569',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#475569' }}>
                            {lead.assignedTo?.name || 'Unassigned'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            variant="contained"
            sx={{ backgroundColor: '#2563eb' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompaniesPage;
