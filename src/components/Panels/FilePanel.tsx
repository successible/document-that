import { Alert, Box, Burger, Stack, Text, Title } from '@mantine/core'
import Editor, { Monaco } from '@monaco-editor/react'
import matter from 'gray-matter'
import { MutableRefObject, useEffect, useRef } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { writeFile } from '../../helpers/fs/writeFile'
import { useStore } from '../../store/store'
import { getWikiMarkdownLanguage } from '../../theme/language'
import { getTheme } from '../../theme/theme'

const FilePanel = () => {
  const methods = useStore((state) => state.methods)
  const colors = useStore((state) => state.colors)
  const data = useStore((state) => state.data)
  const activeRepo = useStore((state) => state.activeRepo)
  const activeFile = getActiveData(activeRepo, data).file
  const path = activeFile?.path
  const fileContent = activeFile?.content || ''
  const [text, setText] = useImmer(matter(fileContent).content)

  const editorRef = useRef(null) as
    | MutableRefObject<null>
    | MutableRefObject<Monaco['editor']>

  useEffect(() => {
    setText(matter(fileContent).content)
  }, [fileContent, setText])

  const isBinary = fileContent.includes('�') || path?.includes('.svg')

  return (
    <Stack sx={{ height: 'calc(100vh - 50px)', width: '100%' }}>
      {activeFile ? (
        isBinary ? (
          <Stack
            data-foo="bar"
            sx={{
              margin: '0px auto',
              maxWidth: 500,
              width: '90%',
            }}
          >
            <Alert
              icon={<AlertCircle size={16} />}
              mb={20}
              title="This is a binary file"
            >
              Binary files include PDFs, images, etc.
            </Alert>
          </Stack>
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
            }}
          >
            <Editor
              height="100%"
              width="100%"
              theme="WikiMarkdownTheme"
              options={{
                lineNumbers: 'off',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'wordWrapColumn',
                wordWrapColumn: 120,
              }}
              language="WikiMarkdown"
              defaultValue={text}
              value={text}
              onChange={async (text) => {
                if (text) {
                  setText(text)
                  path && (await writeFile(path, text))
                  await methods.recalculateData()
                }
              }}
              beforeMount={(monaco: Monaco) => {
                monaco.languages.register({ id: 'WikiMarkdown' })
                monaco.languages.setMonarchTokensProvider(
                  'WikiMarkdown',
                  getWikiMarkdownLanguage()
                )
                monaco.editor.defineTheme('WikiMarkdownTheme', getTheme(colors))
              }}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onMount={(editor: any, monaco: Monaco) => {
                editorRef.current = editor
              }}
            />
          </Box>
        )
      ) : (
        <Stack
          justify="center"
          sx={{
            height: '100%',
            margin: '0px auto',
            maxWidth: 500,
            width: '90%',
          }}
        >
          <>
            <Title
              sx={{
                '@media (min-width: 768px)': {
                  marginTop: 0,
                },
                fontWeight: 900,
                marginTop: 75,
                textAlign: 'center',
              }}
            >
              So empty!
            </Title>
            <Text size="xl" weight={500} mb={10}>
              Open the sidebar and select a file to start writing.
            </Text>
            <Alert>
              To open the sidebar, click or tap the{' '}
              <Burger
                opened={false}
                size={16}
                sx={{
                  position: 'relative',
                  top: -4,
                }}
              />{' '}
              icon on the top of the screen.
            </Alert>
          </>
        </Stack>
      )}
    </Stack>
  )
}

export default FilePanel
