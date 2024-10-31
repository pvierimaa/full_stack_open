import { z } from 'zod';
import { Gender } from './types';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const HealthCheckEntrySchema = z.object({
  type: z.literal('HealthCheck'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  healthCheckRating: z.number().min(0).max(3),
});

const HospitalEntrySchema = z.object({
  type: z.literal('Hospital'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntrySchema = z.object({
  type: z.literal('OccupationalHealthcare'),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

export const EntrySchema = z.union([
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);
