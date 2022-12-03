import produce from 'immer'
import { cloneDeep, set } from 'lodash'
import { isObject } from 'lodash/fp'
import { FileTree, Folder } from '../../store/store'
import { FOLDER_KEYS, WORKDIR_STATUS_KEY } from './createFileTree'

export const mergeFileTrees = (
  oldTree: FileTree | Folder,
  newTree: FileTree | Folder
) => {
  let mergedTree = cloneDeep(newTree)

  const recursivelyMergeTrees = (
    oldTree: FileTree | Folder,
    newTree: FileTree | Folder,
    path: string[] = []
  ) => {
    if (!oldTree || !newTree) return {}

    Object.keys(oldTree).forEach((key) => {
      if (key in newTree) {
        const oldValue = oldTree[key]
        const newValue = newTree[key]
        // Each file tree is created from scratch. Hence, we use this function to keep
        // The useful data from the previous tree. Specifically, what folders are expanded.
        // Basically, if both trees have the same object, and old is expanded and new is not
        // Make sure to expand new at the same location
        // We do this by updating mergedTree at the exact path that needs to be expanded

        // Example: Take /wiki/.vscode/foo/bar with foo as the new folder.
        // OLD data will remember the status of .vscode.
        // However, if you only use NEW data, the .vscode will default to expanded as false.

        if (isObject(oldValue) && isObject(newValue)) {
          const oldValueIsFile = WORKDIR_STATUS_KEY in oldValue
          const newValueIsFile = WORKDIR_STATUS_KEY in newValue

          if (!oldValueIsFile && !newValueIsFile) {
            mergedTree = produce(mergedTree, (draft) => {
              for (const objectKey of FOLDER_KEYS) {
                const pathToExpand = [...path, key, objectKey]
                set(draft, pathToExpand, oldValue[objectKey])
              }
            })
            recursivelyMergeTrees(oldValue, newValue, [...path, key])
          }
        }
      }
    })
  }

  recursivelyMergeTrees(oldTree, newTree)

  return mergedTree
}
