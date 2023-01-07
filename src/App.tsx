import React, {useMemo} from 'react';
import {createHashRouter, Link, RouterProvider} from 'react-router-dom';
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
import {Calculate} from '@mui/icons-material';
import IpCalc from './component/IpCalc';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <List>
        <ListItem>
          <ListItemButton component={Link} to='ip-calc'>
            <ListItemIcon>
              <Calculate/>
            </ListItemIcon>
            <ListItemText primary='IP Calc'/>
          </ListItemButton>
        </ListItem>
      </List>
    ),
  },
  {
    path: 'ip-calc',
    element: <IpCalc/>,
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
      <CssBaseline/>
      <RouterProvider router={router}/>
    </ThemeProvider>
  );
}

export default App;
