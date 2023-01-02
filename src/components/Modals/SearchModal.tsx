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
import { styleButton } from '../../helpers/utils/theme/styleButton'
import { useStore } from '../../store/store'
import {
  findMatchesInDocuments,
  Matches,
} from './helpers/SearchModal/findMatchesInDocuments'
import { getMatchIndices } from './helpers/SearchModal/getMatchIndices'
import { removeLinesWithoutMatch } from './helpers/SearchModal/removeLinesWithoutMatch'
import { splitContentIntoLines } from './helpers/SearchModal/splitContentIntoLines'
import { splitLinesIntoChunks } from './helpers/SearchModal/splitLinesIntoChunks'

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
        <Title>Search documents</Title>
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
          <Button sx={{ ...styleButton(colors.button.primary) }} type="submit">
            Submit
          </Button>
        </form>

        <Stack spacing={0}>
          {Object.keys(matches).map((key) => {
            // key = the path of the file
            const content = matches[key].content
            const groups = getMatchIndices(matches, key)

            const chunksGroupedByLine = groupBy(
              splitLinesIntoChunks(
                removeLinesWithoutMatch(splitContentIntoLines(content), groups),
                groups
              ),
              'lineNumber'
            )

            return (
              <>
                <Divider />
                <Group mt={10} mb={10}>
                  <Button
                    sx={{ ...styleButton(colors.button.neutral) }}
                    onClick={() => {}}
                  >
                    {key.split('/').slice(2).join('/')}
                  </Button>
                </Group>
                <Divider />

                <Box>
                  {Object.keys(chunksGroupedByLine).flatMap((line) => {
                    const chunks = chunksGroupedByLine[line]
                    return (
                      <Box
                        mt={10}
                        mb={10}
                        sx={{
                          width: '100%',
                        }}
                      >
                        {chunks.map((chunk) => {
                          return (
                            <>
                              {chunk.mode === 'in-match' ? (
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
              </>
            )
          })}
        </Stack>
      </Stack>
    </Modal>
  )
}
