import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import React from 'react'
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
  const methods = useStore((state) => state.methods)
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
    <Group noWrap mt={10}>
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
          i: {
            height: 18,
            width: 18,
          },
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
