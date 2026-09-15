import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginComponent } from './componants/login/Login';
import { ProtectedRoute } from './componants/layout/ProtectedRoute';

const DashboardDummy: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h2>Secure Dashboard</h2>
    <p>Authentication authorized.</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginComponent />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardDummy />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
