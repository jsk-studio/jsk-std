import fs from 'fs'
import path from 'path'
import { xTypeOf } from '@jsk-std/x'

type IFilter = RegExp | ((filename: string) => boolean)

function matchRule(url: string , filter?: IFilter) {
    return !filter
    || xTypeOf(filter, 'function') && filter(url)
    || xTypeOf(filter, 'regexp') && url.match(filter)
}

export function deleteFolderRecursive(url: string, filter?: IFilter) {
    let files = [];
    //判断给定的路径是否存在
    if(fs.existsSync(url) ) {
        //返回文件和子目录的数组
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
};

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

export function createFolder(url: string, force = true) {
    const existed = fs.existsSync(url)
    if (existed && force) {
        deleteFolderRecursive(url)
        createFolder(url)
    } else if (existed) {
        console.warn('The Folder Existed: ' + url)
    } else {
        createFolder(url)
    }
}