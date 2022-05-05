import fs from 'fs'
import path from 'path'
import { folder_io } from './folder'
import { x_stringify } from '@jsk-std/x'

export const file_io = {
  read: fileRead,
  write: fileWrite,
  copy: fileCopy,
  modify: fileModify,
}

type FileMode = 'js' | 'json' | 'text'
type FileOptions = {
  mode?: FileMode,
}

type FileWriteOptions = FileOptions & {
  force?: boolean
}

type FileCopyOptions = {
  files: any[],
  force?: boolean,
}
type FileModifyOptions = FileOptions & {
  files?: any[],
  replacer: (val: any, mpath?: string) => any,
}

function fileCopy(from: string, to: string, opts: FileCopyOptions) {
  for (const file of opts.files) {
    const target = [].concat(file)
    const frompath = path.resolve(from, target[0])
    const topath = path.resolve(to, target[1] || target[0])
    let filetext = fileRead(frompath)
    if (filetext !== null) {
      folder_io.create(topath.split('/').slice(0, -1).join('/'))
      fileWrite(topath, filetext)
    }
  }
}

function fileRead(fpath: string, opts: FileOptions = {}) {
  fpath = path.join(fpath);
  if (!fs.existsSync(fpath)) {
    return null
  }
  if (opts.mode === 'js') {
    return require(fpath)
  }
  const filetext = fs.readFileSync(fpath, { encoding: 'utf-8' })
  if (opts.mode === 'json') {
    return JSON.parse(filetext || '{}')
  }
  return filetext
}

function fileWrite(fpath: string, obj: any, opts: FileWriteOptions = {}) {
  fpath = path.join(fpath);
  if (fs.existsSync(fpath) && opts.force === false) {
    return
  }
  let filestr = ''
  if (opts.mode === 'json') {
    filestr += x_stringify(obj, { space: 2 })
  } else if (opts.mode === 'js') {
    filestr += 'module.exports = '
    filestr += x_stringify(obj, { quotes: false, space: 2 })
  } else {
    filestr += obj
  }
  filestr += '\n'
  fs.writeFileSync(fpath, filestr, { encoding: 'utf-8' })
}

function fileModify(fpath: string, opts: FileModifyOptions) {
  const { replacer } = opts
  fpath = path.join(fpath);
  if (opts.files && path.dirname(fpath)) {
    for (const file of opts.files) {
      const mpath = path.resolve(fpath, file)
      const filetext = fileRead(mpath, opts)
      if (filetext !== null) {
        fileWrite(mpath, replacer(filetext, mpath) || filetext, opts)
      }
    }
  } else {
    const filetext = fileRead(fpath, opts)
    if (filetext !== null) {
      fileWrite(fpath, replacer(filetext, fpath) || filetext, opts)
    }
  }
}
