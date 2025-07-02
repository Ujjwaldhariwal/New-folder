import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { alpha } from '@mui/material/styles';
import { Box, Typography, MenuItem, IconButton, Popover } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { signOut, clearUserInfo } from '../../../state/reducers/authSlice';
import { LuCircleUserRound } from "react-icons/lu";

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const userData = useSelector((state) => state.auth.data);
  const isAuthenticated = useSelector((state) => state.auth);

  const [open, setOpen] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    dispatch(signOut());
    dispatch(clearUserInfo());
    navigate(`/login`);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        className="header-mobile-view"
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Tooltip title="User Profile" className="header-mobile-view">
          <span>
          <LuCircleUserRound style={{ color: 'var(--primary-color)', cursor: 'pointer', fontSize: '37px' }} />
          </span>
        </Tooltip>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            backgroundColor: 'var(--account-popup-color)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
            color: 'var(--primary-color)',
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData.userID}
          </Typography>
        </Box>

        <hr style={{ margin: '0', borderColor: 'var(--primary-border-color)', opacity: '0.9' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
