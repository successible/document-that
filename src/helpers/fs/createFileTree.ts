import { HeadStatus, StageStatus, WorkdirStatus } from 'isomorphic-git'
import { get, isEmpty, set } from 'lodash'
import { Repo } from '../../pages'
import { FileTree } from '../../store/store'

export const PATH_KEY = '___path'
export const EXPANDED_KEY = '___expanded'
export const STATUS_KEY = '___status'
export const FOLDER_KEYS = [PATH_KEY, EXPANDED_KEY]
export const FILE_KEYS = [PATH_KEY, STATUS_KEY]

type Filename = string
type FileFromGit = [Filename, HeadStatus, WorkdirStatus, StageStatus]

export const createFileTree = async (
  files: FileFromGit[],
  activeRepo: Repo
) => {
  const newFileTree: FileTree = {}

  const workdirStatus = files.reduce((acc, file) => {
    acc[file[0]] = file[2]
    return acc
  }, {} as Record<Filename, WorkdirStatus>)

  const parseFiles = (files: string[], inputPath: string[] = []) => {
    files.forEach((file) => {
      if (file.includes('/')) {
        const paths = file.split('/') // docs/assets/foo.png -> [docs, assets, foo.png]
        const folder = `${paths[0]}` // docs
        // docs - as the first path being processed is the root folder
        const currentPath = [...inputPath, folder]
        // If no {} exists at docs, create it
        // Within the dictionary, even when empty, have a key called ___path
        // With the absolute path to the dictionary
        !get(newFileTree, currentPath) &&
          set(newFileTree, currentPath, {
            [EXPANDED_KEY]: 'no',
            [PATH_KEY]: currentPath.join('/'),
          })
        // Descend into the next level of files -> assets/foo.png
        parseFiles([paths.slice(1).join('/')], currentPath)
      } else {
        if (isEmpty(inputPath)) {
          // These are the files in the root
          newFileTree[file] = {
            [PATH_KEY]: file,
            [STATUS_KEY]: workdirStatus[file],
          }
        } else {
          // When the folder is empty, the file will be "", so we need to ignore it
          if (file) {
            // Get the value of the folder, like docs, and add the file
            const folder = get(newFileTree, inputPath)
            const fullPath = `${inputPath.join('/')}/${file}`
            folder[file] = {
              [PATH_KEY]: fullPath,
              [STATUS_KEY]: workdirStatus[fullPath],
            }
          }
        }
      }
    })
  }

  parseFiles(files.map((f) => f[0]))
  const name = activeRepo.name

  return {
    // If username/wiki, we just want wiki to be the name of the root folder
    // We want it to start as expanded
    [name]: {
      ___expanded: 'yes',
      ___path: '',
      ...newFileTree,
    },
  }
}
