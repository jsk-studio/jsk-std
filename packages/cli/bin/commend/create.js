#!/usr/bin/env node

const { cmd, file_io, folder_io } = require('@jsk-std/io')
const { repoResolveConfig } = require('../common/config')
const readline = require('readline-sync')
const path = require('path')

if (!cmd.args[0] || !repoResolveConfig.mode) {
  console.error('create path or mode is not found');
  return
}

const projectName = cmd.args[0].split('/').slice(-1)[0]
const resolveModes = Object.keys(repoResolveConfig.mode)

const monoObj = {
  name: projectName,
  mode: resolveModes[0],
  profile: {
    author: '',
    repository: '',
    license: '',
  },
}

const modeMap = repoResolveConfig.mode
monoObj.name = sampleQuestion('name', projectName)
monoObj.mode = sampleQuestion('mode', monoObj.mode)
monoObj.workspaces = modeMap[monoObj.mode] || modeMap[resolveModes[0]]
delete monoObj.mode

const simpleProfiles = [
  'author', 
  'repository',
  'license',
]

for (const key of simpleProfiles) {
  const val = monoObj.profile[key]
  monoObj.profile[key] = sampleQuestion(key, val)
}

function sampleQuestion(key, val) {
  const ques = `${key}: (default: ${val})`
  return readline.question(ques, { defaultInput: val })
}

const configDir = path.resolve(cmd.args[0])
const configPath =  path.resolve(configDir, 'mono.config.js')

folder_io.create(configDir)
file_io.write(`${configPath}`, monoObj, { mode: 'js' })

cmd.exec(`mono-cli boot --dir ${cmd.args[0]}`)