import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router';
import SideMenu from './components/SideMenu';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  flexShrink: 0,
  width: drawerWidth,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleDrawerClose = () => {
    setClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!closing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar sx={{ display: { md: 'none' } }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          component="nav"
          variant="temporary"
          open={mobileOpen}
          keepMounted
          sx={{
            'display': { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
        >
          <SideMenu />
        </Drawer>
        <Drawer
          component="nav"
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          <SideMenu />
        </Drawer>
        <Box component="main" sx={{ p: 2, mt: { xs: 7, sm: 8, md: 0 }, width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
