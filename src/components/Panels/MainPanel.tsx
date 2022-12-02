import { createStyles, Group } from '@mantine/core'
import { useStore } from '../../store/store'
import FilePanel from './FilePanel'
import { Introduction } from './Introduction'

export const MainPanel = () => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)

  const { classes } = createStyles(() => ({
    shell: {
      '@media (min-width: 768px)': {
        alignItems: 'center',
      },
      // Required so the Milkdown editor wraps properly
      // And doesn't horizontally scroll
      '> div:nth-of-type(2)': {
        minWidth: 0,
      },
      alignItems: 'flex-start',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 50px)',
      overflowX: 'hidden',
      overflowY: 'auto',
      width: '100%',
    },
  }))()

  return (
    <Group
      className={classes.shell}
      noWrap={true}
      spacing={0}
      sx={{
        width: '100vw',
      }}
    >
      <Group
        sx={{
          width: '100%',
        }}
      >
        {activeRepo ? <FilePanel /> : <Introduction />}
      </Group>
    </Group>
  )
}
