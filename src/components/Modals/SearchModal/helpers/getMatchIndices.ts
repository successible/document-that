import { Matches } from './findMatchesInDocuments'

export const getMatchIndices = (matches: Matches, key: string) => {
  const indices = matches[key].matches.flatMap((match) => {
    // The d flag is used to get the index of each match or capturing group
    // @ts-ignore - TypeScript does not recognize the d flag
    const indices = match.indices[0] as [number, number]
    return [indices]
  })
  return indices
}
