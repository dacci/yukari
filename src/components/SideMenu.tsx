import CalculateIcon from '@mui/icons-material/Calculate';
import DnsIcon from '@mui/icons-material/Dns';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { type ReactNode } from 'react';
import { Link, matchPath, useLocation } from 'react-router';

interface MenuItem {
  readonly path: string;
  readonly title: string;
  readonly icon: ReactNode;
}

const mainContents: MenuItem[] = [
  {
    path: 'dns-resolver/',
    title: 'DNS Resolver',
    icon: <DnsIcon />,
  },
  {
    path: 'ip-calc/',
    title: 'IP Calc',
    icon: <CalculateIcon />,
  },
];

const subContents: MenuItem[] = [
];

function SideMenu() {
  const { pathname } = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainContents.map((c, i) => (
          <ListItem key={i} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} to={c.path} selected={!!matchPath(c.path, pathname)}>
              <ListItemIcon>{c.icon}</ListItemIcon>
              <ListItemText primary={c.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {subContents.map((c, i) => (
          <ListItem key={i} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={Link} to={c.path} selected={!!matchPath(c.path, pathname)}>
              <ListItemIcon>{c.icon}</ListItemIcon>
              <ListItemText primary={c.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default SideMenu;
