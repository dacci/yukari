import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { type ModalProps } from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import type { ElementType, TransitionEventHandler } from 'react';
import MenuContent from './MenuContent.tsx';

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

interface SideMenuProps {
  readonly component?: ElementType;
  readonly open?: boolean;
  readonly onTransitionEnd?: TransitionEventHandler<HTMLDivElement>;
  readonly onClose?: ModalProps['onClose'];
}

function SideMenu(props: SideMenuProps) {
  return (
    <>
      <Drawer
        component={props.component}
        variant="temporary"
        open={props.open}
        keepMounted
        sx={{
          'display': { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        onTransitionEnd={props.onTransitionEnd}
        onClose={props.onClose}
      >
        <MenuContent />
      </Drawer>
      <Drawer
        component={props.component}
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <MenuContent />
      </Drawer>
    </>
  );
}

export default SideMenu;
