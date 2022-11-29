import { Methods } from '../../store/store'
import { convertFileSystemPathToRepoPath } from './convertFileSystemPathToRepoPath'
import { getFS } from './getFS'

export const createFile = async (path: string, methods: Methods) => {
  const fs = getFS()
  if (!fs) return

  const prompt = window.prompt(`What is the new name of the file?`)
  const filePath = path + '/' + prompt
  await fs?.promises.writeFile(filePath, '')
  await methods.recalculateData([
    {
      payload: { path: convertFileSystemPathToRepoPath(path) },
      type: 'toggle_folder_at_path',
    },
  ])
  // toggle_folder_at_path is not aware of the new file, and omits it from the file tree
  // We need to run recalculateData to include it
  await methods.recalculateData()
}
