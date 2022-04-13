import fs from 'fs'
import path from 'path'

function folderCreate(fpath: string) {
  fpath = path.join(fpath);
  if (fs.existsSync(fpath)) {
    return true;
  } else {
    if (folderCreate(path.dirname(fpath))) {
      fs.mkdirSync(fpath);
      return true;
    }
    return false
  }
}

export const folderIO = {
  create: folderCreate
}
