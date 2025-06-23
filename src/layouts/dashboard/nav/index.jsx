import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useResponsive from '../../../hooks/useResponsive';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { Box, Avatar, Drawer } from '@mui/material';

import navConfig from './config';
import '../dashboard.css';
// ----------------------------------------------------------------------

const NAV_WIDTH = 200;

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav, onBlurNav, navWidth }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav && !isDesktop) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    // navhidden
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column'},
      }}
    >
      <NavSection data={navConfig} openNav={openNav} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        // width: { lg: NAV_WIDTH },
        // position: 'absolute',
        // top: '10px',
        width: { lg: navWidth },
      }}
    >
      {isDesktop ? (
        <Drawer
          // open
          // variant="permanent"
          variant="persistent"
          open={openNav}
          onClose={onCloseNav}
          onBlur={onBlurNav}
          style={{ width: `${navWidth}px` }}
          className={`drawer cust-nav-position ${!openNav && "navhidden"}`}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              boxShadow: { lg: '0 14px 28px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.22)' },
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          variant="temporary"
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
