import { environment } from '@renderer/environments/environment';
import fsServiceElectron from './fs-service.electron';
import fsServiceWeb from './fs-service.web';

const fsService = environment.webVersion ? fsServiceWeb : fsServiceElectron;

export default fsService;
