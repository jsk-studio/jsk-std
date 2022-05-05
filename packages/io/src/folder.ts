import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

export const folder_io = {
  create: folderCreate,
  remove: rimraf.sync,
  list: folderList,
}

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

function folderList(fpath: string) {

}
