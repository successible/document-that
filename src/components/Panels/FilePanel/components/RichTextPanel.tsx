import { useViewportSize } from '@mantine/hooks'
import Editor, { Monaco } from '@monaco-editor/react'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { MutableRefObject } from 'react'
import { toast } from 'react-hot-toast'
import { Updater } from 'use-immer'
import { writeFile } from '../../../../helpers/fs/writeFile'
import { MOBILE_WIDTH } from '../../../../helpers/utils/isMobile'
import { useStore } from '../../../../store/store'
import { getWikiMarkdownLanguage } from '../../../../theme/language'
import { getTheme } from '../../../../theme/theme'
import { TEXT_FONT_SIZE, TEXT_WIDTH } from '../../FilePanel'

type props = {
  path: string | undefined
  text: string
  setText: Updater<string>
  editorRef:
    | MutableRefObject<null>
    | MutableRefObject<monaco.editor.IStandaloneCodeEditor>
}

export const RichTextPanel: React.FC<props> = ({
  editorRef,
  path,
  setText,
  text,
}) => {
  const colors = useStore((state) => state.colors)
  const editorOptions = useStore((state) => state.editorOptions)
  const methods = useStore((state) => state.methods)

  const { width } = useViewportSize()

  return (
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
        wordBasedSuggestions: false,
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
        monaco.editor.defineTheme('WikiMarkdownTheme', getTheme(colors))
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onMount={(
        editor: monaco.editor.IStandaloneCodeEditor | null,
        monaco: Monaco
      ) => {
        editorRef.current = editor
        if (editor) {
          editor.addAction({
            id: 'search-files-by-name',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP],
            label: 'Search files by name',
            run: () => {
              methods.setOpenNameSearch(true)
            },
          })
          editor.addAction({
            id: 'save-file',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            label: 'Save file',
            run: () => {
              toast.success('File saved')
            },
          })
          editor.addAction({
            id: 'change-editor-mode',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],
            label: 'Change editor mode',
            run: () => {
              methods.setEditorOptions({
                ...editorOptions,
                richText: !editorOptions.richText,
              })
            },
          })
        }
      }}
    />
  )
}
