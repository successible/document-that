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
            type Chunks = { mode: Mode; text: string; line: number }[]
            const groupedDocument = [] as Chunks
            let mode = 'group' as Mode
            let line = 0

            let start = 0
            let end = 0
            let text = ''
            const lines = [] as { end: number; start: number; text: string }[]

            content.split('').map((char, i) => {
              if (char === '\n') {
                // Do not capture the front matter lines, dividers, or empty lines
                if (text !== '' && text !== '---') {
                  lines.push({ end, start, text })
                }
                start = i + 1
                end = i + 1
                text = ''
              } else {
                end += 1
                text += char
              }
            })

            // Let us loop through every character to split it into group or not group
            content.split('').map((char, i) => {
              // What line are we on?
              if (char === '\n') {
                line += 1
              }

              // Is the character in a group?
              let inGroup = false
              groups.forEach((group) => {
                const [groupStart, groupEnd] = group
                if (i >= groupStart && i < groupEnd) {
                  inGroup = true
                }
              })

              // Create the first chunk
              if (groupedDocument.length === 0) {
                mode = inGroup ? 'group' : 'no-group'
                groupedDocument.push({ line, mode, text: '' })
              }

              // If the mode has changed, create a new chunk
              if (mode === 'group' && !inGroup) {
                mode = 'no-group'
                groupedDocument.push({ line, mode, text: '' })
              } else if (mode === 'no-group' && inGroup) {
                mode = 'group'
                groupedDocument.push({ line, mode, text: '' })
              }

              // Add the next character to the text of the current chunk
              groupedDocument.slice(-1)[0].text += char
            })

            console.log(groupedDocument)

            return (
              <>
                <Group mt={10} mb={10}>
                  {key.split('/').slice(2).join('/')}
                </Group>
                {/* <Box>
                  {groupedDocument.map((chunk) => {
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
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {chunk.text}
                          </Box>
                        ) : (
                          <Box
                            sx={{ display: 'inline', whiteSpace: 'pre-wrap' }}
                          >
                            {chunk.text}
                          </Box>
                        )}
                      </>
                    )
                  })}
                </Box> */}

                <Divider mt={20} />
              </>
            )
          })}
        </Stack>
      </Stack>
    </Modal>
  )
}
