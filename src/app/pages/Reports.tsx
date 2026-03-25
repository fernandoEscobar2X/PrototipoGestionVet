import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, FileText, TrendingUp, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { eachMonthOfInterval, endOfMonth, format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#0F6E56', '#185FA5', '#BA7517', '#993C1D'];

export function Reports() {
  const { transactions, patients, appointments } = useData();

  const last7Months = eachMonthOfInterval({
    start: subMonths(new Date(), 6),
    end: new Date(),
  });

  const incomeByMonth = last7Months.map((month) => {
    const income = transactions
      .filter((transaction) => {
        const date = parseISO(transaction.date);
        return transaction.type === 'income' && date >= startOfMonth(month) && date <= endOfMonth(month);
      })
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    return { name: format(month, 'MMM', { locale: es }), income };
  });

  const speciesCount: Record<string, number> = {};
  patients.forEach((patient) => {
    const label =
      patient.species === 'Dog'
        ? 'Perros'
        : patient.species === 'Cat'
          ? 'Gatos'
          : patient.species === 'Bird'
            ? 'Aves'
            : 'Otros';
    speciesCount[label] = (speciesCount[label] || 0) + 1;
  });
  const speciesData = Object.entries(speciesCount).map(([name, value]) => ({ name, value }));

  const totalIncome = transactions.filter((transaction) => transaction.type === 'income').reduce((acc, transaction) => acc + transaction.amount, 0);
  const activePatients = patients.filter((patient) => patient.status === 'active').length;
  const totalAppointments = appointments.filter((appointment) => appointment.status === 'completed').length;

  const kpis = [
    {
      label: 'Ingresos totales',
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      tone: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Pacientes activos',
      value: activePatients,
      icon: Users,
      tone: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Consultas realizadas',
      value: totalAppointments,
      icon: Activity,
      tone: 'bg-violet-100 text-violet-600',
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <section>
        <h1 className="flex items-center gap-3 text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-3xl">
          <div className="rounded-2xl bg-violet-100 p-2.5 text-violet-700">
            <FileText className="h-6 w-6" />
          </div>
          Reportes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Una lectura ejecutiva de ingresos, ocupacion y composicion de pacientes, afinada para consultarse tambien en movil.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="flex items-center gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`rounded-2xl p-4 ${kpi.tone}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              <p className="truncate text-2xl font-bold text-slate-800">{kpi.value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Ingresos por mes</h2>
              <p className="text-sm text-slate-500">Ultimos 7 meses</p>
            </div>
          </div>
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeByMonth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 12px 24px -12px rgb(15 23 42 / 0.25)' }}
                  formatter={(value: number) => [`$${value}`, 'Ingresos']}
                />
                <Bar dataKey="income" fill="#0F6E56" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Pacientes por especie</h2>
            <p className="text-sm text-slate-500">Distribucion actual</p>
          </div>

          <div className="h-64 w-full sm:h-72">
            {speciesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={speciesData} cx="50%" cy="50%" innerRadius={52} outerRadius={92} paddingAngle={4} dataKey="value">
                    {speciesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin datos de pacientes</div>
            )}
          </div>

          {speciesData.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {speciesData.map((item, index) => (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium">{item.name}</span>
                  <span className="text-slate-400">({item.value})</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
