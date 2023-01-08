import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  UnstyledButton,
} from '@mantine/core'

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
export const DocumentSearchModalResults: React.FC<props> = ({
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
          <Box key={path}>
            <Divider mt={10} />
            <Group mt={20} mb={10}>
              <Button
                sx={{ ...styleButton(colors.foreground), fontSize: 16 }}
                onClick={async () => {
                  const file = await readFile(path)
                  methods.setOpenDocumentSearch(false)
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
                  <UnstyledButton
                    onClick={async () => {
                      const file = await readFile(path)
                      methods.setOpenDocumentSearch(false)
                      setMatches({})
                      methods.setActiveFile({
                        content: file,
                        line: Number(line),
                        path,
                      })
                    }}
                    key={path + line}
                    mt={10}
                    mb={10}
                    sx={{
                      '&:hover, &:active': {
                        backgroundColor: colors.foreground,
                      },
                      borderRadius: 5,
                      lineHeight: '1.6',
                      padding: '2px 10px',
                      width: '100%',
                    }}
                  >
                    {chunks.map((chunk, i) => {
                      return (
                        <Box sx={{ display: 'inline' }} key={i}>
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
                        </Box>
                      )
                    })}
                  </UnstyledButton>
                )
              })}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
