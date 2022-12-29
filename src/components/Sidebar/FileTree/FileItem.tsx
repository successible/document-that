import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { truncate } from 'lodash'
import React from 'react'
import {
  STAGE_STATUS_KEY,
  WORKDIR_STATUS_KEY,
} from '../../../helpers/fs/createFileTree'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../../helpers/fs/readFile'
import { getIcon } from '../../../helpers/utils/components/getIcon'
import { isMobile } from '../../../helpers/utils/isMobile'
import { File, useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'

type props = { name: string; fullPath: string[]; file: File }
export const FileItem: React.FC<props> = ({ file, fullPath, name }) => {
  const data = useStore((state) => state.data)
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))
  const activeFilePath = getActiveData(activeRepo, data).file?.path
  const selectedFile = activeFilePath === path

  const workdirStatus = file[WORKDIR_STATUS_KEY]
  const stageStatus = file[STAGE_STATUS_KEY]

  const isNew = workdirStatus === 2 && stageStatus === 0
  const isEdited = workdirStatus === 2 && stageStatus !== 0

  const color = isEdited
    ? colors.emphasis
    : isNew
    ? colors.button.success
    : undefined

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
      spacing={0}
      align="center"
      sx={{
        marginTop: 5,
      }}
    >
      <UnstyledButton
        className={iconContainer}
        key={`text-${name}`}
        sx={{
          '&:focus': {
            borderColor: colors.foreground,
            outline: 0,
          },
          '&:hover, &:active': {
            backgroundColor: colors.foreground,
          },
          backgroundColor: selectedFile
            ? `${colors.comment} !important`
            : undefined,
          border: '2px solid transparent',
          borderRadius: 5,
          height: 30,
          i: {
            height: 18,
            width: 18,
          },
          padding: '0px 6px',
          width: '100%',
        }}
        onClick={async () => {
          if (activeRepo) {
            const file = await readFile(path)
            methods.setActiveFile({ content: file, path })
            if (isMobile()) {
              methods.setOpenSidebar(false)
            }
          }
        }}
      >
        <Group
          spacing={0}
          sx={{
            color: color,
            i: {
              color,
            },
          }}
        >
          <i className={`${getIcon(name)}`}></i>
          <Text ml={12} size="md">
            {truncate(name, { length: 30 })}
          </Text>
        </Group>
      </UnstyledButton>

      <Group sx={{ marginLeft: 'auto' }}>
        <DotsButton fullPath={fullPath} isFolder={false} name={name} />
      </Group>
    </Group>
  )
}
