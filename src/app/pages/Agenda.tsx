import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '../context/DataContext';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Plus, User, XCircle } from 'lucide-react';

export function Agenda() {
  const { appointments, patients, updateAppointment, addAppointment } = useData();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient_id: '',
    time: '09:00',
    type: 'Consultation' as 'Consultation' | 'Vaccine' | 'Surgery' | 'Checkup',
    notes: '',
  });

  const appointmentsForDate = appointments.filter((appointment) =>
    isSameDay(parseISO(appointment.date), selectedDate),
  );

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getPatient = (id: string) => patients.find((patient) => patient.id === id);

  const handleCreateAppointment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newAppointment.patient_id) return;

    const [hours, minutes] = newAppointment.time.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);

    addAppointment({
      owner_user_id: 'user_001',
      patient_id: newAppointment.patient_id,
      date: date.toISOString(),
      type: newAppointment.type,
      status: 'pending',
      notes: newAppointment.notes,
    });

    toast.success('Cita agendada correctamente');
    setShowNewAppointment(false);
    setNewAppointment({ patient_id: '', time: '09:00', type: 'Consultation', notes: '' });
  };

  const handleStatusChange = (id: string, status: 'completed' | 'cancelled') => {
    updateAppointment(id, { status });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
            <div className="rounded-2xl bg-indigo-100 p-2.5 text-indigo-700">
              <Calendar className="h-6 w-6" />
            </div>
            Agenda
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Organiza el dia con una vista tactil, rapida y legible para recepcion, consulta y seguimiento.
          </p>
        </div>

        <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-inner sm:w-auto">
          <button
            onClick={() => setView('day')}
            className={[
              'flex-1 rounded-xl px-5 py-2.5 text-sm font-bold transition-all sm:flex-none',
              view === 'day' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900',
            ].join(' ')}
          >
            Dia
          </button>
          <button
            onClick={() => setView('week')}
            className={[
              'flex-1 rounded-xl px-5 py-2.5 text-sm font-bold transition-all sm:flex-none',
              view === 'week'
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-900',
            ].join(' ')}
          >
            Semana
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <button
              onClick={() => setSelectedDate((date) => addDays(date, view === 'day' ? -1 : -7))}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 px-2 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Fecha activa</p>
              <h2 className="mt-1 text-lg font-bold capitalize text-slate-900 sm:text-xl">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              </h2>
            </div>

            <button
              onClick={() => setSelectedDate((date) => addDays(date, view === 'day' ? 1 : 7))}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(startOfToday())}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100 sm:w-auto"
          >
            Volver a hoy
          </button>
        </div>

        <div className="table-scroll -mx-1 mt-6 px-1">
          <div className="grid min-w-[42rem] grid-cols-7 gap-3">
            {weekDays.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isTodayDate = isSameDay(date, startOfToday());
              const hasEvents = appointments.some((appointment) => isSameDay(parseISO(appointment.date), date));

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={[
                    'relative flex flex-col items-center rounded-2xl border px-3 py-4 transition-all',
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                    isTodayDate && !isSelected ? 'border-indigo-200 bg-slate-50 font-bold text-indigo-600' : '',
                  ].join(' ')}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.22em] opacity-80">
                    {format(date, 'EEE', { locale: es })}
                  </span>
                  <span className="mt-2 text-2xl font-bold">{format(date, 'd')}</span>
                  <span className="mt-1 text-xs opacity-75">{format(date, 'MMM', { locale: es })}</span>
                  {hasEvents && (
                    <div className={`mt-3 flex gap-1 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Clock className="h-5 w-5 text-slate-400" />
              Horarios del dia
            </h3>
            <button
              onClick={() => setShowNewAppointment(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Nueva cita
            </button>
          </div>

          {appointmentsForDate.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                <Calendar className="h-10 w-10 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Dia libre</h4>
              <p className="mt-2 text-sm text-slate-500">No hay citas programadas para este dia.</p>
              <button
                type="button"
                onClick={() => setShowNewAppointment(true)}
                className="mt-5 text-sm font-bold text-indigo-600 hover:underline"
              >
                Programar una cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointmentsForDate.map((appointment) => {
                const patient = getPatient(appointment.patient_id);

                return (
                  <article
                    key={appointment.id}
                    className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-100 hover:shadow-lg sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 transition-colors lg:h-[4.5rem] lg:w-[4.5rem]">
                          <span className="text-lg font-black">{format(parseISO(appointment.date), 'HH:mm')}</span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                            {format(parseISO(appointment.date), 'a')}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h4 className="truncate text-lg font-bold text-slate-900">
                                {patient?.name || 'Paciente no identificado'}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {patient?.species} • {patient?.breed}
                              </p>
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
                              {appointment.status === 'pending'
                                ? 'Pendiente'
                                : appointment.status === 'completed'
                                  ? 'Completada'
                                  : 'Cancelada'}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap">
                            <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                              <User className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="truncate">{patient?.owner_name}</span>
                            </div>
                            <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {appointment.type}
                                {appointment.notes ? `: ${appointment.notes}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 lg:flex-col">
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          title="Completar"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 lg:w-12 lg:flex-none lg:px-0"
                        >
                          <CheckCircle className="h-5 w-5" />
                          <span className="lg:hidden">Completar</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          title="Cancelar"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 lg:w-12 lg:flex-none lg:px-0"
                        >
                          <XCircle className="h-5 w-5" />
                          <span className="lg:hidden">Cancelar</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-lg">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
            <div className="relative z-10">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Clock className="h-5 w-5 text-indigo-400" />
                Recordatorios
              </h3>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="rounded bg-orange-500/20 px-2 py-1 text-xs font-bold text-orange-300">
                      Alta prioridad
                    </span>
                    <span className="text-xs text-slate-400">10:00 AM</span>
                  </div>
                  <p className="font-bold">Llamar a Sr. Perez</p>
                  <p className="mt-1 text-sm text-slate-300">Confirmar cirugia de Max para el viernes.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="rounded bg-blue-500/20 px-2 py-1 text-xs font-bold text-blue-300">Inventario</span>
                    <span className="text-xs text-slate-400">2:00 PM</span>
                  </div>
                  <p className="font-bold">Revisar stock de vacunas</p>
                  <p className="mt-1 text-sm text-slate-300">Quedan pocas dosis de Rabia.</p>
                </div>
              </div>

              <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-100">
                <Plus className="h-4 w-4" />
                Agregar tarea
              </button>
            </div>
          </div>
        </aside>
      </section>

      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva cita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAppointment} className="space-y-4 py-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Paciente *</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                value={newAppointment.patient_id}
                onChange={(event) => setNewAppointment({ ...newAppointment, patient_id: event.target.value })}
                required
              >
                <option value="">Seleccionar paciente...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.owner_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Hora</label>
                <input
                  type="time"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  value={newAppointment.time}
                  onChange={(event) => setNewAppointment({ ...newAppointment, time: event.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  value={newAppointment.type}
                  onChange={(event) =>
                    setNewAppointment({
                      ...newAppointment,
                      type: event.target.value as 'Consultation' | 'Vaccine' | 'Surgery' | 'Checkup',
                    })
                  }
                >
                  <option value="Consultation">Consulta</option>
                  <option value="Vaccine">Vacuna</option>
                  <option value="Surgery">Cirugia</option>
                  <option value="Checkup">Revision</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Notas</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                rows={3}
                placeholder="Motivo de la consulta..."
                value={newAppointment.notes}
                onChange={(event) => setNewAppointment({ ...newAppointment, notes: event.target.value })}
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowNewAppointment(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700 sm:w-auto"
              >
                Agendar cita
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
