import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { Colors } from './colors'

export const getTheme = (
  colors: Colors
): monaco.editor.IStandaloneThemeData => {
  return {
    base: 'vs-dark',
    colors: {
      'editor.background': colors.background,
      // Search (with cmd + f or ctrl + f)
      'editor.findMatchBackground': colors.comment,
      'editor.findMatchHighlightBackground': colors.comment,
      'editor.foreground': colors.text,
      // Highlighting or selecting rows
      'editor.inactiveSelectionBackground': colors.highlight,
      'editor.selectionBackground': colors.highlight,
      'editor.selectionHighlightBackground': colors.highlight,
    },
    inherit: true,
    rules: [
      {
        foreground: colors.emphasis,
        token: 'string',
      },
      {
        fontStyle: 'bold',
        foreground: colors.heading,
        token: 'keyword',
      },
      {
        foreground: colors.code,
        token: 'variable',
      },
      {
        foreground: colors.divider,
        token: 'meta.separator',
      },
      {
        foreground: colors.link.body,
        token: 'string.target',
      },
      {
        foreground: colors.link.body,
        token: 'string.link',
      },
      {
        fontStyle: 'bold',
        foreground: colors.bold,
        token: 'strong',
      },
      {
        fontStyle: 'bold',
        foreground: colors.emphasis,
        token: 'emphasis',
      },
      {
        foreground: colors.comment,
        token: 'comment',
      },
      {
        fontStyle: 'italic',
        foreground: colors.quote,
        token: 'quote',
      },
      {
        foreground: colors.link.body,
        token: 'wiki-link',
      },
      {
        foreground: colors.link.url,
        token: 'url',
      },
    ],
  }
}
