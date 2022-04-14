#!/usr/bin/env node

const { cmd, fileIO, folderIO } = require('@jsk-std/cli')
const readline = require('readline-sync')
const path = require('path')
if (!cmd.args[0]) {
  console.error('create path is not found');
  return
}

const projectName = cmd.args[0].split('/').slice(-1)[0]

const jskObj = {
  name: projectName,
  mode: 'node',
  profile: {
    author: '',
    repository: '',
    license: 'MIT',
  },
  templates: [
    'github:jsk-studio/jsk-cli-repo#main',
  ],
}

const modeMap =  {
  'node': {
    packages: 'tsc',
  },
  'koa': {
    packages: 'tsc',
    projects: "tsc",
    protocols: 'tsc',
  },
  'grpc': {
    packages: 'tsc',
    projects: "tsc",
    protocols: 'tsc',
  },
}

jskObj.name = sampleQuestion('name', projectName)
jskObj.mode = sampleQuestion('mode', jskObj.mode)
jskObj.workspaces = modeMap[jskObj.mode] || modeMap['node']

const simpleProfiles = [
  'author', 
  'repository',
  'license',
]

for (const key of simpleProfiles) {
  const val = jskObj.profile[key]
  jskObj.profile[key] = sampleQuestion(key, val)
}

function sampleQuestion(key, val) {
  const ques = `${key}: (default: ${val})`
  return readline.question(ques, { defaultInput: val })
}

const configDir = path.resolve(cmd.args[0], 'configs')
const configPath =  path.resolve(configDir, 'jsk.config.js')

folderIO.create(configDir)
fileIO.write(`${configPath}`, jskObj, { mode: 'js' })

cmd.exec(`jsk-cli boot --proj ${cmd.args[0]}`)