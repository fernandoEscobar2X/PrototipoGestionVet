import { addDays, subDays, format } from 'date-fns';

// Tipos base para simular la estructura de DB
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'assistant' | 'vet';
}

export interface Patient {
  id: string;
  owner_user_id: string; // El campo solicitado
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  birth_date: string;
  weight: number;
  last_visit: string;
  next_vaccine: string;
  status: 'active' | 'archived';
  photos?: string[]; // URLs de fotos
  notes?: string;
}

export interface Appointment {
  id: string;
  owner_user_id: string;
  patient_id: string;
  date: string; // ISO string
  type: 'Consultation' | 'Vaccine' | 'Surgery' | 'Checkup';
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
}

export interface Transaction {
  id: string;
  owner_user_id: string;
  patient_id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'paid' | 'pending';
}

export interface ClinicalRecord {
  id: string;
  owner_user_id: string;
  patient_id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

// Nuevas entidades
export interface Vaccine {
  id: string;
  owner_user_id: string;
  patient_id: string;
  name: string;
  date: string;
  next_dose?: string;
  batch_number: string;
  veterinarian: string;
  notes?: string;
}

export interface Document {
  id: string;
  owner_user_id: string;
  patient_id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string; // Simulado
  uploaded_date: string;
  description?: string;
}

export interface Reminder {
  id: string;
  owner_user_id: string;
  patient_id?: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'vaccine' | 'checkup' | 'surgery_followup' | 'medication' | 'call_owner' | 'other';
  status: 'pending' | 'completed' | 'dismissed';
  auto_generated: boolean; // true si fue creada automáticamente
  notification_sent?: boolean;
  created_at: string;
}

// Datos Mock
const CURRENT_USER_ID = 'user_001';

export const MOCK_USER: User = {
  id: CURRENT_USER_ID,
  email: 'vet@example.com',
  name: 'Dr. Veterinario',
  role: 'vet',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p_001',
    owner_user_id: CURRENT_USER_ID,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    owner_name: 'Juan Pérez',
    owner_phone: '555-0101',
    owner_email: 'juan.perez@email.com',
    birth_date: '2020-05-10',
    weight: 28.5,
    last_visit: subDays(new Date(), 10).toISOString(),
    next_vaccine: addDays(new Date(), 20).toISOString(),
    status: 'active',
    photos: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400'],
    notes: 'Alérgico al pollo',
  },
  {
    id: 'p_002',
    owner_user_id: CURRENT_USER_ID,
    name: 'Luna',
    species: 'Cat',
    breed: 'Siames',
    owner_name: 'Ana López',
    owner_phone: '555-0102',
    owner_email: 'ana.lopez@email.com',
    birth_date: '2019-08-15',
    weight: 4.2,
    last_visit: subDays(new Date(), 45).toISOString(),
    next_vaccine: addDays(new Date(), 5).toISOString(), // Próxima acción obligatoria
    status: 'active',
    photos: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'],
  },
  {
    id: 'p_003',
    owner_user_id: CURRENT_USER_ID,
    name: 'Rocky',
    species: 'Dog',
    breed: 'Bulldog',
    owner_name: 'Carlos Ruiz',
    owner_phone: '555-0103',
    owner_email: 'carlos.ruiz@email.com',
    birth_date: '2021-02-20',
    weight: 12.0,
    last_visit: subDays(new Date(), 2).toISOString(),
    next_vaccine: addDays(new Date(), 100).toISOString(),
    status: 'active',
    photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'],
  },
  {
    id: 'p_004',
    owner_user_id: CURRENT_USER_ID,
    name: 'Coco',
    species: 'Bird',
    breed: 'Parrot',
    owner_name: 'Maria Garcia',
    owner_phone: '555-0104',
    owner_email: 'maria.garcia@email.com',
    birth_date: '2022-01-10',
    weight: 0.5,
    last_visit: subDays(new Date(), 100).toISOString(),
    next_vaccine: addDays(new Date(), 10).toISOString(),
    status: 'active',
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    date: new Date().toISOString(), // Hoy
    type: 'Checkup',
    status: 'pending',
    notes: 'Revisión general',
  },
  {
    id: 'apt_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_002',
    date: addDays(new Date(), 1).toISOString(), // Mañana
    type: 'Vaccine',
    status: 'pending',
    notes: 'Vacuna anual rabia',
  },
  {
    id: 'apt_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_003',
    date: addDays(new Date(), 2).toISOString(),
    type: 'Surgery',
    status: 'pending',
    notes: 'Esterilización',
  },
  {
    id: 'apt_004',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_004',
    date: subDays(new Date(), 1).toISOString(),
    type: 'Consultation',
    status: 'completed',
    notes: 'Problema en ala',
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    date: subDays(new Date(), 1).toISOString(),
    description: 'Consulta General',
    amount: 50,
    type: 'income',
    status: 'paid',
  },
  {
    id: 'tx_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_002',
    date: subDays(new Date(), 2).toISOString(),
    description: 'Vacuna Triple Felina',
    amount: 35,
    type: 'income',
    status: 'paid',
  },
  {
    id: 'tx_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_003',
    date: subDays(new Date(), 0).toISOString(),
    description: 'Antiparasitario',
    amount: 15,
    type: 'income',
    status: 'pending', // Adeudo
  },
  {
    id: 'tx_004',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'null', // Gasto general
    date: subDays(new Date(), 5).toISOString(),
    description: 'Compra de Insumos',
    amount: 150,
    type: 'expense',
    status: 'paid',
  }
];

export const MOCK_CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    id: 'rec_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    date: subDays(new Date(), 60).toISOString(),
    diagnosis: 'Otitis externa',
    treatment: 'Limpieza y gotas antibióticas x 7 días',
    notes: 'Dueño reporta rascado excesivo',
  },
  {
    id: 'rec_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_002',
    date: subDays(new Date(), 30).toISOString(),
    diagnosis: 'Control de peso',
    treatment: 'Dieta baja en calorías',
    notes: 'Sobrepeso leve detectado',
  },
  {
    id: 'rec_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_003',
    date: subDays(new Date(), 2).toISOString(),
    diagnosis: 'Esterilización',
    treatment: 'Cirugía exitosa. Control en 7 días.',
    notes: 'Usar collar isabelino por 10 días',
  },
];

// Vacunas
export const MOCK_VACCINES: Vaccine[] = [
  {
    id: 'vac_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    name: 'Rabia',
    date: subDays(new Date(), 350).toISOString(),
    next_dose: addDays(new Date(), 15).toISOString(),
    batch_number: 'R-2023-001',
    veterinarian: 'Dr. Veterinario',
  },
  {
    id: 'vac_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    name: 'Séxtuple',
    date: subDays(new Date(), 365).toISOString(),
    next_dose: addDays(new Date(), 0).toISOString(),
    batch_number: 'S6-2023-045',
    veterinarian: 'Dr. Veterinario',
  },
  {
    id: 'vac_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_002',
    name: 'Triple Felina',
    date: subDays(new Date(), 340).toISOString(),
    next_dose: addDays(new Date(), 25).toISOString(),
    batch_number: 'TF-2023-012',
    veterinarian: 'Dr. Veterinario',
  },
];

// Documentos
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    name: 'Radiografía Cadera',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600',
    uploaded_date: subDays(new Date(), 15).toISOString(),
    description: 'Rayos X para evaluar displasia',
  },
  {
    id: 'doc_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    name: 'Análisis de Sangre',
    type: 'pdf',
    url: '#',
    uploaded_date: subDays(new Date(), 30).toISOString(),
    description: 'Hemograma completo',
  },
  {
    id: 'doc_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_003',
    name: 'Foto Pre-Cirugía',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
    uploaded_date: subDays(new Date(), 3).toISOString(),
    description: 'Antes de esterilización',
  },
];

// Recordatorios
export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem_001',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_001',
    title: 'Vacuna Rabia - Max',
    description: 'Aplicar refuerzo anual de vacuna antirrábica',
    due_date: addDays(new Date(), 15).toISOString(),
    priority: 'high',
    type: 'vaccine',
    status: 'pending',
    auto_generated: true,
    notification_sent: false,
    created_at: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'rem_002',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_003',
    title: 'Revisión Post-Operatoria Rocky',
    description: 'Control de puntos de sutura. Verificar inflamación.',
    due_date: addDays(new Date(), 5).toISOString(),
    priority: 'urgent',
    type: 'surgery_followup',
    status: 'pending',
    auto_generated: true,
    notification_sent: false,
    created_at: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'rem_003',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_002',
    title: 'Llamar a Ana López',
    description: 'Confirmar asistencia a cita de Luna el próximo martes',
    due_date: addDays(new Date(), 1).toISOString(),
    priority: 'medium',
    type: 'call_owner',
    status: 'pending',
    auto_generated: false,
    notification_sent: false,
    created_at: subDays(new Date(), 1).toISOString(),
  },
  {
    id: 'rem_004',
    owner_user_id: CURRENT_USER_ID,
    patient_id: 'p_004',
    title: 'Coco sin visita hace 3 meses',
    description: 'Paciente sin control desde hace 100 días. Contactar al dueño.',
    due_date: addDays(new Date(), 0).toISOString(),
    priority: 'medium',
    type: 'checkup',
    status: 'pending',
    auto_generated: true,
    notification_sent: false,
    created_at: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'rem_005',
    owner_user_id: CURRENT_USER_ID,
    title: 'Revisar inventario vacunas',
    description: 'Stock bajo de vacuna Rabia y Séxtuple',
    due_date: addDays(new Date(), 2).toISOString(),
    priority: 'high',
    type: 'other',
    status: 'pending',
    auto_generated: false,
    notification_sent: false,
    created_at: subDays(new Date(), 1).toISOString(),
  },
];