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
            return (
              <>
                <Group mt={10} mb={0}>
                  {key.split('/').slice(2).join('/')}
                </Group>
                {matches[key].matches.flatMap((match) => {
                  // @ts-ignore - TypeScript does not recognize the d flag
                  const indices = match.indices as [number, number][]
                  // We need to treat the start of the line as index 0
                  // So [27, 75] needs to be [0, 50] in the eyes of the capturing group
                  const [lineStart] = indices[0]
                  const groups = indices.slice(1).map((group) => {
                    const [groupStart, groupEnd] = group
                    return [groupStart - lineStart, groupEnd - lineStart]
                  })

                  type Mode = 'group' | 'no-group'
                  type Chunks = { mode: Mode; text: string }[]
                  const groupedLine = [] as Chunks
                  let mode = 'group' as Mode
                  // Let us loop through every character to split it into group or not group
                  match[0].split('').map((char, i) => {
                    // Is the character in a group?
                    let inGroup = false
                    groups.forEach((group) => {
                      const [groupStart, groupEnd] = group
                      if (i >= groupStart && i < groupEnd) {
                        inGroup = true
                      }
                    })

                    // Create the first chunk
                    if (groupedLine.length === 0) {
                      mode = inGroup ? 'group' : 'no-group'
                      groupedLine.push({ mode, text: '' })
                    }

                    // If the mode has changed, create a new chunk
                    if (mode === 'group' && !inGroup) {
                      mode = 'no-group'
                      groupedLine.push({ mode, text: '' })
                    } else if (mode === 'no-group' && inGroup) {
                      mode = 'group'
                      groupedLine.push({ mode, text: '' })
                    }

                    // Add the next character to the text of the current chunk
                    groupedLine.slice(-1)[0].text += char
                  })

                  return (
                    <Box mt={10} mb={10} id={match[0] + match[1]}>
                      {groupedLine.map((chunk) => {
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
                              <Box sx={{ display: 'inline' }}>{chunk.text}</Box>
                            )}
                          </>
                        )
                      })}
                    </Box>
                  )
                })}
                <Divider />
              </>
            )
          })}
        </Stack>
      </Stack>
    </Modal>
  )
}
