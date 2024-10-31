import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { z } from 'zod';
import { NewPatientSchema, EntrySchema } from '../utils';
import { NewPatient, NonSensitivePatient, Patient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else {
    next(error);
  }
};

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

const parseDiagnosisCodes = (object: unknown): Array<string> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [];
  }

  return (object as { diagnosisCodes: Array<string> }).diagnosisCodes;
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    EntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  '/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, unknown>,
    res: Response<Patient | { error: string }>
  ): void => {
    const { id } = req.params;
    const patient = patientService.findById(id);

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    try {
      const validatedEntry = EntrySchema.parse(req.body);
      const diagnosisCodes = parseDiagnosisCodes(validatedEntry);

      const addedEntry = patientService.addEntryToPatient(id, {
        ...validatedEntry,
        diagnosisCodes,
      });
      if (addedEntry) {
        res.json(addedEntry);
      } else {
        res.status(500).json({ error: 'Failed to add entry to patient' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue) => issue.message).join(', ');
        res.status(400).json({ error: `Validation failed: ${errorMessages}` });
      } else {
        res.status(500).json({ error: 'Unexpected error occurred' });
      }
    }
  }
);

router.use(errorMiddleware);

export default router;
