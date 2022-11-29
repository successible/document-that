import { getFS } from './getFS'

export const isFolder = async (path: string) => {
  const fs = getFS()
  if (!fs) return false
  try {
    const directory = await fs.promises.readdir(path)
    return directory
  } catch (e) {
    if (String(e).includes('ENOTDIR')) {
      return false
    } else {
      throw e
    }
  }
}
