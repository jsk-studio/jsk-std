#!/usr/bin/env node
const fs = require('fs')
const download = require('download-git-repo')
const { cmd, repo, repoDir } = require('@jsk-std/cli')
if (cmd.argv.force) {
  // fileIO.
}
if (fs.existsSync(repoDir)) {
  return
}
download(repo, repoDir, function (err) {
  if (err) {
    console.error(err)
  }
})