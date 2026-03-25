import React from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  Weight, 
  FileText, 
  Syringe, 
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Save,
  Activity,
  ChevronRight,
  Image as ImageIcon,
  File,
  Upload,
  Download,
  X,
  Mail
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Patient } from '../data/mock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { patients, clinicalRecords, transactions, vaccines, documents, updatePatient, addVaccine, addDocument, deleteDocument } = useData();
  const patient = patients.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'vaccines' | 'billing' | 'documents'>('info');
  const [showEdit, setShowEdit] = useState(false);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Paciente no encontrado</h2>
        <p className="text-slate-500 mb-8 max-w-md">El paciente que buscas no existe o ha sido eliminado del sistema.</p>
        <Link to="/patients" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link to="/patients" className="p-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-slate-500 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{patient.name}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                patient.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {patient.status === 'active' ? 'Activo' : 'Archivado'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
              <span>{patient.species === 'Dog' ? 'Perro' : patient.species === 'Cat' ? 'Gato' : patient.species}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>{patient.breed}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 self-end md:self-auto">
          <button 
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button 
            onClick={() => updatePatient(patient.id, { status: patient.status === 'active' ? 'archived' : 'active' })}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 text-orange-600 rounded-xl font-medium hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
          >
            {patient.status === 'active' ? 'Archivar' : 'Activar'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {[
              { id: 'info', label: 'Información General', icon: User },
              { id: 'history', label: 'Historial Clínico', icon: Activity },
              { id: 'vaccines', label: 'Vacunas', icon: Syringe },
              { id: 'documents', label: 'Documentos', icon: File },
              { id: 'billing', label: 'Facturación', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  ${activeTab === tab.id
                    ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                  <tab.icon className="w-4 h-4" />
                </div>
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50 hidden lg:block" />}
              </button>
            ))}
          </nav>

          {/* Photo Gallery Card */}
          {patient.photos && patient.photos.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 hidden lg:block">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                Fotos del Paciente
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {patient.photos.slice(0, 4).map((photo, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={photo} alt={`${patient.name} ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                  </div>
                ))}
              </div>
              {patient.photos.length > 4 && (
                <button className="w-full mt-2 text-xs text-teal-600 font-bold hover:underline">
                  Ver todas ({patient.photos.length})
                </button>
              )}
            </div>
          )}

          {/* Quick Stats Card */}
          <div className="mt-6 bg-slate-900 text-white p-6 rounded-2xl shadow-lg hidden lg:block relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <h3 className="font-bold text-lg mb-4 relative z-10">Próxima Cita</h3>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <Calendar className="w-5 h-5 text-teal-400" />
              <span className="font-medium">{format(parseISO(patient.next_vaccine), "d 'de' MMMM", { locale: es })}</span>
            </div>
            <p className="text-sm text-slate-400 relative z-10">Próxima vacuna</p>
            <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              Ver Agenda
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm min-h-[500px]">
            {activeTab === 'info' && <InfoTab patient={patient} />}
            {activeTab === 'history' && <HistoryTab patientId={patient.id} />}
            {activeTab === 'vaccines' && <VaccinesTab patientId={patient.id} />}
            {activeTab === 'documents' && <DocumentsTab patientId={patient.id} />}
            {activeTab === 'billing' && <BillingTab patientId={patient.id} />}
          </div>
        </div>
      </div>

      {/* Edit Patient Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <EditPatientForm patient={patient} onClose={() => setShowEdit(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditPatientForm({ patient, onClose }: { patient: any; onClose: () => void }) {
  const { updatePatient } = useData();
  const [form, setForm] = React.useState({
    name: patient.name,
    breed: patient.breed,
    weight: patient.weight,
    owner_name: patient.owner_name,
    owner_phone: patient.owner_phone,
    owner_email: patient.owner_email || '',
    notes: patient.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, { ...form, weight: parseFloat(String(form.weight)) });
    toast.success('Paciente actualizado');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Nombre mascota</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Raza</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Peso (kg)</label>
        <input type="number" step="0.1" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.weight} onChange={e => setForm({...form, weight: parseFloat(e.target.value)})} />
      </div>
      <div className="border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Datos del dueño</p>
        <div className="space-y-3">
          <input placeholder="Nombre" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.owner_name} onChange={e => setForm({...form, owner_name: e.target.value})} />
          <input placeholder="Teléfono" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.owner_phone} onChange={e => setForm({...form, owner_phone: e.target.value})} />
          <input placeholder="Email" type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.owner_email} onChange={e => setForm({...form, owner_email: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notas</label>
        <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Alergias, condiciones especiales..." />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
        <button type="submit" className="flex-1 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Guardar cambios</button>
      </div>
    </form>
  );
}

function InfoTab({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-teal-500 rounded-full" />
          Datos del Paciente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Fecha Nacimiento</div>
            <div className="font-semibold text-slate-900 flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-teal-500" />
              {format(parseISO(patient.birth_date), 'dd MMMM yyyy')}
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Peso Actual</div>
            <div className="font-semibold text-slate-900 flex items-center gap-2 text-lg">
              <Weight className="w-5 h-5 text-teal-500" />
              {patient.weight} kg
            </div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Especie</div>
            <div className="font-semibold text-slate-900 text-lg">{patient.species}</div>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="text-sm text-slate-500 mb-1">Raza</div>
            <div className="font-semibold text-slate-900 text-lg">{patient.breed}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-indigo-500 rounded-full" />
          Datos del Propietario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Nombre Completo</div>
              <div className="font-bold text-slate-900 text-lg">{patient.owner_name}</div>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Teléfono de Contacto</div>
              <div className="font-bold text-slate-900 text-lg">{patient.owner_phone}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-100 p-5 rounded-2xl">
          <div className="flex items-start gap-3">
             <div className="mt-1">
               <FileText className="w-5 h-5 text-yellow-600" />
             </div>
             <div>
               <h4 className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-1">Notas Privadas</h4>
               <p className="text-yellow-700 italic">"Cliente prefiere contacto por WhatsApp. Muy puntual."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ patientId }: { patientId: string }) {
  const { clinicalRecords, addClinicalRecord } = useData();
  const records = clinicalRecords.filter(r => r.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-slate-900">Consultas Recientes</h3>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Consulta
        </button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Activity className="w-8 h-8 text-slate-300" />
          </div>
          <h4 className="font-bold text-slate-900">Sin historial clínico</h4>
          <p className="text-slate-500 text-sm mt-1">Este paciente aún no tiene registros médicos.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record, idx) => (
            <div key={record.id} className="relative pl-8 pb-8 border-l-2 border-slate-100 last:pb-0 last:border-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{record.diagnosis}</h4>
                    <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">{format(parseISO(record.date), "d 'de' MMMM, yyyy")}</p>
                  </div>
                  <button className="text-slate-300 hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tratamiento</p>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-medium">
                      {record.treatment}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notas</p>
                    <p className="text-slate-600 leading-relaxed">{record.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VaccinesTab({ patientId }: { patientId: string }) {
  const { vaccines, addVaccine } = useData();
  const patientVaccines = vaccines.filter(v => v.patient_id === patientId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800">Próximas Vacunas</h3>
          <button className="text-sm text-orange-600 font-bold hover:underline">+ Programar</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white border border-orange-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Rabia (Anual)</p>
                <p className="text-sm text-slate-500">Vence: 25 Oct 2023</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full">
              Pendiente
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-6 px-2">Historial de Vacunación</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Vacuna</th>
                <th className="px-6 py-4 font-semibold">Lote</th>
                <th className="px-6 py-4 font-semibold">Veterinario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientVaccines.map((vaccine) => (
                <tr key={vaccine.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {format(parseISO(vaccine.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{vaccine.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono">{vaccine.batch_number}</td>
                  <td className="px-6 py-4">{vaccine.veterinarian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ patientId }: { patientId: string }) {
  const { documents, addDocument, deleteDocument } = useData();
  const patientDocuments = documents.filter(d => d.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xl text-slate-900">Documentos del Paciente</h3>
        <button 
          onClick={() => toast.success('Función de subida de archivos - Simulada')}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Subir Documento
        </button>
      </div>
      
      {patientDocuments.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <File className="w-8 h-8 text-slate-300" />
          </div>
          <h4 className="font-bold text-slate-900">Sin documentos</h4>
          <p className="text-slate-400 text-sm mt-1">No hay documentos registrados para este paciente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patientDocuments.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${doc.type === 'image' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {doc.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <File className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{doc.name}</h4>
                    <p className="text-xs text-slate-500">{format(parseISO(doc.uploaded_date), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    deleteDocument(doc.id);
                    toast.success('Documento eliminado');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {doc.type === 'image' && (
                <div className="rounded-xl overflow-hidden border border-slate-100 mb-3">
                  <img src={doc.url} alt={doc.name} className="w-full h-32 object-cover" />
                </div>
              )}
              {doc.description && (
                <p className="text-sm text-slate-600 mb-3">{doc.description}</p>
              )}
              <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BillingTab({ patientId }: { patientId: string }) {
  const { transactions } = useData();
  const patientTransactions = transactions.filter(t => t.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xl text-slate-900">Historial de Pagos</h3>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Registrar Cobro
        </button>
      </div>
      
      {patientTransactions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
          <p className="text-slate-400">No hay transacciones registradas.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Concepto</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {format(parseISO(tx.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{tx.description}</td>
                  <td className={`px-6 py-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      tx.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
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
  );
}