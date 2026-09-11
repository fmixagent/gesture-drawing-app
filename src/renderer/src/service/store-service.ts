import { environment } from '@renderer/environments/environment';
import storeServiceElectron from './store-service.electron';
import storeServiceWeb from './store-service.web';

const storeService = environment.webVersion ? storeServiceWeb : storeServiceElectron;

export default storeService;
