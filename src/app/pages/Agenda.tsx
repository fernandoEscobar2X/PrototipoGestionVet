import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { addDays, format, isSameDay, startOfToday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '../context/DataContext';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, CheckCircle, XCircle, Plus, MapPin } from 'lucide-react';

export function Agenda() {
  const { appointments, patients, updateAppointment, addAppointment } = useData();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [showNewCita, setShowNewCita] = useState(false);
  const [newCita, setNewCita] = useState({
    patient_id: '',
    time: '09:00',
    type: 'Consultation' as 'Consultation' | 'Vaccine' | 'Surgery' | 'Checkup',
    notes: '',
  });

  const handleCreateCita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCita.patient_id) return;
    const [h, m] = newCita.time.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(h, m, 0, 0);
    addAppointment({
      owner_user_id: 'user_001',
      patient_id: newCita.patient_id,
      date: date.toISOString(),
      type: newCita.type,
      status: 'pending',
      notes: newCita.notes,
    });
    toast.success('Cita agendada correctamente');
    setShowNewCita(false);
    setNewCita({ patient_id: '', time: '09:00', type: 'Consultation', notes: '' });
  };

  const appointmentsForDate = appointments.filter(apt => 
    isSameDay(parseISO(apt.date), selectedDate)
  );

  const getPatient = (id: string) => patients.find(p => p.id === id);

  // Generate week days based on selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleStatusChange = (id: string, status: 'completed' | 'cancelled') => {
    updateAppointment(id, { status });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
              <Calendar className="w-6 h-6" />
            </div>
            Agenda
          </h1>
          <p className="text-slate-500 mt-1 text-lg">Gestiona tus citas y recordatorios diarios</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1.5 border border-slate-200 shadow-inner">
          <button
            onClick={() => setView('day')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              view === 'day' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Día
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              view === 'week' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Semana
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedDate(d => addDays(d, view === 'day' ? -1 : -7))}
              className="p-2 hover:bg-slate-100 rounded-full border border-slate-200 hover:border-slate-300 transition-all text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 capitalize min-w-[200px] text-center">
              {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
            </h2>
            <button 
              onClick={() => setSelectedDate(d => addDays(d, view === 'day' ? 1 : 7))}
              className="p-2 hover:bg-slate-100 rounded-full border border-slate-200 hover:border-slate-300 transition-all text-slate-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedDate(startOfToday())}
            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
          >
            Volver a Hoy
          </button>
        </div>

        {/* Week View Grid */}
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isSameDay(date, startOfToday());
            const hasEvents = appointments.some(a => isSameDay(parseISO(a.date), date));
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex flex-col items-center py-4 rounded-2xl border transition-all relative group overflow-hidden
                  ${isSelected 
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900'}
                  ${isTodayDate && !isSelected ? 'bg-slate-50 font-bold text-indigo-600 border-indigo-200' : ''}
                `}
              >
                <span className="text-xs uppercase font-bold mb-1 tracking-wider opacity-80">
                  {format(date, 'EEE', { locale: es })}
                </span>
                <span className="text-2xl font-bold">
                  {format(date, 'd')}
                </span>
                
                {hasEvents && (
                  <div className={`mt-2 flex gap-0.5 justify-center ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Horarios del Día
            </h3>
            <button
              onClick={() => setShowNewCita(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <Plus className="w-4 h-4" />
              Nueva Cita
            </button>
          </div>
          
          {appointmentsForDate.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 border-dashed text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Día Libre</h4>
              <p className="text-slate-500 mt-1">No hay citas programadas para este día.</p>
              <button className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
                Programar una cita ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointmentsForDate.map((apt) => {
                const patient = getPatient(apt.patient_id);
                return (
                  <div key={apt.id} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[80px] py-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-700 transition-colors">
                        <span className="text-xl font-black text-slate-800 group-hover:text-indigo-700">
                          {format(parseISO(apt.date), 'HH:mm')}
                        </span>
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider group-hover:text-indigo-400">
                          {format(parseISO(apt.date), 'a')}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg text-slate-900 truncate">{patient?.name || 'Paciente Desconocido'}</h4>
                            <p className="text-sm text-slate-500 font-medium">{patient?.species} • {patient?.breed}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {apt.status === 'pending' ? 'Pendiente' : 
                             apt.status === 'completed' ? 'Completada' : 'Cancelada'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{patient?.owner_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg flex-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{apt.type}: {apt.notes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          title="Completar" 
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          title="Cancelar" 
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar / Quick Tasks */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Recordatorios
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded">Alta Prioridad</span>
                    <span className="text-xs text-slate-400">10:00 AM</span>
                  </div>
                  <p className="font-bold text-sm mb-1">Llamar a Sr. Pérez</p>
                  <p className="text-xs text-slate-400">Confirmar cirugía de Max para el viernes.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:bg-white/15 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">Inventario</span>
                    <span className="text-xs text-slate-400">2:00 PM</span>
                  </div>
                  <p className="font-bold text-sm mb-1">Revisar stock vacunas</p>
                  <p className="text-xs text-slate-400">Quedan pocas dosis de Rabia.</p>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={showNewCita} onOpenChange={setShowNewCita}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Cita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCita} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paciente *</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={newCita.patient_id}
                onChange={e => setNewCita({...newCita, patient_id: e.target.value})}
                required
              >
                <option value="">Seleccionar paciente...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.owner_name})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                <input
                  type="time"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newCita.time}
                  onChange={e => setNewCita({...newCita, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={newCita.type}
                  onChange={e => setNewCita({...newCita, type: e.target.value as any})}
                >
                  <option value="Consultation">Consulta</option>
                  <option value="Vaccine">Vacuna</option>
                  <option value="Surgery">Cirugía</option>
                  <option value="Checkup">Revisión</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
              <textarea
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                placeholder="Motivo de la consulta..."
                value={newCita.notes}
                onChange={e => setNewCita({...newCita, notes: e.target.value})}
              />
            </div>
            <DialogFooter>
              <button type="button" onClick={() => setShowNewCita(false)} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Agendar Cita</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
