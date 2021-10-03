import { deleteFolderRecursive, copyFilesSync } from '../lib'
import path from 'path'

test('test for delete folder sync', () => {
    deleteFolderRecursive(path.join(__dirname, '../lib'), /.ts$/)
})

test('test for copy files sync', () => {
    copyFilesSync(path.join(__dirname, '../src'), path.join(__dirname, '../dist'))
})