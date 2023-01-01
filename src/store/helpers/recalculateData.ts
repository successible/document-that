import produce from 'immer'
import * as git from 'isomorphic-git'
import lodashSet from 'lodash/set'
import { toggleFolderAtPath } from '../../helpers/commands/toggleFolderAtPath'
import { createFileTree } from '../../helpers/fs/createFileTree'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { mergeFileTrees } from '../../helpers/fs/mergeFileTrees'
import { readFile } from '../../helpers/fs/readFile'
import { getProperties } from '../../helpers/github/properties/getProperties'
import { Command, FileTree, Folder, Set, State } from '../store'

export const recalculateData = async (
  get: () => State,
  set: Set,
  commands: Command[] | undefined
) => {
  const data = get().data
  const accessToken = get().accessToken
  const user = get().user

  const activeRepo = get().activeRepo
  if (!activeRepo || !accessToken || !user) return

  const newFiles = await git.statusMatrix({
    ...getProperties(accessToken, activeRepo, user),
  })

  const newFileTree = await createFileTree(newFiles, activeRepo)

  const oldTree = getActiveData(activeRepo, data).fileTree
  const mergedTree = mergeFileTrees(oldTree, newFileTree as Folder | FileTree)

  const oldFile = getActiveData(activeRepo, data).file
  const oldTabs = getActiveData(activeRepo, data).tabs || []

  const newContents = await readFile(oldFile?.path || '')
  const newFile = { content: newContents, path: oldFile?.path }

  const name = activeRepo?.full_name
  let newData = produce(data, (draft) => {
    lodashSet(draft, [name, 'file'], newContents ? newFile : null)
    lodashSet(draft, [name, 'files'], newFiles)
    lodashSet(draft, [name, 'fileTree'], mergedTree)
    lodashSet(draft, [name, 'tabs'], oldTabs)
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
