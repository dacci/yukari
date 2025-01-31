import { useMemo } from 'react';
import {
  createTheme,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  useMediaQuery
} from '@mui/material';
import { createHashRouter, Link, RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Calculate, Dns } from '@mui/icons-material';
import DnsResolver from './components/DnsResolver';
import IpCalc from './components/IpCalc';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <List>
        <ListItem>
          <ListItemButton component={Link} to='dns-resolver'>
            <ListItemIcon>
              <Dns />
            </ListItemIcon>
            <ListItemText primary='DNS Resolver' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} to='ip-calc'>
            <ListItemIcon>
              <Calculate />
            </ListItemIcon>
            <ListItemText primary='IP Calc' />
          </ListItemButton>
        </ListItem>
      </List>
    ),
  },
  {
    path: 'dns-resolver',
    element: <DnsResolver />,
  },
  {
    path: 'ip-calc',
    element: <IpCalc />,
  },
]);

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
