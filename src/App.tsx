import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginComponent } from './componants/login/Login';
import { ProtectedRoute } from './componants/layout/ProtectedRoute';
import { Dashboard } from './componants/DashBoard/Dashboard';
import { FarmersManagement } from './componants/farmersManagement/FarmersManagement';



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
        element: <Dashboard />,
      },
      {
        path: '/farmers',
        element: <FarmersManagement />,
      }
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
