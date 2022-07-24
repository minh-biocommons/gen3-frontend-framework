import { createUseCoreDataHook } from '../../dataAccess';
import { fetchLoginProviders, selectLoginProvidersData} from './fenceSlice';

export const useFenceProviders = createUseCoreDataHook(
  fetchLoginProviders,
  selectLoginProvidersData,
);
