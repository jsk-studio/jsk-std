#!/usr/bin/env node
const path = require('path')
const { file_io } = require('@jsk-std/io')
const { x_call } = require('@jsk-std/x')
const { 
  rootConfigDir, 
  repoResolveConfig,
  getArgsConfigs,
} = require('../common/config')

// sync project rootConfig
const modifyPaths = [
  'package.json',
  'lerna.json',
]
for (const modifyPath of modifyPaths) {
  const mp = path.resolve(rootConfigDir, modifyPath)
  file_io.modify(mp, { 
    mode: 'json', 
    replacer:  (json, mpath) => {
      return x_call(repoResolveConfig.boot.json, [mpath, json, getArgsConfigs()])
    }
  })
}

