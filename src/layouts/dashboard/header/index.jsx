import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Badge, Typography, Avatar } from '@mui/material';
import ThemeToggle from '../../../components/theme/ThemeToggle';
import { bgBlur } from '../../../utils/cssStyles';
import Iconify from '../../../components/iconify';
// import Logo from '/icons/bosch_logo.png';
import AccountPopover from './AccountPopover';

const NAV_WIDTH = 265;
const HEADER_MOBILE = 50;
const HEADER_DESKTOP = 65;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none !important',
  [theme.breakpoints.up('lg')]: {
    // width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  boxShadow: 'none !important',

    // boxShadow: '0 2px 20px rgba(0,0,0,.12),0 0px 1px rgba(0,0,0,.22) !important',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 3),
    background: 'var(--card-color) !important',
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav, navWidth }) {
  return (
    <StyledRoot
     sx={{
    width: { lg: `calc(100% - ${navWidth}px)` }, // apply width only for desktop
     // borderBottom: '1px solid var(--primary-border-color)' 
  }}
    >
      <StyledToolbar>
        {/* <Avatar src={Logo} alt="logo" style={{ marginLeft: '0px' }} /> */}

        <Stack
          direction="row"
          alignItems="right"
          spacing={{
            xs: 1.5,
            sm: 1,
          }}
        >
          <IconButton
            className="header-mobile-view"
            onClick={onOpenNav}
            // style={{ marginLeft: '15px' }}
            sx={{
              mr: 1,
              color: 'var(--primary-color)',
              // color: 'text.primary',
              // display: { lg: 'none' },
            }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>

          <Typography
            variant="h4"
            paddingTop="3px"
            paddingLeft="15px"
            gutterBottom
            color='var(--primary-color)'
            className="header-mobile-view title-style text-[1.4rem]"
          >
            {import.meta.env.VITE_APP_DISCOME_NAME}
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />
        <ThemeToggle />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
