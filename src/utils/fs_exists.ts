import fs from 'fs';
import path from 'path';

// filePath must be a absolute path
function fsExists(filePath: string, ext?: string) {
  const fileExt = path.extname(filePath);

  if (!fileExt && ext) {
    filePath += ext;
  }

  try {
    fs.accessSync(filePath);
  } catch (e) {
    return false;
  }
  return true;
}

export default fsExists;
