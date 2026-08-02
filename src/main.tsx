import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import App from './App';
import DnsResolver from './components/DnsResolver';
import IpCalc from './components/IpCalc';

const router = createHashRouter([
  {
    Component: App,
    children: [
      {
        path: '/dns-resolver',
        Component: DnsResolver,
      },
      {
        path: '/ip-calc',
        Component: IpCalc,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </StrictMode>,
);
