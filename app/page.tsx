import { Calculate, Dns } from '@mui/icons-material';
import { Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export default function Home() {
  return (
    <main>
      <List>
        <ListItem>
          <ListItemButton component={Link} href='dns-resolver/'>
            <ListItemIcon>
              <Dns/>
            </ListItemIcon>
            <ListItemText primary='DNS Resolver'/>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component={Link} href='ip-calc/'>
            <ListItemIcon>
              <Calculate/>
            </ListItemIcon>
            <ListItemText primary='IP Calc'/>
          </ListItemButton>
        </ListItem>
      </List>
    </main>
  );
}
