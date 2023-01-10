export type Lines = {
  end: number
  start: number
  text: string
  lineNumber: number
}[]

export const splitContentIntoLines = (content: string) => {
  let start = 0
  let end = 0
  let text = ''
  let lineNumber = 0

  const lines = [] as Lines

  content.split('').map((char, i) => {
    if (char === '\n') {
      // Do not capture the front matter lines, dividers, or empty lines
      text += char
      lines.push({ end, lineNumber, start, text })
      lineNumber += 1
      start = i + 1
      end = i + 1
      text = ''
    } else {
      end += 1
      text += char
    }
  })

  return lines
}
