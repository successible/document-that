import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { Tooltip } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
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
import { isMobile, MOBILE_WIDTH } from '../../../helpers/utils/isMobile'
import { File, useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'

export const SIDEBAR_TRUNCATE_LENGTH = 30

type props = { name: string; fullPath: string[]; file: File }
export const FileItem: React.FC<props> = ({ file, fullPath, name }) => {
  const data = useStore((state) => state.data)
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))
  const activeData = getActiveData(activeRepo, data)
  const activeFilePath = activeData.file?.path
  const activeTabs = activeData.tabs

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

  const { width } = useViewportSize()

  return (
    <Group
      noWrap
      spacing={0}
      align="center"
      sx={{
        marginTop: 5,
      }}
    >
      <Tooltip
        events={{ focus: true, hover: true, touch: true }}
        label={name}
        sx={{
          backgroundColor: colors.button.neutral,
          color: colors.text,
          display: name.length >= SIDEBAR_TRUNCATE_LENGTH ? undefined : 'none',
        }}
      >
        <UnstyledButton
          className={iconContainer}
          key={`text-${name}`}
          sx={{
            '&:focus': {
              borderColor: colors.outline,
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
              const tabExists = activeTabs.find((tab) => path === tab.path)
              if (!tabExists && width >= MOBILE_WIDTH) {
                methods.setActiveTabs([...activeTabs, { path }])
              }
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
              {truncate(name, { length: SIDEBAR_TRUNCATE_LENGTH })}
            </Text>
          </Group>
        </UnstyledButton>
      </Tooltip>

      <Group sx={{ marginLeft: 'auto' }}>
        <DotsButton fullPath={fullPath} isFolder={false} name={name} />
      </Group>
    </Group>
  )
}
