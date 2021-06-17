import fs from 'fs'
import path from 'path'
import { xTypeOf } from '@jsk-std/x'

type IFilter = RegExp | ((filename: string) => boolean)

export function deleteFolderSync (url: string, filter?: IFilter) {
    let files = [];
    //判断给定的路径是否存在
    if(fs.existsSync(url) ) {
        //返回文件和子目录的数组
        files = fs.readdirSync(url);

        let emptied = true

        for (const file of files) {
            const curPath = path.join(url,file);
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderSync(curPath);
                 
            // 是文件delete file  
            } else if (!filter
                || xTypeOf(filter, 'function') && filter(curPath)
                || xTypeOf(filter, 'regexp') && curPath.match(filter)
            ) {
                fs.unlinkSync(curPath);
            } else {
                emptied = false
            }
        }
        if (emptied) {
            fs.rmdirSync(url);
        }
        
    } else {
        console.warn("要删除的目录不存在");
    }
};