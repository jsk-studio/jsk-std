#!/usr/bin/env node
const path = require('path')
const { cmd, fileIO, rootConfig, rootDir } = require('@jsk-std/cli')

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
    if (argv.del) {
      const depKeys = ['dependencies', 'peerDependencies', 'devDependencies']
      for (const key of depKeys) {
        if (toInfo[key]) {
          delete toInfo[key][depPkgName]
        }
      }
      fileIO.write(toPkgPath, toInfo, { mode: 'json' })
    } else if (from === to) {
      toInfo.devDependencies[depPkgName] = 'file:.'
      fileIO.write(toPkgPath, toInfo, { mode: 'json' })
    } else  {
      const cmd = `lerna add ${depPkgName} --scope=${toInfo.name}`
      const dev = argv.dev ? ' --dev' : ''
      cmd.exec(`${cmd}${dev}`)
      const [curToInfo] = getPackageInfo(to)
      const depKey = argv.dev ? 'devDependencies' : 'dependencies'
      const pkgVersion = curToInfo[depKey] && curToInfo[depKey][depPkgName]
      if (pkgVersion) {
        curToInfo.peerDependencies[depPkgName] = pkgVersion
        fileIO.write(toPkgPath, curToInfo, { mode: 'json' })
      }
    }
  }
}

function getPackageInfo(fpath) {
  for (const work of Object.keys(rootConfig.mode)) {
    const pkgPath = path.resolve(rootDir, work, fpath, 'package.json')
    const info = fileIO.read(pkgPath, { mode: 'json' }) 
    if (info) {
      return [info, pkgPath]
    }
  }
  return [null]
}
