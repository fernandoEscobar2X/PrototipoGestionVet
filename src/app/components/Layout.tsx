import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  Calendar, 
  PawPrint, 
  BadgeDollarSign, 
  BarChart3, 
  LogOut, 
  Settings,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  Bell
} from 'lucide-react';
import { isBefore, parseISO } from 'date-fns';

export function Layout() {
  const { user, logout } = useAuth();
  const { reminders } = useData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Calcular alertas urgentes
  const urgentAlertsCount = reminders.filter(r => 
    r.status === 'pending' && 
    (r.priority === 'urgent' || isBefore(parseISO(r.due_date), new Date()))
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
    { to: '/patients', icon: PawPrint, label: 'Pacientes' },
    { to: '/alerts', icon: Bell, label: 'Alertas', badge: urgentAlertsCount },
    { to: '/cashbox', icon: BadgeDollarSign, label: 'Caja' },
    { to: '/reports', icon: BarChart3, label: 'Reportes' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-2xl lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-8 py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-600/20">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none">VetManager</h1>
                <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">Pro</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="mb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Menu Principal
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-sm border border-teal-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 transition-colors ${({isActive}: {isActive: boolean}) => isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${({isActive}: {isActive: boolean}) => isActive ? 'text-teal-600 opacity-100 translate-x-0' : 'text-slate-300'}`} />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile & Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role === 'admin' ? 'Administrador' : 'Veterinario'}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all">
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 hover:shadow-sm transition-all group"
              >
                <LogOut className="w-4 h-4 group-hover:text-red-500" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-screen relative">
        {/* Header Mobile */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:hidden z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-800">VetManager</span>
          </div>
          <button 
            onClick={() => navigate('/alerts')}
            className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-orange-50 transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            {urgentAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {urgentAlertsCount}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}