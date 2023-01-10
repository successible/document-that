import produce from 'immer'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useEffect } from 'react'
import { getActiveData } from '../../../../helpers/fs/getActiveData'
import { Repo } from '../../../../pages'
import { Data, Methods } from '../../../../store/store'
import { EditorRef } from '../../FilePanel'

export const useHighlightOnSearch = (
  activeRepo: Repo | null,
  data: Data,
  editorRef: EditorRef,
  fileContent: string,
  line: number | undefined,
  methods: Methods,
  monacoObject: typeof monaco | null
) => {
  // This useEffect handles the highlighting
  // That occurs after searching a line

  useEffect(() => {
    const editor = editorRef.current
    if (line !== undefined && line !== null && editor && monacoObject) {
      const lengthOfLine = fileContent.split('\n')[line].length
      setTimeout(() => {
        editor.setSelection(
          // Lines and columns in VS Code are not 0-indexed. Instead, they are 1-indexed
          new monacoObject.Selection(line + 1, 0, line + 1, lengthOfLine + 1)
        )
      }, 0)

      // Once the term has been highlighted, we want to remove the line from activeData
      // That way when you return to the page, the term does not stay highlighted
      const newData = produce(data, (draft) => {
        const file = getActiveData(activeRepo, draft).file
        if (file) {
          file.line = undefined
        }
      })
      methods.setData(newData)
    }
  }, [activeRepo, data, editorRef, fileContent, line, methods, monacoObject])
}
