import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Patient, 
  Appointment, 
  Transaction, 
  ClinicalRecord,
  Vaccine,
  Document,
  Reminder,
  MOCK_PATIENTS, 
  MOCK_APPOINTMENTS, 
  MOCK_TRANSACTIONS, 
  MOCK_CLINICAL_RECORDS,
  MOCK_VACCINES,
  MOCK_DOCUMENTS,
  MOCK_REMINDERS,
  User,
  MOCK_USER
} from '../data/mock';

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  transactions: Transaction[];
  clinicalRecords: ClinicalRecord[];
  vaccines: Vaccine[];
  documents: Document[];
  reminders: Reminder[];
  
  // Actions - Patients
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Actions - Appointments
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Actions - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  
  // Actions - Clinical Records
  addClinicalRecord: (record: Omit<ClinicalRecord, 'id'>) => void;
  updateClinicalRecord: (id: string, record: Partial<ClinicalRecord>) => void;
  
  // Actions - Vaccines
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  updateVaccine: (id: string, vaccine: Partial<Vaccine>) => void;
  deleteVaccine: (id: string) => void;
  
  // Actions - Documents
  addDocument: (document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
  
  // Actions - Reminders
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('vet_app_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('vet_app_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('vet_app_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>(() => {
    const saved = localStorage.getItem('vet_app_records');
    return saved ? JSON.parse(saved) : MOCK_CLINICAL_RECORDS;
  });

  const [vaccines, setVaccines] = useState<Vaccine[]>(() => {
    const saved = localStorage.getItem('vet_app_vaccines');
    return saved ? JSON.parse(saved) : MOCK_VACCINES;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('vet_app_documents');
    return saved ? JSON.parse(saved) : MOCK_DOCUMENTS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('vet_app_reminders');
    return saved ? JSON.parse(saved) : MOCK_REMINDERS;
  });

  // Persistence effects
  useEffect(() => localStorage.setItem('vet_app_patients', JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem('vet_app_appointments', JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem('vet_app_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('vet_app_records', JSON.stringify(clinicalRecords)), [clinicalRecords]);
  useEffect(() => localStorage.setItem('vet_app_vaccines', JSON.stringify(vaccines)), [vaccines]);
  useEffect(() => localStorage.setItem('vet_app_documents', JSON.stringify(documents)), [documents]);
  useEffect(() => localStorage.setItem('vet_app_reminders', JSON.stringify(reminders)), [reminders]);

  // Actions - Patients
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `p_${Date.now()}` };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // Actions - Appointments
  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newApt = { ...apt, id: `apt_${Date.now()}` };
    setAppointments(prev => [...prev, newApt]);
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Actions - Transactions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: `tx_${Date.now()}` };
    setTransactions(prev => [...prev, newTx]);
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  // Actions - Clinical Records
  const addClinicalRecord = (rec: Omit<ClinicalRecord, 'id'>) => {
    const newRec = { ...rec, id: `rec_${Date.now()}` };
    setClinicalRecords(prev => [...prev, newRec]);
  };

  const updateClinicalRecord = (id: string, data: Partial<ClinicalRecord>) => {
    setClinicalRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  // Actions - Vaccines
  const addVaccine = (vac: Omit<Vaccine, 'id'>) => {
    const newVac = { ...vac, id: `vac_${Date.now()}` };
    setVaccines(prev => [...prev, newVac]);
  };

  const updateVaccine = (id: string, data: Partial<Vaccine>) => {
    setVaccines(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVaccine = (id: string) => {
    setVaccines(prev => prev.filter(v => v.id !== id));
  };

  // Actions - Documents
  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc = { ...doc, id: `doc_${Date.now()}` };
    setDocuments(prev => [...prev, newDoc]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Actions - Reminders
  const addReminder = (rem: Omit<Reminder, 'id'>) => {
    const newRem = { ...rem, id: `rem_${Date.now()}` };
    setReminders(prev => [...prev, newRem]);
  };

  const updateReminder = (id: string, data: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataContext.Provider value={{
      patients,
      appointments,
      transactions,
      clinicalRecords,
      vaccines,
      documents,
      reminders,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addTransaction,
      updateTransaction,
      addClinicalRecord,
      updateClinicalRecord,
      addVaccine,
      updateVaccine,
      deleteVaccine,
      addDocument,
      deleteDocument,
      addReminder,
      updateReminder,
      deleteReminder,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}