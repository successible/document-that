import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { groupBy } from 'lodash'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import {
  findMatchesInDocuments,
  Matches,
} from '../../helpers/utils/findMatchesInDocuments'
import { useStore } from '../../store/store'

export const SearchModal = () => {
  const [text, setText] = useImmer('')
  const [matches, setMatches] = useImmer({} as Matches)

  const colors = useStore((state) => state.colors)
  const openSearch = useStore((state) => state.openSearch)
  const methods = useStore((state) => state.methods)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const activeData = getActiveData(activeRepo, data)
  return (
    <Modal
      size={'800px'}
      onClose={() => {
        methods.setOpenSearch(false)
      }}
      opened={openSearch}
    >
      <Stack>
        <Title>Search</Title>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (activeRepo && text && text !== '') {
              const matches = await findMatchesInDocuments(
                activeData.files,
                activeRepo,
                text
              )
              setMatches(matches)
            }
          }}
        >
          <TextInput
            mb={10}
            placeholder="Value to search"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
        <Stack spacing={0}>
          {Object.keys(matches).map((key) => {
            const content = matches[key].content
            const groups = matches[key].matches.flatMap((match) => {
              // @ts-ignore - TypeScript does not recognize the d flag
              const group = match.indices[0] as [number, number]
              return [group]
            })

            type Mode = 'group' | 'no-group'
            type Chunks = { mode: Mode; text: string; lineNumber: number }[]
            const groupedDocument = [] as Chunks

            let start = 0
            let end = 0
            let text = ''
            let lineNumber = 0
            const lines = [] as {
              end: number
              start: number
              text: string
              lineNumber: number
            }[]

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

            // First, we want to remove all lines that do not have a capturing group or match in them
            const filteredLines = lines.filter((line) => {
              let inGroup = false
              const { start, text } = line
              text.split('').map((char, i) => {
                groups.forEach((group) => {
                  const [groupStart, groupEnd] = group
                  if (i >= groupStart - start && i < groupEnd - start) {
                    inGroup = true
                  }
                })
              })
              return inGroup
            })

            console.log(filteredLines)

            // Next, within each line, we want to assign each character
            // As either being in or out of the capturing group and add it to a chunk.
            // That way, we can assign it styles depending on whether
            // It is in the group or not

            filteredLines.map((line) => {
              let mode = 'group' as Mode
              const { lineNumber, start, text } = line
              text.split('').map((char, i) => {
                let inGroup = false
                groups.forEach((group) => {
                  const [groupStart, groupEnd] = group
                  if (i >= groupStart - start && i < groupEnd - start) {
                    inGroup = true
                  }
                })

                // Create the first chunk
                if (groupedDocument.length === 0) {
                  mode = inGroup ? 'group' : 'no-group'
                  groupedDocument.push({ lineNumber, mode, text: '' })
                }

                // If the mode has changed, create a new chunk
                if (mode === 'group' && !inGroup) {
                  mode = 'no-group'
                  groupedDocument.push({ lineNumber, mode, text: '' })
                } else if (mode === 'no-group' && inGroup) {
                  mode = 'group'
                  groupedDocument.push({ lineNumber, mode, text: '' })
                }

                // Add the next character to the text of the current chunk
                groupedDocument.slice(-1)[0].text += char
              })
            })

            // Finally, we render the chunks created above.

            console.log(groupedDocument)
            const groupedDocumentByLine = groupBy(groupedDocument, 'lineNumber')

            return (
              <>
                <Group mt={10} mb={10}>
                  {key.split('/').slice(2).join('/')}
                </Group>

                <Box>
                  {Object.keys(groupedDocumentByLine).flatMap((line) => {
                    const document = groupedDocumentByLine[line]
                    return (
                      <Box
                        mt={10}
                        mb={10}
                        sx={{
                          width: '100%',
                        }}
                      >
                        {document.map((chunk) => {
                          return (
                            <>
                              {chunk.mode === 'group' ? (
                                <Box
                                  sx={{
                                    backgroundColor: colors.button.primary,
                                    borderRadius: '5px',
                                    color: colors.text,
                                    display: 'inline',
                                    fontWeight: 700,
                                    padding: '2px 4px',
                                  }}
                                >
                                  {chunk.text}
                                </Box>
                              ) : (
                                <Box sx={{ display: 'inline' }}>
                                  {chunk.text}
                                </Box>
                              )}
                            </>
                          )
                        })}
                      </Box>
                    )
                  })}
                </Box>
                <Divider mt={20} />
              </>
            )
          })}
        </Stack>
      </Stack>
    </Modal>
  )
}
