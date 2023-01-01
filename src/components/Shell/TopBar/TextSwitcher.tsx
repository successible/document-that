import { Button } from '@mantine/core'
import produce from 'immer'
import React from 'react'
import { useStore } from '../../../store/store'

export const TextSwitcher = () => {
  const colors = useStore((state) => state.colors)
  const editorOptions = useStore((state) => state.editorOptions)
  const methods = useStore((state) => state.methods)
  return (
    <Button
      sx={{
        fontSize: '13px',
        outlineColor: `${colors.outline} !important`,
      }}
      compact
      onClick={() => {
        methods.setEditorOptions(
          produce(editorOptions, (draft) => {
            draft.richText = !draft.richText
          })
        )
      }}
      styles={(theme) => ({
        root: {
          '&:hover': {
            backgroundColor: theme.fn.darken(colors.button.primary, 0.05),
          },
          backgroundColor: colors.button.primary,
        },
      })}
    >
      {editorOptions.richText ? 'Rich' : 'Plain'} text
    </Button>
  )
}
