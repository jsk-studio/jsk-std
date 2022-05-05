#!/usr/bin/env node
const path = require('path')
const { cmd, file_io } = require('@jsk-std/io')
const { rootConfigDir, rootConfig, runRootCmd } = require('../common/config')

if (!cmd.args[0] || !cmd.args[1]) {
  console.error('参数错误')
  return
}

const fromDeps = cmd.args[0].split(',')
const toDeps = cmd.args[1].split(',')
for (const from of fromDeps) {
  for (const to of toDeps) {
    const [fromInfo] = getPackageInfo(from)
    const [toInfo, toPkgPath] = getPackageInfo(to)
    if (toInfo === null) {
      continue
    }
    const depPkgName = fromInfo && fromInfo.name || from
    if (cmd.argv.del) {
      const depKeys = ['dependencies', 'peerDependencies', 'devDependencies']
      for (const key of depKeys) {
        if (toInfo[key]) {
          delete toInfo[key][depPkgName]
        }
      }
      file_io.write(toPkgPath, toInfo, { mode: 'json' })
    } else if (from === to) {
      // toInfo.devDependencies[depPkgName] = 'file:.'
      // file_io.write(toPkgPath, toInfo, { mode: 'json' })
    } else  {
      const cmdstr = `${runRootCmd}lerna add ${depPkgName} --scope=${toInfo.name}`
      const dev = cmd.argv.dev ? ' --dev' : ''
      cmd.exec(`${cmdstr}${dev}`)
      const [curToInfo] = getPackageInfo(to)
      const depKey = cmd.argv.dev ? 'devDependencies' : 'dependencies'
      const pkgVersion = curToInfo[depKey] && curToInfo[depKey][depPkgName]
      if (pkgVersion) {
        file_io.write(toPkgPath, curToInfo, { mode: 'json' })
      }
    }
  }
}

function getPackageInfo(fpath) {
  for (const work of Object.keys(rootConfig.workspaces)) {
    const pkgPath = path.resolve(rootConfigDir, work, fpath, 'package.json')
    const info = file_io.read(pkgPath, { mode: 'json' }) 
    if (info) {
      return [info, pkgPath]
    }
  }
  return [null]
}
