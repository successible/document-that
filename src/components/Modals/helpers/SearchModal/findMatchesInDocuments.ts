import { getPathInFileSystem } from '../../../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../../../helpers/fs/readFile'
import { Repo } from '../../../../pages'

export type Matches = Record<
  string,
  { path: string; content: string; matches: RegExpMatchArray[] }
>

export const findMatchesInDocuments = async (
  files: [string, number, number, number][],
  activeRepo: Repo,
  term: string,
  options: {
    caseSensitive: boolean
  }
) => {
  const { caseSensitive } = options
  const documents = {} as Matches

  for (const fileInfo of files) {
    const isBinary = /svg|png|jpeg|jpg|png|gif/.test(fileInfo[0])
    if (!isBinary) {
      const path = getPathInFileSystem(activeRepo, fileInfo[0].split('/'))
      const content = await readFile(path)
      const flags = 'gmd'
      const matches = Array.from(
        content.matchAll(
          new RegExp(`${term}`, caseSensitive ? flags : flags + 'i')
        )
      )
      if (matches.length > 0) {
        documents[path] = { content, matches, path }
      }
    }
  }

  return documents
}
