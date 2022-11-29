import { Repo } from '../../pages'
import { Methods } from '../../store/store'
import { getFS } from './getFS'
import { isFolder } from './isFolder'

export const deleteFolder = async (
  path: string,
  activeRepo: Repo | null,
  methods: Methods,
  rerender: boolean
) => {
  const fs = getFS()
  if (!fs || !activeRepo) return

  methods.setOpenDeleteFolder(true)
  methods.setFolderBeingDeleted(path)

  const recursivelyDeleteFolder = async (
    path: string,
    activeRepo: Repo | null,
    methods: Methods
  ) => {
    const directory = await isFolder(path)
    if (directory !== false) {
      for (const childPath of directory) {
        const childDir = path + '/' + childPath
        await recursivelyDeleteFolder(childDir, activeRepo, methods)
      }
      await fs?.promises.rmdir(path)
      console.log(`Deleted ${path}`)
    } else {
      // Delete the file
      await fs?.promises.unlink(path, undefined)
      methods.setFileBeingDeleted(path)
      console.log(`Deleted ${path}`)
    }
  }

  await recursivelyDeleteFolder(path, activeRepo, methods)

  methods.setOpenDeleteFolder(false)
  methods.setFolderBeingDeleted(null)

  if (rerender) {
    await methods.recalculateData()
  }
}
