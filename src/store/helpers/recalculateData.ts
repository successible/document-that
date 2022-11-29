import produce from 'immer'
import lodashSet from 'lodash/set'
import { toggleFolderAtPath } from '../../helpers/commands/toggleFolderAtPath'
import { createFileTree } from '../../helpers/fs/createFileTree'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { listContentsOfFileSystem } from '../../helpers/fs/listContentsOfFileSystem'
import { mergeFileTrees } from '../../helpers/fs/mergeFileTrees'
import { readFile } from '../../helpers/fs/readFile'
import { Command, FileTree, Folder, Set, State } from '../store'

export const recalculateData = async (
  get: () => State,
  set: Set,
  commands: Command[] | undefined
) => {
  const data = get().data
  const activeRepo = get().activeRepo
  if (!activeRepo) return

  const name = activeRepo?.full_name
  const newFiles = await listContentsOfFileSystem(activeRepo)
  const newFileTree = await createFileTree(newFiles, activeRepo)

  const oldTree = getActiveData(activeRepo, data).fileTree
  const mergedTree = mergeFileTrees(oldTree, newFileTree as Folder | FileTree)

  const oldFile = getActiveData(activeRepo, data).file
  const newContents = await readFile(oldFile?.path || '')
  const newFile = { content: newContents, path: oldFile?.path }

  let newData = produce(data, (draft) => {
    lodashSet(draft, [name, 'file'], newContents ? newFile : null)
    lodashSet(draft, [name, 'files'], newFiles)
    lodashSet(draft, [name, 'fileTree'], mergedTree)
  })

  // If no command is present, there is not need to alter the data
  // We can stop here. Otherwise, we need to modify the data some more!

  if (!commands) {
    return set(() => ({
      data: newData,
    }))
  } else {
    for (const command of commands) {
      const { payload, type } = command
      if (type === 'toggle_folder_at_path') {
        newData = toggleFolderAtPath(activeRepo, newData, payload.path)
      }
    }
    return set(() => ({
      data: newData,
    }))
  }
}
