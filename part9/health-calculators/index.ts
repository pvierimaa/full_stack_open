import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();

app.use(express.json());

interface ExercisesRequest {
  daily_exercises: number[];
  target: number;
}

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }

  const bmiResult = calculateBmi(height, weight);

  res.send({
    weight: weight,
    height: height,
    bmi: bmiResult,
  });
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as ExercisesRequest;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (isNaN(Number(target))) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  for (const hours of daily_exercises) {
    if (isNaN(Number(hours))) {
      res.status(400).json({ error: 'malformatted parameters' });
      return;
    }
  }

  const result = calculateExercises(target, daily_exercises);
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
