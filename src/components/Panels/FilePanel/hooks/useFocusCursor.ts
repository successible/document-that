import { useEffect } from 'react'
import { EditorOptions } from '../../../../store/store'
import { EditorRef } from '../../FilePanel'

// This useEffect handles the cursor focus
// That occurs toggling between rich text mode and plain text mode

export const useFocusCursor = (
  path: string | undefined,
  editorOptions: EditorOptions,
  editorRef: EditorRef
) => {
  useEffect(() => {
    const editor = editorRef.current
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
  }, [editorOptions.richText, editorRef, path])
}
