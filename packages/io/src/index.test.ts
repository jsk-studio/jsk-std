import { deleteFolderSync } from '.'
import path from 'path'

test('test for delete folder sync', () => {
    deleteFolderSync(path.join(__dirname, '../lib'), /.ts$/)
})