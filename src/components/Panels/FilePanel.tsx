import { Alert, Box, Stack, Text, Title } from '@mantine/core'
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MutableRefObject, useEffect, useRef } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { writeFile } from '../../helpers/fs/writeFile'
import { useStore } from '../../store/store'
import { getWikiMarkdownLanguage } from '../../theme/language'
import { getTheme } from '../../theme/theme'
import { SidebarAlert } from './Alerts/SidebarAlert'

export const FilePanel = () => {
  const methods = useStore((state) => state.methods)
  const colors = useStore((state) => state.colors)
  const data = useStore((state) => state.data)
  const activeRepo = useStore((state) => state.activeRepo)
  const activeFile = getActiveData(activeRepo, data).file
  const path = activeFile?.path
  const fileContent = activeFile?.content || ''
  const [text, setText] = useImmer(fileContent)
  const sidebarOpen = useStore((state) => state.openSidebar)

  const editorRef = useRef(null) as
    | MutableRefObject<null>
    | MutableRefObject<monaco.editor.IStandaloneCodeEditor>

  useEffect(() => {
    setText(fileContent)
  }, [fileContent, setText])

  useEffect(() => {
    const editor = editorRef.current
    if (editor && activeFile?.path) {
      editor.setScrollTop(0)
    }
  }, [activeFile?.path])

  const isBinary = fileContent.includes('�') || path?.includes('.svg')

  return (
    <Stack sx={{ height: 'calc(100vh - 50px)', width: '100%' }}>
      {activeFile ? (
        isBinary ? (
          <Stack
            justify="center"
            sx={{
              height: '100%',
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
              These include images and PDFs
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
                fontSize: 13,
                lineNumbers: 'off',
                minimap: { enabled: false },
                padding: { bottom: 15, top: 15 },
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
            <Text size="xl" weight={500} mb={10} align="center">
              {sidebarOpen
                ? 'Select a file on the sidebar to start writing ⚡'
                : 'Open the sidebar and select a file to start writing ⚡'}
            </Text>
            <SidebarAlert />
          </>
        </Stack>
      )}
    </Stack>
  )
}

export default FilePanel
