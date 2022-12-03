import { HeadStatus, StageStatus, WorkdirStatus } from 'isomorphic-git'
import { get, isEmpty, set } from 'lodash'
import { Repo } from '../../pages'
import { FileTree } from '../../store/store'

export const PATH_KEY = '___path'
export const EXPANDED_KEY = '___expanded'
export const HEAD_STATUS_KEY = '___headStatus'
export const WORKDIR_STATUS_KEY = '___workdirStatus'
export const STAGE_STATUS_KEY = '___stageStatus'
export const FOLDER_KEYS = [PATH_KEY, EXPANDED_KEY]
export const FILE_KEYS = [
  PATH_KEY,
  HEAD_STATUS_KEY,
  WORKDIR_STATUS_KEY,
  STAGE_STATUS_KEY,
]

type Filename = string
type StatusMatrix = [Filename, HeadStatus, WorkdirStatus, StageStatus]

export const createFileTree = async (
  files: StatusMatrix[],
  activeRepo: Repo
) => {
  const newFileTree: FileTree = {}

  const statusMatrixManifest = files.reduce((acc, file) => {
    acc[file[0]] = file
    return acc
  }, {} as Record<Filename, StatusMatrix>)

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
            [HEAD_STATUS_KEY]: statusMatrixManifest[file][1],
            [PATH_KEY]: file,
            [STAGE_STATUS_KEY]: statusMatrixManifest[file][3],
            [WORKDIR_STATUS_KEY]: statusMatrixManifest[file][2],
          }
        } else {
          // When the folder is empty, the file will be "", so we need to ignore it
          if (file) {
            // Get the value of the folder, like docs, and add the file
            const folder = get(newFileTree, inputPath)
            const fullPath = `${inputPath.join('/')}/${file}`
            folder[file] = {
              [HEAD_STATUS_KEY]: statusMatrixManifest[fullPath][1],
              [PATH_KEY]: fullPath,
              [STAGE_STATUS_KEY]: statusMatrixManifest[fullPath][3],
              [WORKDIR_STATUS_KEY]: statusMatrixManifest[fullPath][2],
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
