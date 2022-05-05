
const path = require('path')
const { file_io, cmd } = require('@jsk-std/io')

const DERAULT_MONO_CONFIG_PATH = 'mono.config.js'
const DEFAULT_MONOREPO_RESOLVE_PATH = 'mono.resolve.js'
const DEFAULT_MONOREPO_URL = 'github:jsk-studio/jsk-monorepo#main'

// local
const rootConfigDir = cmd.argv.dir || '.'
const rootConfig = readRootConfig(DERAULT_MONO_CONFIG_PATH)

// remote
const repoUrl = cmd.argv.repo || DEFAULT_MONOREPO_URL
const repoRootDir = process.env.JSK_REPO_CACHE_DIR || './monorepo'
const repoConfigDir = path.resolve(repoRootDir, encodeURIComponent(repoUrl))

const repoResolveConfig = readRepoConfig(DEFAULT_MONOREPO_RESOLVE_PATH)

const runRootCmd = cmd.argv.dir ? `cd ${cmd.argv.dir} && ` : ''

function readRootConfig(mpath) {
  const configPath = path.resolve(rootConfigDir, mpath)
  return file_io.read(configPath, { mode: 'js' })
}

function readRepoConfig(mpath) {
  const configPath = path.resolve(repoConfigDir, mpath)
  return file_io.read(configPath, { mode: 'js' })
}


function getArgsConfigs(cmdConfig = {}) {
  return {
    monoConfig: rootConfig,
    cmdConfig,
  }
}

exports.rootConfig = rootConfig
exports.rootConfigDir = rootConfigDir

exports.repoUrl = repoUrl
exports.repoConfigDir = repoConfigDir
exports.repoResolveConfig = repoResolveConfig

exports.getArgsConfigs = getArgsConfigs
exports.runRootCmd = runRootCmd
// export function repoReplacer(text: string, obj: any = {}) {
//   const pkgRepoUrl = rootConfig.profile.repository || ''
//   const replaceValues = {
//     JSK_PROJECT_NAME: rootConfig.name,
//     JSK_PACKAGE_AUTHOR: rootConfig.profile.author,
//     JSK_PACKAGE_REPO_HOME: pkgRepoUrl && `${pkgRepoUrl}#readme`,
//     JSK_PACKAGE_REPO_GIT: pkgRepoUrl && `git+${pkgRepoUrl}.git`,
//     JSK_PACKAGE_REPO_ISSURE: pkgRepoUrl && `${pkgRepoUrl}/issues`,
//   }
//   const replaces = Object.assign({}, replaceValues, obj)
//   let filetext = text
//   for (const key of Object.keys(replaces)) {
//     filetext = filetext.replace(`\${${key}}`, replaces[key])
//   }
//   return filetext
// }