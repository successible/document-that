import { Methods } from '../../store/store'
import { getFS } from './getFS'

export const renameFolderOrFile = async (
  path: string,
  item: 'folder' | 'file',
  methods: Methods
) => {
  const fs = getFS()
  const prompt = window.prompt(`What is the new name of the ${item}?`)
  const newName = path.split('/').slice(0, -1).join('/') + `/${prompt}`
  if (path !== newName && prompt && /^\w+$/.test(prompt)) {
    await fs?.promises.rename(path, newName)
    await methods.recalculateData()
  }
}
