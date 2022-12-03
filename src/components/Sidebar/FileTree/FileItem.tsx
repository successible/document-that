import { Box, createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import React from 'react'
import {
  STAGE_STATUS_KEY,
  WORKDIR_STATUS_KEY,
} from '../../../helpers/fs/createFileTree'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../../helpers/fs/readFile'
import { getIcon } from '../../../helpers/utils/components/getIcon'
import { isMobile } from '../../../helpers/utils/isMobile'
import { File, useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'

type props = { name: string; fullPath: string[]; file: File }
export const FileItem: React.FC<props> = ({ file, fullPath, name }) => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))

  const workdirStatus = file[WORKDIR_STATUS_KEY]
  const stageStatus = file[STAGE_STATUS_KEY]

  const isNew = workdirStatus === 2 && stageStatus === 0
  const isEdited = workdirStatus === 2 && stageStatus !== 0

  const iconContainer = createStyles({
    'icon-container': {
      i: {
        color: colors.text,
        fontStyle: 'normal',
      },
    },
  })().classes['icon-container']

  const tagStyles = {
    borderRadius: 5,
    fontSize: 8,
    height: 18,
    marginLeft: 12,
    padding: '2.5px 5px',
  }

  return (
    <Group noWrap mt={10} spacing={0} align="center">
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
        }}
      >
        <Group spacing={0}>
          {/* Meta */}
          <Group spacing={0} sx={{ height: 25 }}>
            <i className={`${getIcon(name)}`}></i>
            <Text ml={10} size="md">
              {name}
            </Text>
          </Group>
        </Group>
      </UnstyledButton>
      {/* Tags */}
      {isEdited && (
        <UnstyledButton
          sx={{
            backgroundColor: colors.button.primary,
            ...tagStyles,
          }}
        >
          changes
        </UnstyledButton>
      )}
      {isNew && (
        <Box
          sx={{
            backgroundColor: colors.button.secondary,
            ...tagStyles,
          }}
        >
          new
        </Box>
      )}
      <Group sx={{ marginLeft: 'auto' }}>
        <DotsButton fullPath={fullPath} isFolder={false} name={name} />
      </Group>
    </Group>
  )
}
