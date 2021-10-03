const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const rootDir = process.env.JSK_ROOT_DIR || '.'
let pkgConfig = {}

if (fs.existsSync(`${rootDir}/package.json`)) {
    const jsonStr = fs.readFileSync(`${rootDir}/package.json`)
    pkgConfig = JSON.parse(jsonStr, { encoding: 'utf-8' })
}

module.exports = {
    argv,
    rootDir,
    pkgConfig,
    args: argv._,
}