#!/usr/bin/env node
const path = require('path')
const { cmd, rootConfig, fileIO, rootDir, repoDir, repoReplacer } = require('@jsk-std/cli')

const dirAliasMap = {
  pkg: 'packages',
  proj: 'projects',
  proto: 'protocols',
}

const subPathDir = dirAliasMap[cmd.args[0]] || cmd.args[0]
const subRootName = cmd.args[1]
const addMode = cmd.argv.mode || rootConfig.workspaces[subPathDir]
const supportMode = ['tsc', 'koa', 'grpc']

if (!subRootName || !supportMode.includes(addMode)) {
  console.error('params error',cmd.args[0])
  return
}

const addNames = subRootName.split(',')
for (const addName of addNames) {
  const replaceValues = {
    JSK_PACKAGE_NAME: `@${rootConfig.name}/${addName}`
  }
  const subRootDir = path.resolve(rootDir, subPathDir, addName)
  const subRepoDir = path.resolve(repoDir, subPathDir, addMode)
  const rootFiles = [
    ['.npmignore.rc', '.npmignore'],
    'package.json',
    'tsconfig.prod.json',
    'src/index.ts',
    'spec/index.spec.ts',
  ].filter(Boolean)
  const modifyFiles = [
    'package.json',
  ]
  fileIO.copy(subRepoDir, subRootDir, { files: rootFiles })
  fileIO.modify(subRootDir, { files: modifyFiles, mode: 'text' }, text => {
    return repoReplacer(text, replaceValues)
  })
}
