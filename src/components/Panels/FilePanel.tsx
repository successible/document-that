import { Box, Stack } from '@mantine/core'
import { useMonaco } from '@monaco-editor/react'
import isTextPath from 'is-text-path'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MutableRefObject, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'

import { useStore } from '../../store/store'

import { BinaryFilePanel } from './FilePanel/components/BinaryFilePanel'
import { EmptyFilePanel } from './FilePanel/components/EmptyFilePanel'
import { PlainTextPanel } from './FilePanel/components/PlainTextPanel'
import { RichTextPanel } from './FilePanel/components/RichTextPanel'
import { useFocusCursor } from './FilePanel/hooks/useFocusCursor'
import { useHighlightOnSearch } from './FilePanel/hooks/useHighlightOnSearch'

// 700px to 800px seems a good rule of thumb for readability
// https://www.freshconsulting.com/insights/blog/uiux-principle-46-text-box-width-should-help-users-read/
export const TEXT_WIDTH = 800
export const TEXT_FONT_SIZE = 14

export type EditorRef =
  | MutableRefObject<null>
  | MutableRefObject<monaco.editor.IStandaloneCodeEditor>

export const FilePanel = () => {
  const monacoObject = useMonaco()

  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const editorOptions = useStore((state) => state.editorOptions)
  const methods = useStore((state) => state.methods)
  const sidebarOpen = useStore((state) => state.openSidebar)

  const activeData = getActiveData(activeRepo, data)
  const activeFile = activeData.file
  const line = activeFile?.line
  const path = activeFile?.path
  const isBinary = !isTextPath(path || '') || path?.includes('.svg')
  const richText = editorOptions.richText

  const fileContent = activeFile?.content || ''
  const [text, setText] = useImmer(fileContent)

  const editorRef = useRef(null) as EditorRef

  useEffect(() => {
    setText(fileContent)
  }, [fileContent, path, setText])

  useFocusCursor(path, editorOptions, editorRef)

  useHighlightOnSearch(
    activeRepo,
    data,
    editorRef,
    fileContent,
    line,
    methods,
    monacoObject
  )

  return (
    <Stack sx={{ height: 'calc(100vh - 50px)', width: '100%' }}>
      {activeFile ? (
        isBinary ? (
          <BinaryFilePanel path={path} fileContent={fileContent} />
        ) : (
          <Box
            sx={{
              height: '100%',
              margin: !sidebarOpen ? '0px auto' : undefined,
              width: '100%',
            }}
          >
            {richText ? (
              <RichTextPanel
                path={path}
                text={text}
                setText={setText}
                editorRef={editorRef}
              />
            ) : (
              <PlainTextPanel path={path} text={text} setText={setText} />
            )}
          </Box>
        )
      ) : (
        <EmptyFilePanel />
      )}
    </Stack>
  )
}

export default FilePanel
