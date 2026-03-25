import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useData } from '../context/DataContext';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronRight,
  DollarSign,
  Download,
  Edit,
  File,
  FileText,
  Image as ImageIcon,
  Mail,
  Phone,
  Plus,
  Save,
  Syringe,
  Trash2,
  Upload,
  User,
  Weight,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Patient } from '../data/mock';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

type PatientTab = 'info' | 'history' | 'vaccines' | 'documents' | 'billing';

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { patients, updatePatient } = useData();
  const patient = patients.find((currentPatient) => currentPatient.id === id);
  const [activeTab, setActiveTab] = useState<PatientTab>('info');
  const [showEdit, setShowEdit] = useState(false);

  if (!patient) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
          <User className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-[1.85rem] font-bold text-slate-900 sm:text-3xl">Paciente no encontrado</h2>
        <p className="mt-2 max-w-md text-slate-500">
          El paciente que buscas no existe o ya no esta disponible en el sistema.
        </p>
        <Link
          to="/patients"
          className="btn-touch mt-8 bg-teal-600 px-6 text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver a pacientes
        </Link>
      </div>
    );
  }

  const tabs: Array<{ id: PatientTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'info', label: 'Resumen', icon: User },
    { id: 'history', label: 'Historial', icon: Activity },
    { id: 'vaccines', label: 'Vacunas', icon: Syringe },
    { id: 'documents', label: 'Documentos', icon: File },
    { id: 'billing', label: 'Cobros', icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 sm:space-y-8">
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Link
              to="/patients"
              className="btn-icon-touch shrink-0 border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[1.8rem] font-bold tracking-tight text-slate-900 sm:text-3xl">{patient.name}</h1>
                <span
                  className={[
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide',
                    patient.status === 'active'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {patient.status === 'active' ? 'Activo' : 'Archivado'}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
                <span>{patient.species === 'Dog' ? 'Perro' : patient.species === 'Cat' ? 'Gato' : patient.species}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{patient.breed}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{patient.weight} kg</span>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Expediente listo para consulta rapida, con acciones clave y contexto clinico sin forzar scroll lateral en movil.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() => setShowEdit(true)}
              className="btn-touch w-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
            <button
              onClick={() => updatePatient(patient.id, { status: patient.status === 'active' ? 'archived' : 'active' })}
              className="btn-touch w-full border border-orange-100 bg-white text-orange-600 shadow-sm transition-all hover:bg-orange-50 sm:w-auto"
            >
              {patient.status === 'active' ? 'Archivar' : 'Activar'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <aside className="space-y-5 xl:col-span-1">
          <nav className="grid grid-cols-2 gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-3 xl:block xl:space-y-1 xl:p-2.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all xl:flex xl:w-full xl:justify-start',
                  activeTab === tab.id
                    ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                <div
                  className={[
                    'rounded-xl p-1.5',
                    activeTab === tab.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  <tab.icon className="h-4 w-4" />
                </div>
                <span className="whitespace-normal text-left">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="ml-auto hidden h-4 w-4 opacity-50 xl:block" />}
              </button>
            ))}
          </nav>

          {patient.photos && patient.photos.length > 0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                <ImageIcon className="h-4 w-4 text-teal-600" />
                Fotos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {patient.photos.slice(0, 4).map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={photo}
                      alt={`${patient.name} ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-lg">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-500/25 blur-3xl" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Siguiente hito</p>
              <h3 className="mt-3 text-lg font-bold">Proxima vacuna</h3>
              <p className="mt-2 text-slate-300">
                {format(parseISO(patient.next_vaccine), "d 'de' MMMM", { locale: es })}
              </p>
              <button className="btn-touch mt-5 w-full bg-white/10 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20">
                Ver agenda
              </button>
            </div>
          </div>
        </aside>

        <div className="xl:col-span-3">
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {activeTab === 'info' && <InfoTab patient={patient} />}
            {activeTab === 'history' && <HistoryTab patientId={patient.id} />}
            {activeTab === 'vaccines' && <VaccinesTab patientId={patient.id} />}
            {activeTab === 'documents' && <DocumentsTab patientId={patient.id} />}
            {activeTab === 'billing' && <BillingTab patientId={patient.id} />}
          </div>
        </div>
      </section>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar paciente</DialogTitle>
          </DialogHeader>
          <EditPatientForm patient={patient} onClose={() => setShowEdit(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditPatientForm({ patient, onClose }: { patient: Patient; onClose: () => void }) {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updatePatient(patient.id, { ...form, weight: parseFloat(String(form.weight)) });
    toast.success('Paciente actualizado');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Nombre</label>
          <input
            className="field-touch border border-slate-200 px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Raza</label>
          <input
            className="field-touch border border-slate-200 px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={form.breed}
            onChange={(event) => setForm({ ...form, breed: event.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Peso (kg)</label>
        <input
          type="number"
          step="0.1"
          className="field-touch border border-slate-200 px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          value={form.weight}
          onChange={(event) => setForm({ ...form, weight: parseFloat(event.target.value) })}
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Datos del tutor</p>
        <div className="space-y-3">
          <input
            placeholder="Nombre"
            className="field-touch border border-slate-200 bg-white px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={form.owner_name}
            onChange={(event) => setForm({ ...form, owner_name: event.target.value })}
          />
          <input
            placeholder="Telefono"
            className="field-touch border border-slate-200 bg-white px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={form.owner_phone}
            onChange={(event) => setForm({ ...form, owner_phone: event.target.value })}
          />
          <input
            placeholder="Email"
            type="email"
            className="field-touch border border-slate-200 bg-white px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            value={form.owner_email}
            onChange={(event) => setForm({ ...form, owner_email: event.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Notas</label>
        <textarea
          rows={3}
          className="field-touch border border-slate-200 px-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          placeholder="Alergias, condiciones especiales..."
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="btn-touch w-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-touch w-full bg-teal-600 text-white transition-colors hover:bg-teal-700"
        >
          <Save className="h-4 w-4" />
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function InfoTab({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
          <div className="h-6 w-1 rounded-full bg-teal-500" />
          Datos del paciente
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard
            icon={Calendar}
            label="Fecha de nacimiento"
            value={format(parseISO(patient.birth_date), 'dd MMMM yyyy', { locale: es })}
          />
          <InfoCard icon={Weight} label="Peso actual" value={`${patient.weight} kg`} />
          <InfoCard icon={User} label="Especie" value={patient.species} />
          <InfoCard icon={FileText} label="Raza" value={patient.breed} />
        </div>
      </section>

      <section className="border-t border-slate-100 pt-8">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
          <div className="h-6 w-1 rounded-full bg-indigo-500" />
          Datos del propietario
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ContactCard icon={User} label="Nombre" value={patient.owner_name} />
          <ContactCard icon={Phone} label="Telefono" value={patient.owner_phone} />
          {patient.owner_email && <ContactCard icon={Mail} label="Email" value={patient.owner_email} />}
        </div>
      </section>

      <section className="rounded-[24px] border border-yellow-100 bg-yellow-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-yellow-100 p-2 text-yellow-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-800">Notas privadas</h4>
            <p className="mt-2 leading-6 text-yellow-700">{patient.notes || 'Sin notas registradas para este paciente.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HistoryTab({ patientId }: { patientId: string }) {
  const { clinicalRecords } = useData();
  const records = clinicalRecords.filter((record) => record.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-slate-900">Consultas recientes</h3>
        <button className="btn-touch w-full bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition-colors hover:bg-teal-700 sm:w-auto">
          <Plus className="h-4 w-4" />
          Nueva consulta
        </button>
      </div>

      {records.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center sm:p-14">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Activity className="h-8 w-8 text-slate-300" />
          </div>
          <h4 className="font-bold text-slate-900">Sin historial clinico</h4>
          <p className="mt-2 text-sm text-slate-500">Este paciente aun no tiene registros medicos.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {records.map((record) => (
            <article key={record.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                    {format(parseISO(record.date), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <h4 className="mt-2 text-lg font-bold text-slate-800">{record.diagnosis}</h4>
                </div>
                <button className="btn-touch-compact w-fit border border-slate-200 px-3 text-slate-600 transition-colors hover:bg-slate-50">
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Tratamiento</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-slate-700">{record.treatment}</div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Notas</p>
                  <p className="leading-6 text-slate-600">{record.notes}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function VaccinesTab({ patientId }: { patientId: string }) {
  const { vaccines } = useData();
  const patientVaccines = vaccines.filter((vaccine) => vaccine.patient_id === patientId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="rounded-[26px] border border-orange-100 bg-orange-50/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Proximas vacunas</h3>
            <p className="text-sm text-slate-500">Control preventivo y seguimiento anual.</p>
          </div>
          <button className="btn-touch w-full bg-white text-orange-700 shadow-sm transition-colors hover:bg-orange-100 sm:w-auto">
            Programar
          </button>
        </div>

        {patientVaccines[0] && (
          <div className="mt-4 rounded-[22px] border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-500">
                  <Syringe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{patientVaccines[0].name}</p>
                  <p className="text-sm text-slate-500">
                    Vence:{' '}
                    {patientVaccines[0].next_dose
                      ? format(parseISO(patientVaccines[0].next_dose), 'dd MMM yyyy', { locale: es })
                      : 'Sin fecha'}
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">
                Pendiente
              </span>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-5 text-lg font-bold text-slate-800">Historial de vacunacion</h3>

        <div className="space-y-3 md:hidden">
          {patientVaccines.map((vaccine) => (
            <article key={vaccine.id} className="rounded-[24px] border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{vaccine.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{format(parseISO(vaccine.date), 'dd/MM/yyyy')}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{vaccine.batch_number}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">Veterinario: {vaccine.veterinarian}</p>
            </article>
          ))}
        </div>

        <div className="table-scroll hidden overflow-hidden rounded-[24px] border border-slate-200 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Vacuna</th>
                <th className="px-6 py-4 font-semibold">Lote</th>
                <th className="px-6 py-4 font-semibold">Veterinario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {patientVaccines.map((vaccine) => (
                <tr key={vaccine.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{format(parseISO(vaccine.date), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 text-slate-600">{vaccine.name}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{vaccine.batch_number}</td>
                  <td className="px-6 py-4 text-slate-600">{vaccine.veterinarian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DocumentsTab({ patientId }: { patientId: string }) {
  const { documents, deleteDocument } = useData();
  const patientDocuments = documents.filter((document) => document.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-slate-900">Documentos del paciente</h3>
        <button
          onClick={() => toast.success('Subida de archivos simulada')}
          className="btn-touch w-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 sm:w-auto"
        >
          <Upload className="h-4 w-4" />
          Subir documento
        </button>
      </div>

      {patientDocuments.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center sm:p-14">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <File className="h-8 w-8 text-slate-300" />
          </div>
          <h4 className="font-bold text-slate-900">Sin documentos</h4>
          <p className="mt-2 text-sm text-slate-400">No hay documentos registrados para este paciente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {patientDocuments.map((document) => (
            <article key={document.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={[
                      'rounded-2xl p-2.5',
                      document.type === 'image' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600',
                    ].join(' ')}
                  >
                    {document.type === 'image' ? <ImageIcon className="h-5 w-5" /> : <File className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate font-bold text-slate-900">{document.name}</h4>
                    <p className="text-xs text-slate-500">{format(parseISO(document.uploaded_date), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    deleteDocument(document.id);
                    toast.success('Documento eliminado');
                  }}
                  className="rounded-xl p-2 text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {document.type === 'image' && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                  <img src={document.url} alt={document.name} className="h-40 w-full object-cover" />
                </div>
              )}

              {document.description && <p className="mt-4 text-sm leading-6 text-slate-600">{document.description}</p>}

              <button className="btn-touch mt-4 w-full bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100">
                <Download className="h-4 w-4" />
                Descargar
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function BillingTab({ patientId }: { patientId: string }) {
  const { transactions } = useData();
  const patientTransactions = transactions.filter((transaction) => transaction.patient_id === patientId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-slate-900">Historial de pagos</h3>
        <button className="btn-touch w-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 sm:w-auto">
          <DollarSign className="h-4 w-4" />
          Registrar cobro
        </button>
      </div>

      {patientTransactions.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-400 sm:p-14">
          No hay transacciones registradas.
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {patientTransactions.map((transaction) => (
              <article key={transaction.id} className="rounded-[24px] border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{transaction.description}</p>
                    <p className="mt-1 text-sm text-slate-500">{format(parseISO(transaction.date), 'dd/MM/yyyy')}</p>
                  </div>
                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-xs font-bold uppercase',
                      transaction.status === 'paid'
                        ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                        : 'border border-red-100 bg-red-50 text-red-700',
                    ].join(' ')}
                  >
                    {transaction.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
                <p className={`mt-4 text-lg font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </p>
              </article>
            ))}
          </div>

          <div className="table-scroll hidden overflow-hidden rounded-[24px] border border-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Concepto</th>
                  <th className="px-6 py-4 font-semibold">Monto</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {patientTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{format(parseISO(transaction.date), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-slate-600">{transaction.description}</td>
                    <td className={`px-6 py-4 font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase',
                          transaction.status === 'paid'
                            ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border border-red-100 bg-red-50 text-red-700',
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
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon className="h-5 w-5 text-teal-500" />
        <span>{value}</span>
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="break-words text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
