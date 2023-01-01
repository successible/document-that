import { Alert, Box, Stack, Text, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MutableRefObject, useEffect, useRef } from 'react'
import { AlertCircle } from 'tabler-icons-react'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { writeFile } from '../../helpers/fs/writeFile'
import { MOBILE_WIDTH } from '../../helpers/utils/isMobile'
import { useStore } from '../../store/store'
import { getWikiMarkdownLanguage } from '../../theme/language'
import { getTheme } from '../../theme/theme'
import { SidebarAlert } from './Alerts/SidebarAlert'

export const FilePanel = () => {
  const methods = useStore((state) => state.methods)
  const colors = useStore((state) => state.colors)
  const data = useStore((state) => state.data)
  const editorOptions = useStore((state) => state.editorOptions)
  const sidebarOpen = useStore((state) => state.openSidebar)

  const activeRepo = useStore((state) => state.activeRepo)
  const activeFile = getActiveData(activeRepo, data).file
  const path = activeFile?.path
  const fileContent = activeFile?.content || ''
  const [text, setText] = useImmer(fileContent)

  const editorRef = useRef(null) as
    | MutableRefObject<null>
    | MutableRefObject<monaco.editor.IStandaloneCodeEditor>

  useEffect(() => {
    setText(fileContent)
  }, [fileContent, setText])

  useEffect(() => {
    const editor = editorRef.current
    const path = activeFile?.path
    const richText = editorOptions.richText
    // Focus and bring the cursor to the top of the Monaco editor.
    if (editor && path && richText) {
      editor.setScrollTop(0)
      editor.focus()
      setTimeout(() => {
        editor.setPosition({ column: 1, lineNumber: 1 })
      }, 0)
      // Focus and bring the cursor to the top of the <textarea />.
    } else if (path && !richText) {
      const textarea = document.getElementsByTagName('textarea')
      if (textarea.length === 1) {
        textarea[0].focus()
        setTimeout(() => {
          textarea[0].setSelectionRange(0, 0)
        }, 0)
      }
    }
  }, [activeFile?.path, editorOptions.richText])

  const isBinary = fileContent.includes('�') || path?.includes('.svg')
  const { width } = useViewportSize()

  // 700px seems a good rule of thumb for readability
  // https://www.freshconsulting.com/insights/blog/uiux-principle-46-text-box-width-should-help-users-read/
  const TEXT_WIDTH = 700
  const TEXT_FONT_SIZE = 14

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
              margin: !sidebarOpen ? '0px auto' : undefined,
              width: '100%',
            }}
          >
            {editorOptions.richText ? (
              <Editor
                height="100%"
                width={width <= MOBILE_WIDTH ? '100%' : TEXT_WIDTH}
                theme="WikiMarkdownTheme"
                options={{
                  fontFamily: 'Fira Code, monospace',
                  fontLigatures: true,
                  fontSize: TEXT_FONT_SIZE,
                  lineNumbers: 'off',
                  minimap: { enabled: false },
                  padding: { bottom: 15, top: 15 },
                  scrollbar: { verticalScrollbarSize: 0 },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
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
                  monaco.editor.defineTheme(
                    'WikiMarkdownTheme',
                    getTheme(colors)
                  )
                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onMount={(editor: any, monaco: Monaco) => {
                  editorRef.current = editor
                }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  textarea: {
                    '&::-webkit-scrollbar': {
                      display: 'none',
                      width: '0px',
                    },
                    backgroundColor: colors.background,
                    borderWidth: 0,
                    color: colors.text,
                    display: 'block',
                    fontFamily: 'Fira Code, monospace',
                    fontSize: TEXT_FONT_SIZE,
                    height: '100%',
                    lineHeight: 1.4,
                    outlineWidth: 0,
                    padding: '15px 26px',
                    resize: 'none',
                    scrollbarWidth: 'none',
                    width: width <= MOBILE_WIDTH ? '100%' : TEXT_WIDTH,
                  },
                  width: '100%',
                }}
              >
                <textarea
                  id="plainTextEditor"
                  value={text}
                  onChange={async (e) => {
                    const text = e.target.value
                    if (text) {
                      setText(e.target.value)
                      path && (await writeFile(path, text))
                      await methods.recalculateData()
                    }
                  }}
                ></textarea>
              </Box>
            )}
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
