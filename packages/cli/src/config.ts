
import path from 'path'
import { fileIO } from './file'
import { cmd } from './cmd'

const rootDir = process.env.JSK_ROOT_DIR || cmd.argv.proj as string || '.'
const rootConfigPath = path.resolve(rootDir, 'configs/jsk.config.js')
const rootConfig = fileIO.read(rootConfigPath, { mode: 'js' })

const repo = cmd.argv.repo as string || 'github:jsk-studio/jsk-cli-repo#main'
const repoRootDir = path.resolve(process.env.JSK_REPO_DIR as string)
const repoDir = path.resolve(repoRootDir, encodeURIComponent(repo))
const repoConfigPath = path.resolve(repoDir, 'jsk.repo.js')
const repoConfig = fileIO.read(repoConfigPath, { mode: 'js' }) || {}

export function repoReplacer(text: string, obj: any = {}) {
  const pkgRepoUrl = rootConfig.profile.repository || ''
  const replaceValues = {
    JSK_PROJECT_NAME: rootConfig.name,
    JSK_PACKAGE_AUTHOR: rootConfig.profile.author,
    JSK_PACKAGE_REPO_HOME: pkgRepoUrl && `${pkgRepoUrl}#readme`,
    JSK_PACKAGE_REPO_GIT: pkgRepoUrl && `git+${pkgRepoUrl}.git`,
    JSK_PACKAGE_REPO_ISSURE: pkgRepoUrl && `${pkgRepoUrl}/issues`,
  }
  const replaces = Object.assign({}, replaceValues, obj)
  let filetext = text
  for (const key of Object.keys(replaceValues)) {
    filetext = filetext.replace(`\${${key}}`, replaces[key])
  }
  return filetext
}

export {
  rootDir,
  rootConfig,
  repo,
  repoDir,
  repoConfig,
}
