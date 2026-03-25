import { useState } from 'react';
import { Link } from 'react-router';
import { AlertCircle, Bird, Cat, ChevronRight, Dog, Plus, Search, User, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

export function Patients() {
  const { patients, addPatient } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Dog' | 'Cat' | 'Bird' | 'Other'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    owner_name: '',
    owner_phone: '',
    weight: 0,
    birth_date: '',
  });

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || patient.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case 'Dog':
        return Dog;
      case 'Cat':
        return Cat;
      case 'Bird':
        return Bird;
      default:
        return AlertCircle;
    }
  };

  const handleCreatePatient = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    addPatient({
      ...newPatient,
      species: newPatient.species as 'Dog' | 'Cat' | 'Bird' | 'Other',
      owner_user_id: user.id,
      last_visit: new Date().toISOString(),
      next_vaccine: new Date().toISOString(),
      status: 'active',
    });

    setIsModalOpen(false);
    setNewPatient({
      name: '',
      species: 'Dog',
      breed: '',
      owner_name: '',
      owner_phone: '',
      weight: 0,
      birth_date: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
            <div className="rounded-2xl bg-teal-100 p-2.5 text-teal-700">
              <User className="h-6 w-6" />
            </div>
            Pacientes
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Gestiona el expediente clinico y los datos del tutor con una vista limpia, filtrable y optimizada para
            consulta rapida desde el telefono.
          </p>
        </div>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 sm:w-auto">
              <Plus className="h-5 w-5" />
              Nuevo paciente
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm animate-in fade-in duration-200" />
            <Dialog.Content className="fixed inset-x-3 bottom-3 top-auto z-50 max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl outline-none animate-in slide-in-from-bottom-4 duration-200 sm:inset-x-[50%] sm:top-[50%] sm:bottom-auto sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <Dialog.Title className="text-xl font-bold text-slate-900">Registrar nuevo paciente</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-slate-500">
                    Captura solo la informacion esencial para no frenar la operacion en recepcion.
                  </Dialog.Description>
                </div>
                <Dialog.Close className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nombre de la mascota</label>
                    <input
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      value={newPatient.name}
                      onChange={(event) => setNewPatient({ ...newPatient, name: event.target.value })}
                      placeholder="Ej. Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Especie</label>
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      value={newPatient.species}
                      onChange={(event) => setNewPatient({ ...newPatient, species: event.target.value })}
                    >
                      <option value="Dog">Perro</option>
                      <option value="Cat">Gato</option>
                      <option value="Bird">Ave</option>
                      <option value="Other">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Raza</label>
                    <input
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      value={newPatient.breed}
                      onChange={(event) => setNewPatient({ ...newPatient, breed: event.target.value })}
                      placeholder="Ej. Golden Retriever"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      value={newPatient.weight || ''}
                      onChange={(event) => setNewPatient({ ...newPatient, weight: parseFloat(event.target.value) })}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Fecha de nacimiento</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    value={newPatient.birth_date}
                    onChange={(event) => setNewPatient({ ...newPatient, birth_date: event.target.value })}
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Tutor o propietario</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nombre</label>
                      <input
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        value={newPatient.owner_name}
                        onChange={(event) => setNewPatient({ ...newPatient, owner_name: event.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Telefono</label>
                      <input
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 transition-all outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        value={newPatient.owner_phone}
                        onChange={(event) => setNewPatient({ ...newPatient, owner_phone: event.target.value })}
                        placeholder="555-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:w-auto"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-teal-600 px-5 py-3 font-bold text-white shadow-lg shadow-teal-600/20 transition-colors hover:bg-teal-700 sm:w-auto"
                  >
                    Guardar paciente
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="group relative w-full flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
            <input
              type="text"
              placeholder="Buscar por mascota o tutor..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="mobile-chip-scroll w-full lg:w-auto lg:max-w-[48rem]">
            {['all', 'Dog', 'Cat', 'Bird', 'Other'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterSpecies(type as 'all' | 'Dog' | 'Cat' | 'Bird' | 'Other')}
                className={[
                  'rounded-2xl border px-4 py-2 text-sm font-semibold transition-all',
                  filterSpecies === type
                    ? 'border-teal-200 bg-teal-50 text-teal-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                ].join(' ')}
              >
                {type === 'all'
                  ? 'Todos'
                  : type === 'Dog'
                    ? 'Perros'
                    : type === 'Cat'
                      ? 'Gatos'
                      : type === 'Bird'
                        ? 'Aves'
                        : 'Otros'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.map((patient) => {
          const Icon = getSpeciesIcon(patient.species);

          return (
            <Link
              to={`/patients/${patient.id}`}
              key={patient.id}
              className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl sm:p-6"
            >
              <div className="absolute right-5 top-5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ChevronRight className="text-teal-400" />
              </div>

              <div className="flex items-start gap-4">
                <div
                  className={[
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm',
                    patient.species === 'Dog'
                      ? 'bg-blue-50 text-blue-600'
                      : patient.species === 'Cat'
                        ? 'bg-violet-50 text-violet-600'
                        : patient.species === 'Bird'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600',
                  ].join(' ')}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-slate-800">{patient.name}</h3>
                  <p className="truncate text-sm font-medium text-slate-500">{patient.breed}</p>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{patient.owner_name}</span>
                    </div>
                    <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                      <span className="shrink-0">Ultima visita</span>
                      <span className="truncate font-medium text-slate-700">{patient.last_visit.split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {filteredPatients.length === 0 && (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No encontramos pacientes</h3>
          <p className="mt-2 text-sm text-slate-500">Prueba otro filtro o crea un registro nuevo desde este mismo flujo.</p>
        </section>
      )}
    </div>
  );
}
