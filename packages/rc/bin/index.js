#!/usr/bin/env node
const { args, rootDir, pkgConfig, pkgFlush, argv } = require('../src/index')
const { copyFilesSync, modifyFileJSON } = require('@jsk-std/io')
const fs = require('fs')
const path = require('path')
// jsk-rc sync
// jsk-rc remove [target]
// jsk-rc script [target] --set=[content]
// jsk-rc script [target] --remove
let [ commend, target ] = args

const repoDir = path.resolve(__dirname, '../repo')

if (commend === 'sync') {
    mergeConfig(
        path.resolve(repoDir, '.gitattributes-rc'),
        path.resolve(rootDir, '.gitattributes'),
    )
    mergeConfig(
        path.resolve(repoDir, '.gitignore-rc'),
        path.resolve(rootDir, '.gitignore'),
    )
   
    copyFilesSync(repoDir, path.resolve(rootDir), [
        'LICENSE',
        'jest.config.js',
        'lerna.json',
        'tsconfig.json',
    ])

    pkgConfig.workspaces = [
        "packages/*",
        "projects/*"
    ]

    workscapeTraverse([
        path.resolve('packages'),
        path.resolve('projects'),
    ], syncWorkSpace)

    pkgFlush()
}

if (commend === 'remove') {
    workscapeTraverse([
        path.resolve('packages'),
        path.resolve('projects'),
    ], root => {
        const filepath = path.resolve(root, target)
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
    })
}

if (commend === 'script') {
    workscapeTraverse([
        path.resolve('packages'),
        path.resolve('projects'),
    ], root => {
        modifyFileJSON(path.resolve(root, 'package.json'), json => {
            if (argv.remove) {
                json.scripts[target] = undefined
            }
            if (argv.set) {
                json.scripts[target] = argv.set
            }
            return json
        })
    })
}

function workscapeTraverse(mdir, cb) {
    if (Array.isArray(mdir)) {
        for (const d of mdir) {
            workscapeTraverse(d, cb)
        }
        return
    }
    if(!fs.existsSync(mdir) || !fs.statSync(mdir).isDirectory()) {
        return
    }
    const dirs = fs.readdirSync(mdir)
    for (const d of dirs) {
        const rootPath = path.resolve(mdir, d)
        cb(rootPath)
    }
}

function syncWorkSpace(mdir) {
    copyFilesSync(repoDir, path.resolve(mdir), [
        'tsconfig.prod.json',
        'LICENSE',
    ])
    mergeConfig(
        path.resolve(repoDir, '.npmignore-rc'),
        path.resolve(mdir, '.npmignore'),
    )
}


function mergeConfig(from, target, mode = 'slot') {
    if (!fs.existsSync(target)) {
        copyFilesSync(from, target)
        return
    }
    if (argv.force) {
        copyFilesSync(from, target)
        return
    }
    const fromText = fs.readFileSync(from, { encoding: 'utf-8' })
    const targetText = fs.readFileSync(target, { encoding: 'utf-8' })
    if (mode === 'slot') {
        let text = ''
        for (const l of targetText.split('\n')) {
            if (!l.includes('[jsk-rc]')) {
                text += l + '\n'
            } else {
                break
            }
        }
        fs.writeFileSync(target, text + fromText, { encoding: 'utf-8'})
    }
}
