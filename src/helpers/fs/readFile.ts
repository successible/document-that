import isTextPath from 'is-text-path'
import { getFS } from './getFS'

export const readFile = async (path: string): Promise<string> => {
  const fs = getFS()
  try {
    const file = await fs?.promises.readFile(
      path,
      isTextPath(path) ? { encoding: 'utf8' } : undefined
    )
    if (!file) return ''
    if (typeof file === 'string') return file
    const blob = new Blob(
      [file.buffer],
      path.includes('.pdf') ? { type: 'application/pdf' } : {}
    )
    const url = URL.createObjectURL(blob)
    return url
  } catch (e) {
    return ''
  }
}
