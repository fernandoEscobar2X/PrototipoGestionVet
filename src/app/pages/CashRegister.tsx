import { useState } from 'react';
import { useData } from '../context/DataContext';
import { addDays, format, isSameDay, parseISO, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  Minus,
  Plus,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export function CashRegister() {
  const { transactions: allTransactions, patients, addTransaction } = useData();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    type: 'income' as 'income' | 'expense',
    patient_id: '',
  });

  const transactions = allTransactions.filter((transaction) => isSameDay(parseISO(transaction.date), selectedDate));

  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((acc, current) => acc + current.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((acc, current) => acc + current.amount, 0);

  const balance = income - expense;

  const getPatientName = (id: string) => {
    const patient = patients.find((currentPatient) => currentPatient.id === id);
    return patient ? patient.name : 'General / Varios';
  };

  const handleSaveTransaction = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    addTransaction({
      owner_user_id: 'user_001',
      patient_id: newTransaction.patient_id || 'null',
      date: selectedDate.toISOString(),
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      status: 'paid',
    });

    toast.success('Operacion registrada correctamente');
    setShowAddModal(false);
    setNewTransaction({ amount: '', description: '', type: 'income', patient_id: '' });
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
            <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
              <DollarSign className="h-6 w-6" />
            </div>
            Caja diaria
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Controla ingresos, egresos y balance con una lectura clara y accionable desde cualquier pantalla.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto">
            <Download className="h-4 w-4" />
            Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva operacion
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setSelectedDate((date) => addDays(date, -1))}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Corte diario</p>
            <h2 className="mt-1 flex flex-col items-center justify-center gap-2 text-lg font-bold capitalize text-slate-800 sm:flex-row">
              <Calendar className="h-5 w-5 text-indigo-500" />
              {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </h2>
          </div>

          <button
            onClick={() => setSelectedDate((date) => addDays(date, 1))}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:self-auto"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="relative overflow-hidden rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <TrendingUp className="h-24 w-24 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Ingresos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">+${income.toFixed(2)}</p>
        </article>

        <article className="relative overflow-hidden rounded-[26px] border border-red-100 bg-white p-5 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <TrendingDown className="h-24 w-24 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Gastos</p>
          <p className="mt-2 text-3xl font-bold text-red-600">-${expense.toFixed(2)}</p>
        </article>

        <article className="relative overflow-hidden rounded-[26px] border border-slate-800 bg-slate-900 p-5 text-white shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <DollarSign className="h-24 w-24 text-white" />
          </div>
          <p className="text-sm font-medium text-slate-400">Balance del dia</p>
          <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-800">Movimientos</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p>No hay movimientos registrados para este dia.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {transactions.map((transaction) => (
                <article key={transaction.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{transaction.description}</p>
                      <p className="mt-1 text-sm text-slate-500">{getPatientName(transaction.patient_id)}</p>
                    </div>
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 text-xs font-bold',
                        transaction.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                      ].join(' ')}
                    >
                      {transaction.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-slate-500">{format(parseISO(transaction.date), 'HH:mm')}</span>
                    <span className={transaction.type === 'income' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="table-scroll hidden md:block">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Hora</th>
                    <th className="px-6 py-3">Concepto</th>
                    <th className="px-6 py-3">Paciente / Ref</th>
                    <th className="px-6 py-3 text-right">Monto</th>
                    <th className="px-6 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-slate-600">{format(parseISO(transaction.date), 'HH:mm')}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{transaction.description}</td>
                      <td className="px-6 py-4 text-slate-600">{getPatientName(transaction.patient_id)}</td>
                      <td
                        className={[
                          'px-6 py-4 text-right font-bold',
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600',
                        ].join(' ')}
                      >
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={[
                            'rounded-full px-2.5 py-1 text-xs font-bold',
                            transaction.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700',
                          ].join(' ')}
                        >
                          {transaction.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-800">Registrar operacion</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                    className={[
                      'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
                      newTransaction.type === 'income'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-slate-200 bg-white text-slate-600',
                    ].join(' ')}
                  >
                    <Plus className="h-4 w-4" />
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                    className={[
                      'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
                      newTransaction.type === 'expense'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-white text-slate-600',
                    ].join(' ')}
                  >
                    <Minus className="h-4 w-4" />
                    Gasto
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Monto</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</div>
                  <input
                    type="number"
                    required
                    className="w-full rounded-2xl border border-slate-300 py-3 pl-8 pr-4 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="0.00"
                    value={newTransaction.amount}
                    onChange={(event) => setNewTransaction({ ...newTransaction, amount: event.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Descripcion</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ej: Consulta general"
                  value={newTransaction.description}
                  onChange={(event) => setNewTransaction({ ...newTransaction, description: event.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Paciente (opcional)</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  value={newTransaction.patient_id}
                  onChange={(event) => setNewTransaction({ ...newTransaction, patient_id: event.target.value })}
                >
                  <option value="">General / Ninguno</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.owner_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
