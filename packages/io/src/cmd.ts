import fs from 'fs'
import _yargs from 'yargs'
import { spawnSync } from 'child_process';

const yargs = _yargs(process.argv.slice(2))
const { _ : args, ...argv } = yargs.argv
const exec = (cmd: string, args?: ReadonlyArray<string>) => {
    spawnSync(cmd, args, { stdio: 'inherit', shell: true })
}
const execjs = (mpath: string, args?: ReadonlyArray<string>) => {
    const filepath = mpath.replace(/\.js$/i, '') + '.js'
    if (fs.existsSync(filepath)) {
        exec(`node ${filepath}`, args)
    } else {
        console.error('commend is not exist: ', filepath)
    }
}

export const cmd = {
    argv,
    args,
    exec,
    execjs,
    yargs,
}

