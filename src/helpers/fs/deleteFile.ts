import { Methods } from '../../store/store'
import { getFS } from './getFS'

export const deleteFile = async (path: string, methods: Methods) => {
  const fs = getFS()
  await fs?.promises.unlink(path)
  await methods.recalculateData()
}
