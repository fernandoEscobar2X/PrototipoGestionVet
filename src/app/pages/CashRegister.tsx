import { useState } from 'react';
import { useData } from '../context/DataContext';
import { format, parseISO, isSameDay, startOfToday, subDays, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  X
} from 'lucide-react';
import { toast } from "sonner";

export function CashRegister() {
  const { transactions: allTransactions, patients, addTransaction } = useData();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock adding transaction state
  const [newTx, setNewTx] = useState({
    amount: '',
    description: '',
    type: 'income' as 'income' | 'expense',
    patient_id: ''
  });

  const transactions = allTransactions.filter(t =>
    isSameDay(parseISO(t.date), selectedDate)
  );

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? patient.name : 'General / Varios';
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;
    addTransaction({
      owner_user_id: 'user_001',
      patient_id: newTx.patient_id || 'null',
      date: selectedDate.toISOString(),
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      type: newTx.type,
      status: 'paid',
    });
    toast.success('Operación registrada correctamente');
    setShowAddModal(false);
    setNewTx({ amount: '', description: '', type: 'income', patient_id: '' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Caja Diaria
          </h1>
          <p className="text-slate-500">Control de ingresos y egresos</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Operación
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
         <button 
          onClick={() => setSelectedDate(d => addDays(d, -1))}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </h2>
        </div>

        <button 
          onClick={() => setSelectedDate(d => addDays(d, 1))}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24 text-green-600" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Ingresos</p>
          <p className="text-3xl font-bold text-green-600">+${income.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="w-24 h-24 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Gastos</p>
          <p className="text-3xl font-bold text-red-600">-${expense.toFixed(2)}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <p className="text-sm font-medium text-slate-400 mb-1">Balance del Día</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Movimientos</h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p>No hay movimientos registrados para este día.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Concepto</th>
                  <th className="px-6 py-3">Paciente / Ref</th>
                  <th className="px-6 py-3 text-right">Monto</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {format(parseISO(tx.date), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {getPatientName(tx.patient_id)}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tx.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nueva Operación */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Registrar Operación</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'income' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                      newTx.type === 'income' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'expense' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                      newTx.type === 'expense' 
                        ? 'bg-red-50 border-red-200 text-red-700' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Gasto
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    $
                  </div>
                  <input
                    type="number"
                    required
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej: Consulta General"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente (Opcional)</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={newTx.patient_id}
                  onChange={(e) => setNewTx({ ...newTx, patient_id: e.target.value })}
                >
                  <option value="">-- General / Ninguno --</option>
                  {MOCK_PATIENTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.owner_name})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
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
