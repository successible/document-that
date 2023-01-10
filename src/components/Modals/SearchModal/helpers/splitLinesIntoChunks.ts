import { Lines } from './splitContentIntoLines'

export type ChunkMode = 'in-match' | 'not-in-match'
export type LineChunks = { mode: ChunkMode; text: string; lineNumber: number }[]

export const splitLinesIntoChunks = (
  lines: Lines,
  matchIndices: [number, number][]
) => {
  const groupedDocument = [] as LineChunks

  lines.map((line) => {
    let mode = 'in-match' as ChunkMode
    const { lineNumber, start, text } = line
    text.split('').map((char, i) => {
      let inMatch = false
      matchIndices.forEach((match) => {
        const [matchStart, matchEnd] = match
        if (i >= matchStart - start && i < matchEnd - start) {
          inMatch = true
        }
      })

      // Create the first chunk
      if (groupedDocument.length === 0) {
        mode = inMatch ? 'in-match' : 'not-in-match'
        groupedDocument.push({ lineNumber, mode, text: '' })
      }

      // If the mode has changed, create a new chunk
      if (mode === 'in-match' && !inMatch) {
        mode = 'not-in-match'
        groupedDocument.push({ lineNumber, mode, text: '' })
      } else if (mode === 'not-in-match' && inMatch) {
        mode = 'in-match'
        groupedDocument.push({ lineNumber, mode, text: '' })
      }

      // Add the next character to the text of the current chunk
      groupedDocument.slice(-1)[0].text += char
    })
  })

  return groupedDocument
}
