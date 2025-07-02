import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 8,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP - 26,
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState(isDesktop);
  const [navWidth, setNavWidth] = useState(isDesktop ? 200 : 0);

  const blur = () => {
    // setOpen(true);
  };

  useEffect(() => {
    if (isDesktop) {
      if (open) {
        setNavWidth(200);
      } else {
        setNavWidth(66);
      }
    }
  }, [open]);

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(!open)} navWidth={navWidth} />

      <Nav className="" openNav={open} onCloseNav={() => setOpen(false)} onBlurNav={blur} navWidth={navWidth} />

      <Main id='body'>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
