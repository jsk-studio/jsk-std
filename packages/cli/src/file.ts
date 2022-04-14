import fs from 'fs'
import path from 'path'
import { folderIO } from './folder'

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
}

function fileCopy(from: string, to: string, opts: FileCopyOptions) {
  for (const file of opts.files) {
    const target = [].concat(file)
    const frompath = path.resolve(from, target[0])
    const topath = path.resolve(to, target[1] || target[0])
    let filetext = fileRead(frompath)
    if (filetext !== null) {
      folderIO.create(topath.split('/').slice(0, -1).join('/'))
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

function fileModify(fpath: string, opts: FileModifyOptions, replacer: any) {
  fpath = path.join(fpath);
  if (opts.files && path.dirname(fpath)) {
    for (const file of opts.files) {
      const mpath = path.resolve(fpath, file)
      const filetext = fileRead(mpath, opts)
      if (filetext !== null) {
        fileWrite(mpath, replacer(filetext) || filetext, opts)
      }
    }
  } else {
    const filetext = fileRead(fpath, opts)
    if (filetext !== null) {
      fileWrite(fpath, replacer(filetext) || filetext, opts)
    }
  }
}

export const fileIO = {
  read: fileRead,
  write: fileWrite,
  copy: fileCopy,
  modify: fileModify,
}

type IStringifyOptions = {
  space?: number,
  replacer?: any,
  quotes?: boolean,
}

export function x_stringify(obj: any, opts: IStringifyOptions = {}): string {
  if (typeof obj !== "object" || opts.quotes !== false) {
      // not an object, stringify using native function
      let text = JSON.stringify(obj, opts.replacer, opts.space);
      return text
  }
  const split = opts.space ? '\n' : ''
  let spaceText = ''
  if (opts.space) {
    for (let i = 0; i < opts.space; i++) {
      spaceText += ' '
    }
  }
  // @ts-ignore
  const spaceStep = opts.spaceStep || opts.space
  const endSpaceText = spaceStep ? spaceText.slice(0, -spaceStep) : ''
  const deepOpts = {
    ...opts,
    spaceStep,
    space: opts.space ? opts.space + spaceStep  : opts.space,
  }
  if (Array.isArray(obj)) {
    const text = obj
      .map(o => `${spaceText}${x_stringify(o, deepOpts)}`)
      .join(`,${split}`);
    return `[${split}${text}${split}${endSpaceText}]`
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const text = Object
      .keys(obj)
      .map(key => `${spaceText}${key}: ${x_stringify(obj[key], deepOpts)}`)
      .join(`,${split}`);
  return `{${split}${text}${split}${endSpaceText}}`;
}
