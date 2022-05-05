#!/usr/bin/env node
const path = require('path')
const { cmd, file_io } = require('@jsk-std/io')
const { x_call } = require('@jsk-std/x')

const { 
  rootConfig, 
  rootConfigDir, 
  repoConfigDir,
  repoResolveConfig,
  getArgsConfigs,
} = require('../common/config')

const subPathDir = cmd.args[0]
const subRootName = cmd.args[1]
const addMode = cmd.argv.mode || rootConfig.workspaces[subPathDir]
const supportMode = []

for (const modeName of Object.keys(repoResolveConfig.mode)) {
  const supports = repoResolveConfig.mode[modeName]
  supportMode.push(...Object.values(supports))
}

if (!subRootName || !supportMode.includes(addMode)) {
  console.error('params error',cmd.args[0])
  return
}

const addNames = subRootName.split(',')
for (const addName of addNames) {
  const pkgName = `@${rootConfig.name}/${addName}`
  const subRootDir = path.resolve(rootConfigDir, subPathDir, addName)
  const subRepoDir = path.resolve(repoConfigDir, subPathDir, addMode)

  const argsConfig = getArgsConfigs({ name: pkgName })
  const rootFiles = x_call(repoResolveConfig.package.files, argsConfig).filter(Boolean)

  file_io.copy(subRepoDir, subRootDir, { files: rootFiles })
  file_io.modify(subRootDir, { 
    mode: 'text', 
    files: rootFiles, 
    replacer: (text, mpath) => {
      return x_call(repoResolveConfig.package.text, [mpath, text, argsConfig])
    }
  })
}
