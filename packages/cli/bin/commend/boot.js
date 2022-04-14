#!/usr/bin/env node
const { cmd, rootConfig, rootDir, repoDir, repoReplacer, fileIO } = require('@jsk-std/cli')

const rootFiles = [
  rootConfig.profile.license === 'MIT' && 'LICENSE',
  ['.gitattributes.rc', '.gitattributes'],
  ['.gitignore.rc', '.gitignore'],
  '.prettierrc',
  'package.json',
  'tsconfig.json',
  'tslint.json',
  'lerna.json',
  'configs/jest.config.js',
].filter(Boolean)

const modifyFiles = [
  'package.json',
].filter(Boolean)

fileIO.copy(repoDir, rootDir, { files: rootFiles })
fileIO.modify(rootDir, { mode: 'text', files: modifyFiles }, text => {
  return repoReplacer(text)
})
cmd.exec('jsk-cli sync', process.argv.slice(2))
const runDir = cmd.argv.proj ? `cd ${cmd.argv.proj} && ` : ''
cmd.exec(`${runDir}npm run boot`)

