import { Repo } from '../../pages'
import { getDir } from '../github/properties/getDir'

export const getPathInFileSystem = (
  activeRepo: Repo | null,
  fullPath: string[]
) => {
  return getDir(activeRepo) + '/' + fullPath.join('/')
}
