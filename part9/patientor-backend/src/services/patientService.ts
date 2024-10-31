import patientData from '../../data/patients';
import { NewPatient, NonSensitivePatient, Patient, Entry, NewEntry } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatient: Patient = {
    id,
    ...entry,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addEntryToPatient = (patientId: string, newEntry: NewEntry): Patient | undefined => {
  const patient = findById(patientId);
  if (!patient) {
    return undefined;
  }

  const entryWithId: Entry = {
    id: uuid(),
    ...newEntry,
  };

  patient.entries.push(entryWithId);
  return patient;
};

export default {
  getNonSensitivePatients,
  addPatient,
  findById,
  addEntryToPatient,
};
