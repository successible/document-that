import { Repo } from '../../pages'
import { getDir } from '../github/properties/getDir'
import { getFS } from './getFS'
import { isFolder } from './isFolder'

export const listContentsOfFileSystem = async (activeRepo: Repo | null) => {
  // Returns a Array of absolute file paths, without a leading slash, excluding the path of the repo
  // For example, the repo directory /foo/wiki returns ["docs/my-first-file.md", ...]

  const fs = getFS()
  const files: string[] = []

  if (!fs || !activeRepo) return files
  const dir = getDir(activeRepo)

  const parsePaths = async (inputPath: string) => {
    const folder = await isFolder(inputPath)
    if (folder) {
      const isNotEmptyFolder = folder.length >= 1
      if (isNotEmptyFolder) {
        // We don't want to show .git in the file system
        for (const path of folder.filter((p) => p !== '.git')) {
          await parsePaths(inputPath + '/' + path)
        }
      } else {
        // Here we add the EMPTY FOLDER to the file list
        files.push(inputPath.replace(`${dir}/`, '') + '/')
      }
    } else {
      // Here we add the FILE to the file list
      files.push(inputPath.replace(`${dir}/`, ''))
    }
  }

  await parsePaths(dir)

  return files
}
