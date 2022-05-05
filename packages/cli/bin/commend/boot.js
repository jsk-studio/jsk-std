#!/usr/bin/env node
const { cmd, file_io } = require('@jsk-std/io')
const { x_call } = require('@jsk-std/x')
const { 
  rootConfig, 
  rootConfigDir, 
  repoConfigDir,
  repoResolveConfig,
  getArgsConfigs,
  runRootCmd,
} = require('../common/config')

const rootFiles = x_call(repoResolveConfig.boot.files, getArgsConfigs).filter(Boolean)

file_io.copy(repoConfigDir, rootConfigDir, { files: rootFiles })
file_io.modify(rootConfigDir, { 
  mode: 'text', 
  files: rootFiles,
  replacer: (text, mpath) => {
    return x_call(repoResolveConfig.boot.text, [mpath, text, getArgsConfigs()])
  }
}), 

cmd.exec('mono-cli sync', process.argv.slice(2))
cmd.exec(`${runRootCmd}npm run boot`)

