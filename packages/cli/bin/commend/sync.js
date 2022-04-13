#!/usr/bin/env node
const path = require('path')
const { rootConfig, rootDir, fileIO } = require('@jsk-std/cli')

// sync project rootConfig
const pkgRootPath = path.resolve(rootDir, 'package.json')
const lernaPath = path.resolve(rootDir, 'lerna.json')
const workspaces = Object.keys(rootConfig.mode).map(m => m + '/*')
fileIO.modify(pkgRootPath, { mode: 'json' }, json => {
  json.workspaces = workspaces
})
fileIO.modify(lernaPath, { mode: 'json' }, json => {
  json.packages = workspaces
})
