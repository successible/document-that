import { Repo } from '../../pages'
import { getPathInFileSystem } from '../fs/getPathInFileSystem'
import { readFile } from '../fs/readFile'

export type Matches = Record<
  string,
  { path: string; matches: RegExpMatchArray[] }
>

export const findMatchesInDocuments = async (
  files: [string, number, number, number][],
  activeRepo: Repo,
  term: string
) => {
  const documents = {} as Matches

  for (const fileInfo of files) {
    const isBinary = /svg|png|jpeg|jpg|png|gif/.test(fileInfo[0])
    if (!isBinary) {
      const path = getPathInFileSystem(activeRepo, fileInfo[0].split('/'))
      const content = await readFile(path)
      const matches = Array.from(
        content.matchAll(new RegExp(`^.*(${term}).*$`, 'gim'))
      )
      if (matches.length > 0) {
        documents[path] = { matches, path }
      }
    }
  }

  return documents
}
