import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Clean Royal Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#475569',
    },
    background: {
      default: '#f8fafc', // Ultra crisp background
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Deep slate for high contrast
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 700,
      color: '#0f172a',
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      color: '#0f172a',
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          padding: '6px 16px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#2563eb',
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f8fafc',
          color: '#475569',
          fontWeight: 600,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 16px',
        },
        body: {
          fontSize: '0.875rem',
          color: '#1e293b',
          borderBottom: '1px solid #f1f5f9',
          padding: '14px 16px',
        },
      },
    },
  },
});

export default theme;
