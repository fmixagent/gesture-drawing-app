const getFilesFromDir = async (folderPath, filePaths: string[] = []): Promise<string[]> => {
  const fileList = await window.api.readDirFileNames(folderPath);
  for (const file of fileList) {
    const path = `${folderPath}\\${file}`;
    if (window.api.isDirectory(path)) {
      await getFilesFromDir(path, filePaths);
    } else {
      filePaths.push(path);
    }
  }
  return filePaths;
};

const selectFolder = async (): Promise<string | null> => {
  const folderPath = await window.api.selectDirectory();
  if (!folderPath) {
    return null;
  }
  return folderPath;
};

const fsService = {
  getFilesFromDir,
  selectFolder,
};

export default fsService;
