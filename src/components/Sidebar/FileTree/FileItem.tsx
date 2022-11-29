import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import React from 'react'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../../helpers/fs/readFile'
import { getIcon } from '../../../helpers/utils/components/getIcon'
import { isMobile } from '../../../helpers/utils/isMobile'
import { useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'

type props = { name: string; fullPath: string[] }
export const FileItem: React.FC<props> = ({ fullPath, name }) => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)
  const activeFile = getActiveData(activeRepo, data).file
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))

  const iconContainer = createStyles({
    'icon-container': {
      i: {
        color: colors.text,
        fontStyle: 'normal',
      },
    },
  })().classes['icon-container']

  return (
    <Group
      noWrap
      sx={{
        backgroundColor:
          activeFile?.path === path ? colors.foreground : 'inherit',
        border: '1px solid transparent',
        borderColor:
          activeFile?.path === path ? colors.button.secondary : 'transparent',
        borderRadius: 3,
        marginTop: 10,
        padding: '1px 5px',
        width: '100%',
      }}
    >
      <UnstyledButton
        className={iconContainer}
        key={`text-${name}`}
        onClick={async () => {
          if (activeRepo) {
            const file = await readFile(path)
            methods.setActiveFile({ content: file, path })
            if (isMobile()) {
              methods.setOpenSidebar(false)
            }
          }
        }}
        sx={{
          '&:hover .mantine-Text-root': {
            color: colors.button.secondary,
          },
          '&:hover i': {
            color: colors.button.secondary,
          },
          outlineColor: `${colors.button.secondary} !important`,
          outlineWidth: `1px !important`,
          width: '100%',
        }}
      >
        <Group noWrap spacing={0}>
          <i className={`${getIcon(name)}`}></i>
          <Text ml={10} size="md">
            {name}
          </Text>
        </Group>
      </UnstyledButton>
      <DotsButton fullPath={fullPath} isFolder={false} name={name} />
    </Group>
  )
}
