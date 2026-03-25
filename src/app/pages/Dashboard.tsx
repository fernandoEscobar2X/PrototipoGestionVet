import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { format, isToday } from 'date-fns';
import { Link } from 'react-router';

export function Dashboard() {
  const { patients, appointments, transactions } = useData();
  const { user } = useAuth();

  const totalPatients = patients.length;
  const todayAppointments = appointments.filter(a => isToday(new Date(a.date))).length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const incomeToday = transactions
    .filter(t => isToday(new Date(t.date)) && t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { 
      label: 'Pacientes Activos', 
      value: totalPatients, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+12% vs mes anterior'
    },
    { 
      label: 'Citas Hoy', 
      value: todayAppointments, 
      icon: Calendar, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      trend: '4 pendientes'
    },
    { 
      label: 'Ingresos Hoy', 
      value: `$${incomeToday}`, 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+5% vs ayer'
    },
    { 
      label: 'Pendientes', 
      value: pendingAppointments.length, 
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      trend: 'Requieren atención'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 mt-1 text-lg">Bienvenido de nuevo, <span className="font-semibold text-slate-700">{user?.name}</span></p>
        </div>
        <div className="flex gap-3">
          <Link to="/agenda" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Ver Agenda
          </Link>
          <Link to="/patients" className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Pacientes
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} transition-colors group-hover:scale-110 duration-200`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                Hoy
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximas Citas */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Agenda Próxima
            </h2>
            <Link to="/agenda" className="text-sm text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No hay citas programadas
              </div>
            ) : (
              appointments.slice(0, 5).map((apt) => {
                const patient = patients.find(p => p.id === apt.patient_id);
                return (
                  <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 font-bold w-14 h-14 rounded-xl border border-indigo-100">
                          <span className="text-lg leading-none">{format(new Date(apt.date), 'HH')}</span>
                          <span className="text-xs uppercase opacity-70 leading-none mt-0.5">{format(new Date(apt.date), 'mm')}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{patient?.name || 'Desconocido'}</p>
                          <p className="text-sm text-slate-500 font-medium">{apt.type} • {apt.notes}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                          apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' : 
                          'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                        {apt.status === 'completed' ? 'Completado' : apt.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Acciones Requeridas / Vacunas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Acciones Requeridas
            </h2>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{patient.name}</p>
                      <p className="text-xs text-slate-500 font-medium">Próxima Vacuna</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-700">{format(new Date(patient.next_vaccine), 'dd MMM')}</p>
                     <p className="text-xs text-slate-400">{format(new Date(patient.next_vaccine), 'yyyy')}</p>
                  </div>
                </div>
                <button className="w-full mt-2 text-xs bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 font-bold transition-all text-slate-500">
                  Enviar Recordatorio
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
