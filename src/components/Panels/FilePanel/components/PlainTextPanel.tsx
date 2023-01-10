import { Box } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { Updater } from 'use-immer'
import { writeFile } from '../../../../helpers/fs/writeFile'
import { MOBILE_WIDTH } from '../../../../helpers/utils/isMobile'
import { useStore } from '../../../../store/store'
import { TEXT_FONT_SIZE, TEXT_WIDTH } from '../../FilePanel'

type props = {
  path: string | undefined
  text: string
  setText: Updater<string>
}
export const PlainTextPanel: React.FC<props> = ({ path, setText, text }) => {
  const colors = useStore((state) => state.colors)
  const methods = useStore((state) => state.methods)

  const { width } = useViewportSize()

  return (
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
  )
}
