import { environment } from '@renderer/environments/environment';
import droppedFileServiceElectron from './dropped-file-service.electron';
import droppedFileServiceWeb from './dropped-file-service.web';

const droppedFileService = environment.webVersion
  ? droppedFileServiceWeb
  : droppedFileServiceElectron;

export default droppedFileService;
