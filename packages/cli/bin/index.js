#!/usr/bin/env node

// jsk-cli create
// jsk-cli boot
// jsk-cli add pkg pkg1,pkg2
// jsk-cli add pkg pkg2
// jsk-cli add proj proj1 
// jsk-cli dep pkg1,pkg2 proj1
// jsk-cli dep pkg1,pkg2 proj1,proj2 --del

const path = require('path')
process.env.JSK_REPO_DIR  = path.resolve(__dirname, '../repo')
const { cmd } = require('@jsk-std/cli')

if (['create'].includes(cmd.args[0])) {
  cmd.exec(`jsk-cli download`)
}
cmd.execjs(path.resolve(__dirname, `commend/${cmd.args[0]}`), process.argv.slice(3))