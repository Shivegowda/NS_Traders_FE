import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginComponent } from './componants/login/Login';
import { ProtectedRoute } from './componants/layout/ProtectedRoute';
import { Dashboard } from './componants/DashBoard/Dashboard';
import { FarmersManagement } from './componants/farmersManagement/FarmersManagement';
import { ProductManagement } from './componants/products/ProductManagement';
import { PurchaseOrders } from './componants/purchaseOrders/PurchaseOrders';



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
      },
      {
        path: '/products',
        element: <ProductManagement />,
      },
      {
        path: '/purchase-orders',
        element: <PurchaseOrders />,
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
