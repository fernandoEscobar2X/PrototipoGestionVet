import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { FileText, TrendingUp, Users, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#0F6E56', '#185FA5', '#BA7517', '#993C1D'];

export function Reports() {
  const { transactions, patients, appointments } = useData();

  // Ingresos por mes (últimos 7 meses)
  const last7Months = eachMonthOfInterval({
    start: subMonths(new Date(), 6),
    end: new Date(),
  });

  const dataIncome = last7Months.map(month => {
    const income = transactions
      .filter(t => {
        const d = parseISO(t.date);
        return t.type === 'income' && d >= startOfMonth(month) && d <= endOfMonth(month);
      })
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: format(month, 'MMM', { locale: es }), income };
  });

  // Pacientes por especie
  const speciesCount: Record<string, number> = {};
  patients.forEach(p => {
    const label = p.species === 'Dog' ? 'Perros' : p.species === 'Cat' ? 'Gatos' : p.species === 'Bird' ? 'Aves' : 'Otros';
    speciesCount[label] = (speciesCount[label] || 0) + 1;
  });
  const dataSpecies = Object.entries(speciesCount).map(([name, value]) => ({ name, value }));

  // KPIs reales
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const activePatients = patients.filter(p => p.status === 'active').length;
  const totalAppointments = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
              <FileText className="w-6 h-6" />
            </div>
            Reportes
          </h1>
          <p className="text-slate-500 mt-1">Analíticas basadas en datos reales del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-slate-800">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pacientes Activos</p>
            <p className="text-2xl font-bold text-slate-800">{activePatients}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Consultas Realizadas</p>
            <p className="text-2xl font-bold text-slate-800">{totalAppointments}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Ingresos por Mes</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataIncome} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: any) => [`$${v}`, 'Ingresos']} />
                <Bar dataKey="income" fill="#0F6E56" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Pacientes por Especie</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {dataSpecies.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataSpecies} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                    {dataSpecies.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">Sin datos de pacientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
