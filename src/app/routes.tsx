import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Agenda = lazy(() => import('./pages/Agenda').then((module) => ({ default: module.Agenda })));
const Patients = lazy(() => import('./pages/Patients').then((module) => ({ default: module.Patients })));
const PatientDetail = lazy(() => import('./pages/PatientDetail').then((module) => ({ default: module.PatientDetail })));
const CashRegister = lazy(() => import('./pages/CashRegister').then((module) => ({ default: module.CashRegister })));
const Reports = lazy(() => import('./pages/Reports').then((module) => ({ default: module.Reports })));
const Alerts = lazy(() => import('./pages/Alerts').then((module) => ({ default: module.Alerts })));

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500 shadow-sm">
        Cargando vista...
      </div>
    </div>
  );
}

function withSuspense(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return function SuspendedRoute() {
    return (
      <Suspense fallback={<RouteLoader />}>
        <Component />
      </Suspense>
    );
  };
}

const LoginPage = withSuspense(Login);
const DashboardPage = withSuspense(Dashboard);
const AgendaPage = withSuspense(Agenda);
const PatientsPage = withSuspense(Patients);
const PatientDetailPage = withSuspense(PatientDetail);
const CashRegisterPage = withSuspense(CashRegister);
const ReportsPage = withSuspense(Reports);
const AlertsPage = withSuspense(Alerts);

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: DashboardPage },
          { path: 'agenda', Component: AgendaPage },
          { path: 'patients', Component: PatientsPage },
          { path: 'patients/:id', Component: PatientDetailPage },
          { path: 'alerts', Component: AlertsPage },
          { path: 'cashbox', Component: CashRegisterPage },
          { path: 'reports', Component: ReportsPage },
        ],
      },
    ],
  },
  {
    path: '*',
    Component: () => <div className="p-8 text-center text-slate-500">Pagina no encontrada</div>,
  },
]);
