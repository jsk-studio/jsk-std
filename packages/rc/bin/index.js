#!/usr/bin/env node
const { args, rootDir } = require('../src/index')
const { copyFilesSync } = require('@jsk-std/io')
const path = require('path')
let [ commend, dir ] = args
dir = dir || rootDir

if (commend === 'sync') {
    copyFilesSync(path.resolve(__dirname, '../base'), path.resolve(dir), [
        'tsconfig.prod.json',
        'LICENSE',
    ])
    copyFilesSync(path.resolve(__dirname, '../npm'), path.resolve(dir), [
        '.npmignore',
    ])
} 
if (commend === 'sync-repo') {
    copyFilesSync(path.resolve(__dirname, '../base'), path.resolve(dir), [
        '.gitattributes',
        '.gitignore',
        'LICENSE',
    ])
    copyFilesSync(path.resolve(__dirname, '../repo'), path.resolve(dir), [
        'jest.config.js',
        'lerna.json',
        'tsconfig.json',
    ])
}

