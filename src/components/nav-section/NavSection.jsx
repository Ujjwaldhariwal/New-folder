import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Marquee from 'react-fast-marquee';
import Logo from '/icons/bosch_logo.png';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import ViewInArIcon from '@mui/icons-material/ViewInAr'; // 3D Dashboard icon
// @mui
import {
  Box,
  Avatar,
  List,
  ListItemText,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemIcon,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SessionTimeout from '../SessionTimeout/SessionTimeout';
import { signOut, clearUserInfo } from '../../state/reducers/authSlice';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

const styles = {
  settingsTab: {
    color: 'white',
    margin: '4px 4px',
    padding: '0 16px',
    height: '25px',
    fontWeight: '700',
    width: '96%',
    cursor: 'pointer',
    borderRadius: '6px',
  },
  settingsIcon: {
    color: 'white',
    minWidth: '35px',
  },
  bgTransparent: {
    backgroundColor: 'transparent',
  },
  parentTab: {
    color: 'var(--primary-color)',
    margin: '0px 4px',
    height: '35px',
    fontWeight: '700',
    width: '96%',
    cursor: 'pointer',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#1565C0', // Custom hover color
    },
    '&:active': {
      backgroundColor: '#ba8b00', // Custom active color
    },
  },
  childTab: {
    color: 'var(--primary-color)',
    height: '35px',
    margin: '2px 4px',
    fontWeight: '700',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1565C0', // Custom hover color
    },
    '&:active': {
      backgroundColor: '#ba8b00', // Custom active color
    },
  },
  iconFontStyle: {
    fontSize: '20px',
  },
  parentIcon: {
    color: 'var(--primary-color)',
    minWidth: '35px',
  },
  childIcon: {
    color: 'var(--primary-color)',
    minWidth: '35px',
  },
  accordionSummary: {
    height: '35px',
  },
};

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], openNav, ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data.data);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const isSessionIdle = SessionTimeout();

  // --- MODIFICATION: State for dashboard dropdown is no longer needed ---
  // const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isReportPanelOpen, setIsReportPanelOpen] = useState(false);

  // --- MODIFICATION: Handler for dashboard dropdown is no longer needed ---
  // const handleDashboardOpen = () => {
  //   setIsDashboardOpen(!isDashboardOpen);
  // };

  const handleAdminPanelOpen = () => {
    setIsAdminPanelOpen(!isAdminPanelOpen);
  };

  const handleReportPanelOpen = () => {
    setIsReportPanelOpen(!isReportPanelOpen);
  };

  const location = useLocation();
  const maxLength = 20;

  useEffect(() => {
    if (isSessionIdle && isAuth) {
      setTimeout(() => {
        dispatch(signOut());
        dispatch(clearUserInfo());
        navigate(`/login`);
      }, 1000);
    }
  }, [isSessionIdle, isAuth, dispatch, navigate]); // Added dependencies to useEffect

  const isActive = (path) => {
    // Using startsWith to ensure parent menu items can be highlighted if a child route is active.
    // For a direct link like Dashboard, it works perfectly.
    return location.pathname.startsWith(path);
  };

  const getListItemStyles = (path) => {
    return isActive(path)
      ? { ...styles.childTab, color: 'var(--nav-active-color)' } // Active color
      : styles.childTab;
  };

  return (
    <>
      <Box
        {...other}
        className="relative"
        style={{
          background: 'var(--navBar-bg-color)',
          height: '100vh',
          overflowY: openNav ? 'auto' : 'visible',
          // borderRight: '1px solid var(--primary-border-color)',
        }}
      >
        {openNav ? (
          <div className="flex justify-center items-center h-20 ">
            <Avatar src={Logo} style={{ width: '60px', height: '60px' }} alt="logo" />
          </div>
        ) : (
          <div className="flex justify-center items-center h-16 ">
            <Avatar src={Logo} style={{ width: '40px', height: '40px' }} alt="logo" />
          </div>
        )}
        {!openNav && <hr className="border-b border-gray-400 mx-2" />}

        <List style={{ paddingTop: '12px' }}>
          {/* --- MODIFICATION START ---
            The original collapsible Accordion for the Dashboard has been replaced with a single, direct ListItem link.
            This simplifies the UI so that clicking "Dashboard" directly navigates the user to the 3D Dashboard at '/dashboard/app'.
            This change applies to both the expanded (openNav) and collapsed (!openNav) sidebar views.
          */}
          {userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Dashboard')) && (
            <ListItem
              button
              component={Link}
              to={`/dashboard/app`}
              style={
                isActive('/dashboard/app')
                  ? { ...styles.parentTab, backgroundColor: 'var(--nav-active-bg-color)', color: 'var(--nav-active-color)' } // Apply active styles
                  : styles.parentTab
              }
            >
              <ListItemIcon
                style={
                  isActive('/dashboard/app')
                    ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                    : styles.parentIcon
                }
              >
                <DashboardIcon style={styles.iconFontStyle} titleAccess="Dashboard" />
              </ListItemIcon>
              {openNav && <ListItemText primary="Dashboard" />}
            </ListItem>
          )}
          {/* --- MODIFICATION END --- */}


          {/* --- ORIGINAL CODE COMMENTED OUT ---
            Below is the original code that created a collapsible menu for "2D Dashboard" and "3D Dashboard".
            It has been preserved here for reference.
          */}
          {/*
          {!openNav ? (
            <>
              {userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Dashboard')) && (
                <ListItem
                  className="nav-menu-icon"
                  style={styles.parentTab}
                  onClick={handleDashboardOpen}
                >
                  <ListItemIcon style={styles.parentIcon}>
                    <DashboardIcon style={styles.iconFontStyle} titleAccess="Dashboard" />
                  </ListItemIcon>
                </ListItem>
              )}

              {isDashboardOpen && userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Dashboard')) && (
                <>
                  <ListItem
                    className="nav-menu-icon"
                    style={
                      isActive('/dashboard/app')
                        ? { ...styles.childTab, color: 'var(--nav-active-color)' }
                        : styles.childTab
                    }
                    component={Link}
                    to={`/dashboard/app`}
                  >
                    <ListItemIcon
                      style={
                        isActive('/dashboard/app')
                          ? { ...styles.childIcon, color: 'var(--nav-active-color)' }
                          : styles.childIcon
                      }
                    >
                      <DashboardIcon style={styles.iconFontStyle} titleAccess="2D Dashboard" />
                    </ListItemIcon>
                  </ListItem>

                  <ListItem
                    className="nav-menu-icon"
                    style={
                      isActive('/dashboard/3d-dashboard')
                        ? { ...styles.childTab, color: 'var(--nav-active-color)' }
                        : styles.childTab
                    }
                    component={Link}
                    to={`/dashboard/3d-dashboard`}
                  >
                    <ListItemIcon
                      style={
                        isActive('/dashboard/3d-dashboard')
                          ? { ...styles.childIcon, color: 'var(--nav-active-color)' }
                          : styles.childIcon
                      }
                    >
                      <ViewInArIcon style={styles.iconFontStyle} titleAccess="3D Dashboard" />
                    </ListItemIcon>
                  </ListItem>
                </>
              )}
            </>
          ) : (
            <>
              {userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Dashboard')) && (
                <Accordion style={styles.bgTransparent} className="mt-0">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={styles.parentIcon} />}
                    style={styles.parentTab}
                  >
                    <ListItemIcon
                      style={
                        (isActive('/dashboard/app') || isActive('/dashboard/3d-dashboard'))
                          ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                          : styles.parentIcon
                      }
                    >
                      <DashboardIcon style={styles.iconFontStyle} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dashboard"
                      style={
                        (isActive('/dashboard/app') || isActive('/dashboard/3d-dashboard'))
                          ? { color: 'var(--nav-active-color)' }
                          : {}
                      }
                    />
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: '0px 9px 0px' }}>
                    <List style={{ paddingTop: '0px', paddingBottom: '1px' }}>
                      <ListItem
                        button
                        component={Link}
                        style={getListItemStyles('/dashboard/app')}
                        to={`/dashboard/app`}
                      >
                        <ListItemText primary="2D Dashboard" />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        style={getListItemStyles('/dashboard/3d-dashboard')}
                        to={`/dashboard/3d-dashboard`}
                      >
                        <ListItemText primary="3D Dashboard" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </>
          )}
          */}
          {/* --- END OF COMMENTED OUT ORIGINAL CODE --- */}


          {/* Admin Section - This code remains unchanged */}
          {!openNav ? (
            <>
              {userData && userData.role_id === 'ADMIN' && (
                <ListItem
                  className="nav-menu-icon"
                  style={styles.parentTab}
                  onClick={(e) => handleAdminPanelOpen()}
                >
                  <ListItemIcon style={styles.parentIcon}>
                    <AdminPanelSettingsIcon style={styles.iconFontStyle} titleAccess="Admin" />
                  </ListItemIcon>
                </ListItem>
              )}
              {isAdminPanelOpen && (
                <>
                  {userData && userData.role_id === 'ADMIN' && (
                    <ListItem
                      className="nav-menu-icon"
                      style={
                        isActive('/dashboard/user-registration')
                          ? { ...styles.parentTab, color: 'var(--nav-active-color)' }
                          : styles.parentTab
                      }
                      component={Link}
                      to={`/dashboard/user-registration`}
                    >
                      <ListItemIcon
                        style={
                          isActive('/dashboard/user-registration')
                            ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                            : styles.parentIcon
                        }
                      >
                        <PersonAddIcon style={styles.iconFontStyle} titleAccess="User Registration" />
                      </ListItemIcon>
                    </ListItem>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {userData && userData.role_id === 'ADMIN' && (
                <Accordion style={styles.bgTransparent} className="mt-0">
                  <AccordionSummary expandIcon={<ExpandMoreIcon style={styles.parentIcon} />} style={styles.parentTab}>
                    <ListItemIcon style={
                      isActive('/dashboard/user-registration')
                        ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                        : styles.parentIcon
                    }
                    >
                      <AdminPanelSettingsIcon style={styles.iconFontStyle} />
                    </ListItemIcon>
                    <ListItemText primary="Admin" style={
                      isActive('/dashboard/user-registration')
                        ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                        : styles.parentIcon
                    } />
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: '0px 9px 0px' }}>
                    <List style={{ paddingTop: '0px', paddingBottom: '1px' }}>
                      <ListItem
                        button
                        component={Link}
                        style={getListItemStyles('/dashboard/user-registration')}
                        to={`/dashboard/user-registration`}
                      >
                        <ListItemText primary="User Registration" />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </>
          )}

          {!openNav ? (
            <>
              {/* {userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Report')) && (
                <ListItem
                  className="nav-menu-icon"
                  style={styles.parentTab}
                  onClick={(e) => handleReportPanelOpen()}
                >
                  <ListItemIcon style={styles.parentIcon}>
                    <SummarizeIcon style={styles.iconFontStyle} titleAccess="Report" />
                  </ListItemIcon>
                </ListItem>
              )}
              {isReportPanelOpen && (
                <>
                  {userData && (userData.role_id === 'Report' || userData.menu.includes('Connection Status')) && (
                    <ListItem
                      className="nav-menu-icon"
                      style={
                        isActive('/dashboard/connection-status')
                          ? { ...styles.parentTab, color: 'var(--nav-active-color)' }
                          : styles.parentTab
                      }
                      component={Link}
                      to={`/dashboard/connection-status`}
                    >
                      <ListItemIcon
                        style={
                          isActive('/dashboard/connection-status')
                            ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                            : styles.parentIcon
                        }
                      >
                        <WifiOffIcon className="my-2" style={styles.iconFontStyle} titleAccess="Connection Status" />
                      </ListItemIcon>
                    </ListItem>
                  )}

                  {userData && (userData.role_id === 'Report' || userData.menu.includes('Communication Status')) && (
                    <ListItem
                      className="nav-menu-icon"
                      style={
                        isActive('/dashboard/communication-status')
                          ? { ...styles.parentTab, color: 'var(--nav-active-color)' }
                          : styles.parentTab
                      }
                      component={Link}
                      to={`/dashboard/communication-status`}
                    >
                      <ListItemIcon
                        style={
                          isActive('/dashboard/communication-status')
                            ? { ...styles.parentIcon, color: 'var(--nav-active-color)' }
                            : styles.parentIcon
                        }
                      >
                        <InterpreterModeIcon style={styles.iconFontStyle} titleAccess="Communication Status" />
                      </ListItemIcon>
                    </ListItem>
                  )}
                </>
              )} */}
            </>
          ) : (
            <>
              {/* {userData && (userData.role_id === 'ADMIN' || userData.menu.includes('Report')) && (
                <Accordion className="mt-0" style={styles.bgTransparent} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon style={styles.parentIcon} />} style={styles.parentTab}>
                    <ListItemIcon style={styles.parentIcon}>
                      <SummarizeIcon style={styles.iconFontStyle} />
                    </ListItemIcon>
                    {openNav && <ListItemText primary="Reports" />}
                  </AccordionSummary>

                  {userData && userData.menu.includes('Connection Status') && (
                    <AccordionDetails style={{ padding: '0px 9px 0px' }}>
                      <List style={{ paddingTop: '0px', paddingBottom: '1px' }}>
                        <ListItem
                          button
                          component={Link}
                          style={getListItemStyles('/dashboard/connection-status')}
                          to={`/dashboard/connection-status`}
                        >
                          {openNav && (
                            <>
                              {userData.menu.includes('Connection Status').length > maxLength ? (
                                <Marquee>
                                  <ListItemText primary="Connection Status" />
                                </Marquee>
                              ) : (
                                <ListItemText primary="Connection Status" />
                              )}
                            </>
                          )}
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  )}

                  {userData && userData.menu.includes('Communication Status') && (
                    <AccordionDetails style={{ padding: '0px 9px 0px' }}>
                      <List style={{ paddingTop: '0px', paddingBottom: '1px' }}>
                        <ListItem
                          button
                          component={Link}
                          style={getListItemStyles('/dashboard/communication-status')}
                          to={`/dashboard/communication-status`}
                        >
                          {openNav && (
                            <>
                              {userData.menu.includes('Communication Status').length > maxLength ? (
                                <Marquee>
                                  <ListItemText primary="Communication Status" />
                                </Marquee>
                              ) : (
                                <ListItemText primary="Communication Status" />
                              )}
                            </>
                          )}
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  )}

                </Accordion>
              )} */}
            </>
          )}
        </List>

        {/* <div className="absolute bottom-2 w-48">
          <List>
            <ListItem
              // style={isActive('/dashboard/app') ? { ...styles.parentTab, color: 'var(--nav-active-color)' } : styles.parentTab}
              style={styles.settingsTab}
              component={Link}
            // to={`/dashboard/app`}
            >
              <ListItemIcon style={styles.settingsIcon}>
                <SupportAgentOutlinedIcon style={styles.iconFontStyle} />
              </ListItemIcon>
              {openNav && <ListItemText primary="Help/faqs" />}
            </ListItem>
            <ListItem
              // style={isActive('/dashboard/app') ? { ...styles.parentTab, color: 'var(--nav-active-color)' } : styles.parentTab}
              style={styles.settingsTab}
              component={Link}
            // to={`/dashboard/app`}
            >
              <ListItemIcon style={styles.settingsIcon}>
                <SettingsOutlinedIcon style={styles.iconFontStyle} />
              </ListItemIcon>
              {openNav && <ListItemText primary="Settings" />}
            </ListItem>
          </List>
        </div> */}
      </Box>
    </>
  );
}