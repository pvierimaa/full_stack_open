interface BodyValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BodyValues => {
  if (args.length !== 4) throw new Error('Please provide both height and weight.');

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive numbers.');
  }

  return {
    height,
    weight,
  };
};

const calculateBmi = (height: number, weight: number): string => {
  const BMI: number = weight / ((height / 100) * (height / 100));

  if (BMI <= 18.4) {
    return 'Underweight';
  }
  if (BMI >= 18.5 && BMI <= 24.9) {
    return 'Normal range';
  }
  if (BMI >= 25.0 && BMI <= 29.9) {
    return 'Overweight';
  }
  if (BMI >= 30.0) {
    return 'Obese';
  }

  return 'Unknown BMI range';
};

try {
  const { height, weight } = parseArguments(process.argv);

  const result = calculateBmi(height, weight);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;
