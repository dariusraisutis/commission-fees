import { getAllFees } from '../services/FeesProvider';
import readFile from '../services/ReadFile';

const run = async (filePath) => {
  if (!filePath) {
    throw new Error('File path was not provided');
  }
  try {
    const file = await readFile(filePath);
    return await getAllFees(file);
  } catch(error) {
    throw new Error(error.message);
  }
}

export default run;