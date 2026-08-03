import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import App from './App';
import DnsResolver from './components/DnsResolver';
import IpCalc from './components/IpCalc';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <HashRouter>
        <Routes>
          <Route Component={App}>
            <Route path="dns-resolver/" Component={DnsResolver} />
            <Route path="ip-calc/" Component={IpCalc} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </SnackbarProvider>
  </StrictMode>,
);
