import { getFS } from './getFS'

export const createFolderRecursively = async (path: string) => {
  const fs = getFS()
  if (!fs) return

  let folderToCreate = ''
  // 1 to omit the "" from the leading /
  // - 1 to omit the file extension
  // Basically, if /foo/bar/baz.png => ["", foo, bar, baz.png] we need to omit the first and last value
  for (const p of path.split('/').slice(1, -1)) {
    folderToCreate = folderToCreate + '/' + p
    try {
      await fs.promises.mkdir(folderToCreate)
    } catch (e) {
      if (String(e).includes('EEXIST')) {
        console.log(`${folderToCreate} exists`)
      } else {
        console.log(e)
      }
    }
  }
}
