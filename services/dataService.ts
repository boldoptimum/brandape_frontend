import { config } from '../config';
import { httpDataService } from './httpDataService';
import { fileDataService } from './fileDataService';

export const dataService = config.IS_TEST_ENV ? fileDataService : httpDataService;
