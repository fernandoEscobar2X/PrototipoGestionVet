import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Plus, User, Dog, Cat, Bird, AlertCircle, ChevronRight, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

export function Patients() {
  const { patients, addPatient } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'Dog' | 'Cat' | 'Bird' | 'Other'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    owner_name: '',
    owner_phone: '',
    weight: 0,
    birth_date: '',
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || patient.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const getSpeciesIcon = (species: string) => {
    switch(species) {
      case 'Dog': return Dog;
      case 'Cat': return Cat;
      case 'Bird': return Bird;
      default: return AlertCircle;
    }
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addPatient({
      ...newPatient,
      species: newPatient.species as any,
      owner_user_id: user.id,
      last_visit: new Date().toISOString(),
      next_vaccine: new Date().toISOString(),
      status: 'active'
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-700">
              <User className="w-6 h-6" />
            </div>
            Pacientes
          </h1>
          <p className="text-slate-500 mt-1 text-lg">Administra el expediente clínico de tus mascotas</p>
        </div>
        
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-teal-600/20 font-medium">
              <Plus className="w-5 h-5" />
              Nuevo Paciente
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-2xl focus:outline-none animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-bold text-slate-900">Registrar Nuevo Paciente</Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </Dialog.Close>
              </div>
              
              <form onSubmit={handleCreatePatient} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nombre Mascota</label>
                    <input 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                      value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                      placeholder="Ej. Max"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Especie</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white"
                      value={newPatient.species}
                      onChange={e => setNewPatient({...newPatient, species: e.target.value})}
                    >
                      <option value="Dog">Perro</option>
                      <option value="Cat">Gato</option>
                      <option value="Bird">Ave</option>
                      <option value="Other">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Raza</label>
                    <input 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                      value={newPatient.breed}
                      onChange={e => setNewPatient({...newPatient, breed: e.target.value})}
                      placeholder="Ej. Golden Retriever"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Peso (kg)</label>
                    <input 
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                      value={newPatient.weight || ''}
                      onChange={e => setNewPatient({...newPatient, weight: parseFloat(e.target.value)})}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Fecha de Nacimiento</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    value={newPatient.birth_date}
                    onChange={e => setNewPatient({...newPatient, birth_date: e.target.value})}
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Datos del Propietario</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nombre Dueño</label>
                      <input 
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        value={newPatient.owner_name}
                        onChange={e => setNewPatient({...newPatient, owner_name: e.target.value})}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Teléfono</label>
                      <input 
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        value={newPatient.owner_phone}
                        onChange={e => setNewPatient({...newPatient, owner_phone: e.target.value})}
                        placeholder="555-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button type="button" className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                    Guardar Paciente
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por nombre de mascota o dueño..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 placeholder-slate-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'Dog', 'Cat', 'Bird', 'Other'].map(type => (
            <button
              key={type}
              onClick={() => setFilterSpecies(type as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all whitespace-nowrap
                ${filterSpecies === type 
                  ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              {type === 'all' ? 'Todos' : type === 'Dog' ? 'Perros' : type === 'Cat' ? 'Gatos' : type === 'Bird' ? 'Aves' : 'Otros'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => {
          const Icon = getSpeciesIcon(patient.species);
          return (
            <Link 
              to={`/patients/${patient.id}`}
              key={patient.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-teal-200 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                <ChevronRight className="text-teal-400" />
              </div>
              
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${patient.species === 'Dog' ? 'bg-blue-50 text-blue-600' :
                    patient.species === 'Cat' ? 'bg-purple-50 text-purple-600' :
                    patient.species === 'Bird' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-800 truncate">{patient.name}</h3>
                  <p className="text-sm text-slate-500 font-medium truncate">{patient.breed}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{patient.owner_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 w-fit px-2 py-1 rounded-md">
                      <span>Última visita:</span>
                      <span className="font-medium text-slate-600">{patient.last_visit.split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {filteredPatients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No se encontraron pacientes</h3>
          <p className="text-slate-500 mt-1">Intenta ajustar los filtros o agrega un nuevo paciente.</p>
        </div>
      )}
    </div>
  );
}
