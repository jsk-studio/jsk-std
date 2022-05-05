#!/usr/bin/env node

// jsk-cli create
// jsk-cli boot
// jsk-cli add pkg pkg1,pkg2
// jsk-cli add pkg pkg2
// jsk-cli add proj proj1 
// jsk-cli dep pkg1,pkg2 proj1
// jsk-cli dep pkg1,pkg2 proj1,proj2 --del
const path = require('path')
const { cmd } = require('@jsk-std/io')

process.env.JSK_REPO_CACHE_DIR  = path.resolve(__dirname, 'monorepo')

if (!['download'].includes(cmd.args[0])) {
  cmd.exec(`mono-cli download`)
}
cmd.execjs(path.resolve(__dirname, `commend/${cmd.args[0]}`), process.argv.slice(3))