const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const rootDir = process.env.JSK_ROOT_DIR || '.'
const pkgPath = `${rootDir}/package.json`
let pkgConfig = {}

if (fs.existsSync(pkgPath)) {
    const jsonStr = fs.readFileSync(pkgPath)
    pkgConfig = JSON.parse(jsonStr, { encoding: 'utf-8' })
}

function pkgFlush() {
    if (fs.existsSync(pkgPath)) {
        const jsonStr = JSON.stringify(pkgConfig, null, 2) + '\n'
        fs.writeFileSync(pkgPath, jsonStr, { encoding: 'utf-8' })
    }
}

module.exports = {
    argv,
    rootDir,
    pkgFlush,
    pkgConfig,
    args: argv._,
}