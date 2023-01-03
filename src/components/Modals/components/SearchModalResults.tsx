import { Box, Button, Divider, Group, Stack } from '@mantine/core'

import { groupBy } from 'lodash'
import { Updater } from 'use-immer'
import { readFile } from '../../../helpers/fs/readFile'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'
import { Matches } from '../helpers/SearchModal/findMatchesInDocuments'
import { getMatchIndices } from '../helpers/SearchModal/getMatchIndices'
import { removeLinesWithoutMatch } from '../helpers/SearchModal/removeLinesWithoutMatch'
import { splitContentIntoLines } from '../helpers/SearchModal/splitContentIntoLines'
import { splitLinesIntoChunks } from '../helpers/SearchModal/splitLinesIntoChunks'

type props = { matches: Matches; setMatches: Updater<Matches> }
export const SearchModalResults: React.FC<props> = ({
  matches,
  setMatches,
}) => {
  const colors = useStore((state) => state.colors)
  const methods = useStore((state) => state.methods)

  return (
    <Stack spacing={0}>
      {Object.keys(matches).map((key) => {
        // key = the path of the file
        const path = matches[key].path
        const content = matches[key].content
        const groups = getMatchIndices(matches, key)

        const allLines = splitContentIntoLines(content)
        const linesWithMatches = removeLinesWithoutMatch(allLines, groups)
        const linesAsChunks = splitLinesIntoChunks(linesWithMatches, groups)
        const chunksGroupedByLine = groupBy(linesAsChunks, 'lineNumber')

        return (
          <>
            <Divider mt={10} />
            <Group mt={20} mb={10}>
              <Button
                sx={{ ...styleButton(colors.button.neutral), fontSize: 16 }}
                onClick={async () => {
                  const file = await readFile(path)
                  methods.setOpenSearch(false)
                  setMatches({})
                  methods.setActiveFile({ content: file, path })
                }}
              >
                {key.split('/').slice(2).join('/')}
              </Button>
            </Group>

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
                            <Box sx={{ display: 'inline' }}>{chunk.text}</Box>
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
  )
}
