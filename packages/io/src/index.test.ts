import { deleteFolderRecursive } from '.'
import path from 'path'

test('test for delete folder sync', () => {
    deleteFolderRecursive(path.join(__dirname, '../lib'), /.ts$/)
})