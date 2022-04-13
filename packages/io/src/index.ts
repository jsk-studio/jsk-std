import fs from 'fs'
import path from 'path'
import { xArray, xTypeOf } from '@jsk-std/x'

type IFilter = RegExp | ((filename: string) => boolean)

function matchRule(url: string , filter?: IFilter) {
    return !filter
    || xTypeOf(filter, 'function') && filter(url)
    || xTypeOf(filter, 'regexp') && url.match(filter)
}

export function deleteFolderRecursive(url: string, filter?: IFilter) {
    let files = [];
    // 判断给定的路径是否存在
    if(fs.existsSync(url) ) {
        // 返回文件和子目录的数组
        files = fs.readdirSync(url);
        let emptied = true
        for (const file of files) {
            const curPath = path.join(url,file);
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath, filter);
            // 是文件delete file  
            } else if (matchRule(url, filter)) {
                fs.unlinkSync(curPath);
            } else {
                emptied = false
            }
        }
        if (emptied) {
            fs.rmdirSync(url);
        }
    } else {
        console.warn("Not Exists Path: " + url);
    }
}
export function deleteFileSync(url: string, filter?: IFilter) {
    if (!fs.existsSync(url)) {
        return
    }
    if (!fs.statSync(url).isDirectory()) {
        if (matchRule(url, filter)) {
            fs.unlinkSync(url);
        }
    } else {
        deleteFolderRecursive(url, filter)
    }
}

export function getFilesRecursive(url: string, filter?: IFilter) {
    if (!fs.statSync(url).isDirectory()) {
        return [url]
    }
    const files = fs.readdirSync(url)
    const filenames = [] as string[]
    for (const file of files) {
        const fname = path.join(url, file)
        if (fs.statSync(fname).isDirectory()) {
            filenames.push(...getFilesRecursive(fname, filter))
        } else if (matchRule(url, filter)) {
            filenames.push(fname)
        }
    }
    return filenames
}

export function createFolderRecursive(dirname: string) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (createFolderRecursive(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
      return false
    }
}

export type ICreateOptions = {
    force?: boolean
}

export function createFoldersSync(urls: string | string[], opts: ICreateOptions = {}) {
    const { force } = opts
    for (const url of xArray(urls)) {
        const existed = fs.existsSync(url)
        if (existed && force) {
            deleteFileSync(url)
            createFolderRecursive(url)
        } else if (existed) {
            console.warn('The Folder Existed: ' + url)
        } else {
            createFolderRecursive(url)
        } 
    }
}

export function copyFileRecursive(from: string, target: string) {
    if (fs.existsSync(target)) {
        deleteFileSync(target)
    } else {
        const regexp = /[\/\\].[^\/\\]*$/
        createFoldersSync(target.replace(regexp, ''))
    }
    fs.copyFileSync(from, target)
}

export function copyFilesSync(from: string, target: string, files?: string[]) {
    if (!files) {
        deleteFileSync(target)
        const mfiles = getFilesRecursive(from)
        for (const file of mfiles) {
            copyFileRecursive(file, path.join(target, file.replace(from, '')))
        }
        return
    }
    for (const file of files) {
        const url = path.join(from, file)
        if (!fs.existsSync(url)) {
            continue
        }
        copyFileRecursive(path.resolve(url), path.join(target, file))
    }
}

export function modifyFileJSON(target: string, callback: any) {
    if (fs.existsSync(target)) {
        const jsonStr = fs.readFileSync(target).toString('utf-8')
        const pkgConfig = JSON.parse(jsonStr || '{}')
        const newPkgConfig = callback(pkgConfig)
        const newJsonStr = JSON.stringify(newPkgConfig, null, 2) + '\n'
        fs.writeFileSync(target, newJsonStr, { encoding: 'utf-8' })
    } else {
        throw new Error('JSON file not exist')
    }
}