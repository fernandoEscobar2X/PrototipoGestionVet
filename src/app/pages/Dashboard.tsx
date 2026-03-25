import {
  Activity,
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function Dashboard() {
  const { patients, appointments, transactions } = useData();
  const { user } = useAuth();

  const totalPatients = patients.length;
  const todayAppointments = appointments.filter((appointment) => isToday(new Date(appointment.date))).length;
  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending');
  const incomeToday = transactions
    .filter((transaction) => isToday(new Date(transaction.date)) && transaction.type === 'income')
    .reduce((acc, current) => acc + current.amount, 0);

  const stats = [
    {
      label: 'Pacientes activos',
      value: totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+12% vs mes anterior',
    },
    {
      label: 'Citas hoy',
      value: todayAppointments,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      trend: `${pendingAppointments.length} pendientes`,
    },
    {
      label: 'Ingresos hoy',
      value: `$${incomeToday}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+5% vs ayer',
    },
    {
      label: 'Pendientes',
      value: pendingAppointments.length,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: 'Requieren atencion',
    },
  ];

  const upcomingAppointments = appointments.slice(0, 3);
  const requiredActions = patients.slice(0, 3);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 sm:space-y-7">
      <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-sm sm:rounded-[28px] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-700">
              Vet ops
            </span>
            <h1 className="mt-3 text-[1.55rem] font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-4xl">
              Vista diaria
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Bienvenido, <span className="font-semibold text-slate-700">{user?.name}</span>. Lo importante queda primero
              y con menos friccion en movil.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-row sm:gap-3">
            <Link
              to="/agenda"
              className="btn-touch w-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              Agenda
            </Link>
            <Link
              to="/patients"
              className="btn-touch w-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
            >
              <Users className="h-4 w-4" />
              Pacientes
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-[24px] sm:p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className={`rounded-2xl p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
                <TrendingUp className="h-3.5 w-3.5" />
                Hoy
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal">
              {stat.label}
            </p>
            <h2 className="mt-2 text-[1.65rem] font-bold tracking-tight text-slate-900 sm:text-3xl">{stat.value}</h2>
            <p className="mt-2 text-[11px] font-medium leading-4 text-slate-400 sm:mt-3 sm:text-xs">{stat.trend}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
        <div className="xl:col-span-2">
          <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 shadow-sm sm:rounded-[28px]">
            <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Proximas citas
              </h2>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition-all hover:gap-2 hover:text-indigo-800"
              >
                Ver agenda
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingAppointments.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No hay citas programadas</div>
              ) : (
                upcomingAppointments.map((appointment) => {
                  const patient = patients.find((currentPatient) => currentPatient.id === appointment.patient_id);

                  return (
                    <article key={appointment.id} className="p-4 transition-colors hover:bg-slate-50 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3.5">
                          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 font-bold text-indigo-700">
                            <span className="text-base leading-none">{format(new Date(appointment.date), 'HH')}</span>
                            <span className="mt-1 text-[11px] uppercase opacity-70">{format(new Date(appointment.date), 'mm')}</span>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold text-slate-900 sm:text-lg">
                              {patient?.name || 'Paciente no identificado'}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-slate-500">
                              {appointment.type}
                              {appointment.notes ? ` | ${appointment.notes}` : ''}
                            </p>
                          </div>
                        </div>

                        <span
                          className={[
                            'inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide',
                            appointment.status === 'completed'
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                              : appointment.status === 'cancelled'
                                ? 'border-red-100 bg-red-50 text-red-700'
                                : 'border-blue-100 bg-blue-50 text-blue-700',
                          ].join(' ')}
                        >
                          {appointment.status === 'completed'
                            ? 'Completada'
                            : appointment.status === 'cancelled'
                              ? 'Cancelada'
                              : 'Pendiente'}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 shadow-sm sm:rounded-[28px]">
          <div className="border-b border-slate-100 bg-slate-50/80 p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Acciones requeridas
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {requiredActions.map((patient) => (
              <article key={patient.id} className="p-4 transition-colors hover:bg-slate-50 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-600">
                      <Activity className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold text-slate-900">{patient.name}</p>
                      <p className="text-xs font-medium text-slate-500">Proxima vacuna</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-700">{format(new Date(patient.next_vaccine), 'dd MMM')}</p>
                    <p className="text-[11px] text-slate-400">{format(new Date(patient.next_vaccine), 'yyyy')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-touch-compact mt-3 w-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Enviar recordatorio
                </button>
              </article>
            ))}
          </div>

          <div className="border-t border-slate-100 p-4 sm:p-5">
            <Link
              to="/alerts"
              className="btn-touch w-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 transition-colors hover:bg-slate-800"
            >
              Ver alertas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
