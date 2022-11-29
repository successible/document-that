import { getFS } from './getFS'

export const writeFile = async (path: string, content: string) => {
  const fs = getFS()
  await fs?.promises.writeFile(path, content)
}
