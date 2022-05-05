#!/usr/bin/env node
const fs = require('fs')
const download = require('download-git-repo')
const { folder_io, cmd } = require('@jsk-std/io')
const { repoUrl, repoConfigDir } = require('../common/config')

if (cmd.argv.force) {
  folder_io.remove(repoConfigDir)
}
if (fs.existsSync(repoConfigDir)) {
  return
}
download(repoUrl, repoConfigDir, function (err) {
  if (err) {
    console.error(err)
  }
})