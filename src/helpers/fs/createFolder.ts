import { Repo } from '../../pages'
import { Methods } from '../../store/store'
import { handleError } from '../utils/handleError'
import { convertFileSystemPathToRepoPath } from './convertFileSystemPathToRepoPath'
import { getFS } from './getFS'

export const createFolder = async (
  path: string,
  activeRepo: Repo | null,
  methods: Methods
) => {
  const fs = getFS()
  // Create the folder in the file system
  if (!activeRepo || !fs) return

  // Get the name of the folder
  const name = window.prompt('What is the name of your folder?')
  if (!name || !/^\w+$/.test(name)) return

  const folderPath = `${path}/${name}`.replace('//', '/')
  try {
    // dir has a leading slash
    await fs.promises.mkdir(folderPath)
    console.log(`Created folder at ${folderPath}`)
  } catch (e) {
    console.log(`Folder at ${folderPath} exists`)
    handleError(e, methods)
  }

  // Update the file tree with the new folder
  const repoPath = convertFileSystemPathToRepoPath(path, name)
  await methods.recalculateData([
    {
      payload: { path: repoPath },
      type: 'toggle_folder_at_path',
    },
  ])
}
