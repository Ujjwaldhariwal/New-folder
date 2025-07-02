import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import LoginPage from './pages/login/LoginPage';
import Page404 from './pages/Page404';
// import DashboardAppPage from './pages/dashboard/DashboardAppPage';
import UserRegistration from './pages/admin/UserRegistration';
import ThreeDDashboardPage from './components/3d-charts/3d-dashboard/ThreeDDashboardPage'; // ✅ import here

import ConnectionStatusReport from './pages/reports/ConnectionStatusReport';
import PFReport from './pages/reports/PFReport';
import DisconnectionAging from './pages/reports/DisconnectionAging';
import CommunicationStatusMeter from './pages/reports/CommunicationStatusMeter';
import DisconnectionReconnectionReport from './pages/reports/DisconnectionReconnection';

// ----------------------------------------------------------------------

export default function Router() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  // const discomPath = import.meta.env.VITE_APP_DISCOME_CODE;
  // const userAccessMenu = useSelector((state) => state.auth?.data?.data?.menu);
  // const AdminAccess = useSelector((state) => state.auth?.data?.data?.role_id == 'ADMIN');
  // const DashboardAccess = userAccessMenu?.includes('Dashboard');

  const ProtectedRoute = ({ children, requiredPermission }) => {
    // const isAuth = useSelector((state) => state.auth.isAuth);
    const userAccessMenu = useSelector((state) => state.auth?.data?.data?.menu);
    const AdminAccess = useSelector((state) => state.auth?.data?.data?.role_id == 'ADMIN');

    if (!isAuth) return <Navigate replace to="/login" />;
    if (requiredPermission === 'ADMIN') {
      if (!AdminAccess) {
        return <Navigate replace to="/404" />;
      }
    } else {
      if (requiredPermission && !userAccessMenu?.includes(requiredPermission)) {
        return <Navigate replace to="/404" />;
      }
    }

    return children;
  };

  const routes = useRoutes([
    {
      path: `/dashboard`,
      element: isAuth ? <DashboardLayout /> : <Navigate replace to={`/login`} />,
      children: [
  {
    path: 'app',
    element: (
      <ProtectedRoute requiredPermission="Dashboard">
        {/* <DashboardAppPage /> */}
         <ThreeDDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'user-registration',
    element: (
      <ProtectedRoute requiredPermission="ADMIN">
        <UserRegistration />
      </ProtectedRoute>
    ),
  },
],

    },
    {
      path: `/login`,
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to={`/dashboard/app`} />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
