interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: string[]): { target: number; daily_exercises: number[] } => {
  if (args.length < 4)
    throw new Error('Please provide a target and at least one day of exercise hours.');

  const target = Number(args[2]);
  const daily_exercises = args.slice(3).map(Number);

  if (isNaN(target) || daily_exercises.some(isNaN)) {
    throw new Error('Target and daily exercises must be valid numbers.');
  }

  return { target, daily_exercises };
};

const calculateExercises = (target: number, args: number[]): Result => {
  const trainingDays = args.filter((hours) => hours > 0).length;
  const totalHours = args.reduce((sum, hours) => sum + hours, 0);
  const averageHours = totalHours / args.length;

  const success = averageHours >= target;

  let rating = 3;
  let ratingDescription = 'Good job, keep it up!';

  if (averageHours < target) {
    rating = 2;
    ratingDescription = 'Not too bad, but there’s room for improvement.';
  }

  if (averageHours / target <= 0.5) {
    rating = 1;
    ratingDescription = 'Needs significant improvement, try harder!';
  }

  return {
    periodLength: args.length,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: averageHours,
  };
};

try {
  const { target, daily_exercises } = parseArguments(process.argv);

  const result = calculateExercises(target, daily_exercises);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;
