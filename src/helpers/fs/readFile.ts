import { getFS } from './getFS'

export const readFile = async (path: string): Promise<string> => {
  const fs = getFS()
  let file = ''
  try {
    const fileBlob = await fs?.promises.readFile(path, { encoding: 'utf8' })
    file = String(fileBlob || '')
    return file
  } catch (e) {
    return ''
  }
}
