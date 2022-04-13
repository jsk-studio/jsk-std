import fs from 'fs'
import _yargs from 'yargs'
import { spawnSync } from 'child_process';

const argvParser = _yargs(process.argv.slice(2))
const { _ : args, ...argv } = argvParser.argv
const exec = (cmd: string, args?: ReadonlyArray<string>) => {
    spawnSync(cmd, args, { stdio: 'inherit', shell: true })
}
const execjs = (path: string, args?: ReadonlyArray<string>) => {
    const filepath = path.replace(/\.js$/i, '') + '.js'
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
    yargs: argvParser,
}

