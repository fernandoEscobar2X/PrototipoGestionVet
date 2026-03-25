import { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  isBefore,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Activity,
  AlertCircle,
  Bell,
  Check,
  Clock,
  Filter,
  MessageSquare,
  Phone,
  Plus,
  Send,
  Syringe,
  X,
} from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

type FilterType = 'all' | 'urgent' | 'this_week' | 'next_month';

export function Alerts() {
  const { reminders, patients, updateReminder, deleteReminder, addReminder } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showNewReminderDialog, setShowNewReminderDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<string | null>(null);

  const filteredReminders = reminders
    .filter((reminder) => {
      if (reminder.status !== 'pending') return false;

      const dueDate = parseISO(reminder.due_date);
      const today = new Date();

      switch (filter) {
        case 'urgent':
          return reminder.priority === 'urgent' || isBefore(dueDate, today);
        case 'this_week':
          return isBefore(dueDate, addDays(today, 7));
        case 'next_month':
          return isBefore(dueDate, addMonths(today, 1));
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

  const urgentCount = reminders.filter(
    (reminder) =>
      reminder.status === 'pending' &&
      (reminder.priority === 'urgent' || isBefore(parseISO(reminder.due_date), new Date())),
  ).length;

  const filters = [
    { id: 'all', label: 'Todos', count: reminders.filter((reminder) => reminder.status === 'pending').length },
    { id: 'urgent', label: 'Urgentes', count: urgentCount },
    {
      id: 'this_week',
      label: 'Esta semana',
      count: reminders.filter(
        (reminder) => reminder.status === 'pending' && isBefore(parseISO(reminder.due_date), addDays(new Date(), 7)),
      ).length,
    },
    {
      id: 'next_month',
      label: 'Proximo mes',
      count: reminders.filter(
        (reminder) => reminder.status === 'pending' && isBefore(parseISO(reminder.due_date), addMonths(new Date(), 1)),
      ).length,
    },
  ] as const;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return Syringe;
      case 'surgery_followup':
        return Activity;
      case 'call_owner':
        return Phone;
      case 'checkup':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const handleComplete = (id: string) => {
    updateReminder(id, { status: 'completed' });
    toast.success('Recordatorio completado');
  };

  const handleDismiss = (id: string) => {
    updateReminder(id, { status: 'dismissed' });
    toast.info('Recordatorio descartado');
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    toast.success('Recordatorio eliminado');
  };

  const handleSendNotification = (reminderId: string) => {
    setSelectedReminder(reminderId);
    setShowNotificationDialog(true);
  };

  const sendWhatsAppNotification = () => {
    if (!selectedReminder) return;

    const reminder = reminders.find((currentReminder) => currentReminder.id === selectedReminder);
    if (!reminder || !reminder.patient_id) return;

    const patient = patients.find((currentPatient) => currentPatient.id === reminder.patient_id);
    if (!patient) return;

    updateReminder(selectedReminder, { notification_sent: true });

    const message = `Hola ${patient.owner_name}, le recordamos: ${reminder.title}. ${reminder.description}`;
    const whatsappUrl = `https://wa.me/${patient.owner_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    toast.success('Mensaje enviado por WhatsApp');
    setShowNotificationDialog(false);
    setSelectedReminder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative rounded-2xl bg-orange-100 p-2.5 text-orange-700">
              <Bell className="h-6 w-6" />
              {urgentCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {urgentCount}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alertas y recordatorios</h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Prioriza pendientes, notifica a clientes y mantente al dia sin perder claridad en pantallas pequenas.
          </p>
        </div>

        <Dialog open={showNewReminderDialog} onOpenChange={setShowNewReminderDialog}>
          <DialogTrigger asChild>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 sm:w-auto">
              <Plus className="h-4 w-4" />
              Nuevo recordatorio
            </button>
          </DialogTrigger>
          <NewReminderDialog onClose={() => setShowNewReminderDialog(false)} patients={patients} addReminder={addReminder} />
        </Dialog>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="h-4 w-4" />
          Filtrar por prioridad o ventana de tiempo
        </div>
        <div className="mobile-chip-scroll">
          {filters.map((currentFilter) => (
            <button
              key={currentFilter.id}
              onClick={() => setFilter(currentFilter.id)}
              className={[
                'rounded-2xl border px-4 py-2 text-sm font-bold transition-all',
                filter === currentFilter.id
                  ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              {currentFilter.label}
              <span className={`ml-2 ${filter === currentFilter.id ? 'opacity-80' : 'opacity-50'}`}>({currentFilter.count})</span>
            </button>
          ))}
        </div>
      </section>

      {filteredReminders.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <Bell className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sin recordatorios activos</h3>
          <p className="mt-2 text-sm text-slate-500">No hay alertas pendientes para el filtro actual.</p>
        </section>
      ) : (
        <section className="space-y-4">
          {filteredReminders.map((reminder) => {
            const dueDate = parseISO(reminder.due_date);
            const isOverdue = isBefore(dueDate, new Date());
            const daysUntil = differenceInDays(dueDate, new Date());
            const patient = reminder.patient_id ? patients.find((currentPatient) => currentPatient.id === reminder.patient_id) : null;
            const TypeIcon = getTypeIcon(reminder.type);

            return (
              <article
                key={reminder.id}
                className={[
                  'rounded-[28px] border-2 bg-white p-5 shadow-sm transition-all hover:shadow-lg sm:p-6',
                  isOverdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200',
                ].join(' ')}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className={`w-fit rounded-2xl border p-3 ${getPriorityColor(reminder.priority)}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-900">{reminder.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{reminder.description}</p>
                      </div>

                      <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority === 'urgent'
                          ? 'Urgente'
                          : reminder.priority === 'high'
                            ? 'Alta'
                            : reminder.priority === 'medium'
                              ? 'Media'
                              : 'Baja'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">
                      {patient && (
                        <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
                          <Activity className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate font-medium">
                            {patient.name} ({patient.owner_name})
                          </span>
                        </div>
                      )}

                      <div
                        className={[
                          'inline-flex max-w-full items-center gap-2 rounded-xl px-3 py-2',
                          isOverdue ? 'bg-red-50 font-semibold text-red-700' : 'bg-slate-50 text-slate-600',
                        ].join(' ')}
                      >
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {isOverdue
                            ? `Vencida hace ${Math.abs(daysUntil)} dias`
                            : daysUntil === 0
                              ? 'Hoy'
                              : daysUntil === 1
                                ? 'Manana'
                                : `En ${daysUntil} dias`}
                          {` • ${format(dueDate, "d 'de' MMMM", { locale: es })}`}
                        </span>
                      </div>

                      {reminder.auto_generated && (
                        <span className="inline-flex w-fit items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                          Auto
                        </span>
                      )}

                      {reminder.notification_sent && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                          <Check className="h-3 w-3" />
                          Notificado
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        onClick={() => handleComplete(reminder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <Check className="h-4 w-4" />
                        Completar
                      </button>

                      {patient && (
                        <button
                          onClick={() => handleSendNotification(reminder.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Notificar
                        </button>
                      )}

                      <button
                        onClick={() => handleDismiss(reminder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                        Descartar
                      </button>

                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 sm:ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              Enviar notificacion
            </DialogTitle>
          </DialogHeader>

          {selectedReminder &&
            (() => {
              const reminder = reminders.find((currentReminder) => currentReminder.id === selectedReminder);
              const patient = reminder?.patient_id ? patients.find((currentPatient) => currentPatient.id === reminder.patient_id) : null;

              return (
                <div className="space-y-4 py-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Cliente</p>
                    <p className="mt-1 font-bold text-slate-900">{patient?.owner_name}</p>
                    <p className="text-sm text-slate-600">{patient?.owner_phone}</p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-medium text-blue-600">Mensaje a enviar</p>
                    <p className="text-sm leading-6 text-slate-700">
                      Hola {patient?.owner_name}, le recordamos: <strong>{reminder?.title}</strong>. {reminder?.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={sendWhatsAppNotification}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                      Enviar por WhatsApp
                    </button>
                    <button
                      onClick={() => setShowNotificationDialog(false)}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewReminderDialog({
  onClose,
  patients,
  addReminder,
}: {
  onClose: () => void;
  patients: Array<{ id: string; name: string; owner_name: string }>;
  addReminder: (reminder: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    patient_id: '',
    due_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'other',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addReminder({
      ...formData,
      owner_user_id: 'user_001',
      patient_id: formData.patient_id || undefined,
      status: 'pending',
      auto_generated: false,
      notification_sent: false,
      created_at: new Date().toISOString(),
    });

    toast.success('Recordatorio creado exitosamente');
    onClose();
  };

  return (
    <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Nuevo recordatorio</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Titulo *</label>
          <input
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            required
            placeholder="Ej: Llamar a cliente sobre vacuna"
            className="w-full rounded-2xl border border-slate-200 px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Descripcion</label>
          <textarea
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            placeholder="Detalles adicionales..."
            rows={3}
            className="w-full rounded-2xl border border-slate-200 px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Paciente (opcional)</label>
          <select
            value={formData.patient_id}
            onChange={(event) => setFormData({ ...formData, patient_id: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Sin asociar</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.owner_name})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(event) => setFormData({ ...formData, due_date: event.target.value })}
              required
              className="w-full rounded-2xl border border-slate-200 px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(event) =>
                setFormData({ ...formData, priority: event.target.value as 'low' | 'medium' | 'high' | 'urgent' })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
          <select
            value={formData.type}
            onChange={(event) => setFormData({ ...formData, type: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="vaccine">Vacuna</option>
            <option value="checkup">Chequeo</option>
            <option value="surgery_followup">Seguimiento postoperatorio</option>
            <option value="medication">Medicacion</option>
            <option value="call_owner">Llamar al dueno</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-teal-600 px-4 py-3 font-medium text-white transition-colors hover:bg-teal-700 sm:w-auto"
          >
            Crear recordatorio
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
