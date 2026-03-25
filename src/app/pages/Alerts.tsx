import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Bell, Plus, Filter, Check, X, AlertCircle, Clock, Syringe, Phone, Activity, MoreVertical, MessageSquare, Send } from 'lucide-react';
import { format, parseISO, isBefore, isAfter, addDays, addMonths, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

type FilterType = 'all' | 'urgent' | 'this_week' | 'next_month';

export function Alerts() {
  const { reminders, patients, updateReminder, deleteReminder, addReminder } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showNewReminderDialog, setShowNewReminderDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<string | null>(null);

  // Filtrado de recordatorios
  const filteredReminders = reminders.filter(rem => {
    if (rem.status !== 'pending') return false;
    
    const dueDate = parseISO(rem.due_date);
    const today = new Date();
    
    switch (filter) {
      case 'urgent':
        return rem.priority === 'urgent' || isBefore(dueDate, today);
      case 'this_week':
        return isBefore(dueDate, addDays(today, 7));
      case 'next_month':
        return isBefore(dueDate, addMonths(today, 1));
      default:
        return true;
    }
  }).sort((a, b) => {
    // Ordenar por prioridad y fecha
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

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
    
    const reminder = reminders.find(r => r.id === selectedReminder);
    if (!reminder || !reminder.patient_id) return;
    
    const patient = patients.find(p => p.id === reminder.patient_id);
    if (!patient) return;

    // Simular envío de WhatsApp
    updateReminder(selectedReminder, { notification_sent: true });
    
    const message = `Hola ${patient.owner_name}, le recordamos: ${reminder.title}. ${reminder.description}`;
    const whatsappUrl = `https://wa.me/${patient.owner_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Mensaje enviado vía WhatsApp');
    setShowNotificationDialog(false);
    setSelectedReminder(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return Syringe;
      case 'surgery_followup': return Activity;
      case 'call_owner': return Phone;
      case 'checkup': return Clock;
      default: return AlertCircle;
    }
  };

  const urgentCount = reminders.filter(r => r.status === 'pending' && (r.priority === 'urgent' || isBefore(parseISO(r.due_date), new Date()))).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-700 relative">
              <Bell className="w-6 h-6" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {urgentCount}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alertas & Recordatorios</h1>
          </div>
          <p className="text-slate-500 mt-1 text-lg">Gestiona tareas pendientes y notificaciones a clientes</p>
        </div>
        
        <Dialog open={showNewReminderDialog} onOpenChange={setShowNewReminderDialog}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Recordatorio
            </Button>
          </DialogTrigger>
          <NewReminderDialog 
            onClose={() => setShowNewReminderDialog(false)}
            patients={patients}
            addReminder={addReminder}
          />
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="w-4 h-4" />
          Filtrar:
        </div>
        {[
          { id: 'all', label: 'Todos', count: reminders.filter(r => r.status === 'pending').length },
          { id: 'urgent', label: 'Urgente', count: urgentCount },
          { id: 'this_week', label: 'Esta Semana', count: reminders.filter(r => r.status === 'pending' && isBefore(parseISO(r.due_date), addDays(new Date(), 7))).length },
          { id: 'next_month', label: 'Próximo Mes', count: reminders.filter(r => r.status === 'pending' && isBefore(parseISO(r.due_date), addMonths(new Date(), 1))).length },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as FilterType)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              filter === f.id
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 border-teal-600'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {f.label} <span className={`ml-1.5 ${filter === f.id ? 'opacity-80' : 'opacity-50'}`}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 border-dashed text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Sin recordatorios</h3>
          <p className="text-slate-500">No hay alertas pendientes en este filtro.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReminders.map(reminder => {
            const dueDate = parseISO(reminder.due_date);
            const isOverdue = isBefore(dueDate, new Date());
            const daysUntil = differenceInDays(dueDate, new Date());
            const patient = reminder.patient_id ? patients.find(p => p.id === reminder.patient_id) : null;
            const TypeIcon = getTypeIcon(reminder.type);

            return (
              <div
                key={reminder.id}
                className={`group bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all ${
                  isOverdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${getPriorityColor(reminder.priority)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{reminder.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{reminder.description}</p>
                      </div>
                      
                      {/* Priority Badge */}
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority === 'urgent' ? 'Urgente' : 
                         reminder.priority === 'high' ? 'Alta' :
                         reminder.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      {patient && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Activity className="w-4 h-4" />
                          <span className="font-medium">{patient.name}</span>
                          <span className="text-slate-400">({patient.owner_name})</span>
                        </div>
                      )}
                      
                      <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                        <Clock className="w-4 h-4" />
                        <span>
                          {isOverdue 
                            ? `Vencida hace ${Math.abs(daysUntil)} días`
                            : daysUntil === 0 
                            ? 'Hoy'
                            : daysUntil === 1
                            ? 'Mañana'
                            : `En ${daysUntil} días`
                          }
                        </span>
                        <span className="text-slate-400">• {format(dueDate, "d 'de' MMMM", { locale: es })}</span>
                      </div>

                      {reminder.auto_generated && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                          Auto
                        </span>
                      )}

                      {reminder.notification_sent && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Notificado
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleComplete(reminder.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Completar
                      </button>

                      {patient && (
                        <button
                          onClick={() => handleSendNotification(reminder.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Notificar
                        </button>
                      )}

                      <button
                        onClick={() => handleDismiss(reminder.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Descartar
                      </button>

                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Enviar Notificación
            </DialogTitle>
          </DialogHeader>
          
          {selectedReminder && (() => {
            const reminder = reminders.find(r => r.id === selectedReminder);
            const patient = reminder?.patient_id ? patients.find(p => p.id === reminder.patient_id) : null;
            
            return (
              <div className="space-y-4 py-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Cliente</p>
                  <p className="font-bold text-slate-900">{patient?.owner_name}</p>
                  <p className="text-sm text-slate-600">{patient?.owner_phone}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 mb-2 font-medium">Mensaje a enviar:</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Hola {patient?.owner_name}, le recordamos: <strong>{reminder?.title}</strong>. {reminder?.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={sendWhatsAppNotification}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNotificationDialog(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dialog Component for New Reminder
function NewReminderDialog({ 
  onClose, 
  patients, 
  addReminder 
}: { 
  onClose: () => void; 
  patients: any[]; 
  addReminder: (reminder: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    patient_id: '',
    due_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'other' as any,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Nuevo Recordatorio</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Ej: Llamar a cliente sobre vacuna"
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles adicionales..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="patient">Paciente (opcional)</Label>
          <Select value={formData.patient_id} onValueChange={(val) => setFormData({ ...formData, patient_id: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ninguno</SelectItem>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.owner_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="due_date">Fecha</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Prioridad</Label>
            <Select value={formData.priority} onValueChange={(val: any) => setFormData({ ...formData, priority: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(val: any) => setFormData({ ...formData, type: val })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vaccine">Vacuna</SelectItem>
              <SelectItem value="checkup">Chequeo</SelectItem>
              <SelectItem value="surgery_followup">Seguimiento Post-Operatorio</SelectItem>
              <SelectItem value="medication">Medicación</SelectItem>
              <SelectItem value="call_owner">Llamar a Dueño</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            Crear Recordatorio
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
