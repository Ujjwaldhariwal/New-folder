import DashboardIcon from '@mui/icons-material/Dashboard';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard/app', // Path updated to go directly to the app route
    icon: <DashboardIcon />,
    // child array commented out as it is no longer a dropdown
    // child: [
    //   { title: '2D Dashboard', path: '/dashboard/app', icon: <DashboardIcon /> },
    //   { title: '3D Dashboard', path: '/dashboard/3d-dashboard', icon: <DashboardIcon /> },
    // ],
  },
  {
    title: 'admin',
    path: '/dashboard/admin',
    icon: <DashboardIcon />,
  },
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: <DashboardIcon />,
    child: [
      {
        title: 'Report1',
        path: '/dashboard/reports',
        icon: <DashboardIcon />,
      },
    ],
  },
];

export default navConfig;