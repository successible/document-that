import { Lines } from './splitContentIntoLines'

export const removeLinesWithoutMatch = (
  lines: Lines,
  matchIndices: [number, number][]
) => {
  return lines.filter((line) => {
    let inMatch = false
    const { start, text } = line
    text.split('').map((char, i) => {
      matchIndices.forEach((match) => {
        const [matchStart, matchEnd] = match
        if (i >= matchStart - start && i < matchEnd - start) {
          inMatch = true
        }
      })
    })
    return inMatch
  })
}
