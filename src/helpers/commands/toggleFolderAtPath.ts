import produce from 'immer'
import { set } from 'lodash'
import { Repo } from '../../pages'
import { Data } from '../../store/store'
import { EXPANDED_KEY, PATH_KEY } from '../fs/createFileTree'
import { getActiveData } from '../fs/getActiveData'

export const toggleFolderAtPath = (
  activeRepo: Repo,
  data: Data,
  path: string[]
) => {
  const name = activeRepo.name
  const newData = produce(data, (draft) => {
    const fileTree = getActiveData(activeRepo, draft).fileTree
    const parentFolder = [name, ...path.slice(0, -1), EXPANDED_KEY]
    set(fileTree, parentFolder, 'yes')
    const newFolder = [name, ...path]
    set(fileTree, newFolder, {
      [EXPANDED_KEY]: 'yes',
      [PATH_KEY]: path.join('/'),
    })
  })
  return newData
}
