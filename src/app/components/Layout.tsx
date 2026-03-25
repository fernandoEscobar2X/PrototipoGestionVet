import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  BadgeDollarSign,
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  Settings,
  X,
} from 'lucide-react';
import { isBefore, parseISO } from 'date-fns';

export function Layout() {
  const { user, logout } = useAuth();
  const { reminders } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const urgentAlertsCount = reminders.filter(
    (reminder) =>
      reminder.status === 'pending' &&
      (reminder.priority === 'urgent' || isBefore(parseISO(reminder.due_date), new Date())),
  ).length;

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Inicio' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
    { to: '/patients', icon: PawPrint, label: 'Pacientes' },
    { to: '/alerts', icon: Bell, label: 'Alertas', badge: urgentAlertsCount },
    { to: '/cashbox', icon: BadgeDollarSign, label: 'Caja' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
  ];

  const mobileNavItems = navItems.filter((item) => item.to !== '/reports');

  React.useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-transparent text-slate-900 lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menu lateral"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[min(20rem,88vw)] max-w-full flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-0 lg:h-[100dvh] lg:w-72 lg:translate-x-0 lg:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)] pointer-events-none',
        ].join(' ')}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-teal-600 p-2.5 shadow-lg shadow-teal-600/20">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight text-slate-900">VetManager</h1>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">Clinic OS</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6 lg:px-4">
            <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Navegacion
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'border border-teal-100 bg-teal-50 text-teal-700 shadow-sm'
                        : 'border border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex min-w-0 items-center gap-3">
                        <item.icon
                          className={[
                            'h-5 w-5 shrink-0 transition-colors',
                            isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600',
                          ].join(' ')}
                        />
                        <span className="truncate">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-lg shadow-red-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        className={[
                          'h-4 w-4 shrink-0 transition-all',
                          isActive
                            ? 'translate-x-0 text-teal-600 opacity-100'
                            : '-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                        ].join(' ')}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/80 p-4">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 font-bold text-white shadow-md shadow-teal-500/20">
                {user?.name?.charAt(0) ?? 'V'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{user?.name ?? 'Veterinaria'}</p>
                <p className="truncate text-xs text-slate-500">
                  {user?.role === 'admin' ? 'Administrador' : 'Veterinario'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                className="btn-touch-compact w-full justify-start rounded-xl text-slate-500 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm"
              >
                <Settings className="h-4 w-4" />
                <span>Configuracion</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-touch-compact group w-full justify-start rounded-xl text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              >
                <LogOut className="h-4 w-4 group-hover:text-red-500" />
                <span>Cerrar sesion</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="safe-top sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:hidden">
          <div className="flex h-[4.125rem] items-center justify-between gap-3 px-3.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-2xl p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-slate-900">VetManager</p>
                <p className="text-[11px] text-slate-500">Operacion diaria</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100/90 text-slate-600 shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-600"
            >
              <Bell className="h-4 w-4" />
              {urgentAlertsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-lg shadow-red-500/30">
                  {urgentAlertsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-clip px-3.5 py-3 sm:px-6 lg:px-8 lg:py-8">
          <div className="page-bottom-offset mx-auto w-full max-w-7xl space-y-6 lg:space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="mobile-nav-shell fixed bottom-[var(--mobile-dock-offset)] left-1/2 z-20 w-[min(calc(100%-1rem),32rem)] -translate-x-1/2 rounded-[30px] border border-slate-200/80 bg-white/94 px-2 pt-2 shadow-[0_22px_60px_-30px_rgba(15,23,42,0.58)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'relative flex min-w-0 flex-col items-center gap-1 rounded-[20px] px-2 py-2.5 text-[11px] font-semibold transition-colors',
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.12)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon className={['h-5 w-5', isActive ? 'text-teal-600' : 'text-slate-400'].join(' ')} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
