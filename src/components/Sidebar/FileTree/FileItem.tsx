import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { Tooltip } from '@mantine/core'
import { truncate } from 'lodash'
import React, { useRef } from 'react'
import useDoubleClick from 'use-double-click'
import {
  STAGE_STATUS_KEY,
  WORKDIR_STATUS_KEY,
} from '../../../helpers/fs/createFileTree'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../../helpers/fs/readFile'
import { getIcon } from '../../../helpers/utils/components/getIcon'
import { isMobile } from '../../../helpers/utils/isMobile'
import { File, Tab, useStore } from '../../../store/store'
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

  const buttonRef = useRef<HTMLButtonElement>(null)

  // The behavior of clicking on a tab is designed to mimic Visual Studio

  const singleClick = async () => {
    const newTab = [{ path, pending: true }] as Tab[]
    let newActiveTabs = [...newTab]

    if (activeRepo) {
      const file = await readFile(path)
      methods.setActiveFile({ content: file, path })

      if (isMobile()) {
        methods.setOpenSidebar(false)
      }

      console.log(activeTabs)

      // If not tab exists AT ALL, add a pending tab
      if (activeTabs.length === 0) {
        methods.setActiveTabs(newTab)
      }

      // If we are clicking on a tab that already exists and is not pending
      else if (
        activeTabs.filter((tab) => tab.path === path && tab.pending === false)
          .length >= 1
      ) {
        return []

        // If no pending tab exists, but other tabs do exist, add a new pending tab
      } else if (activeTabs.filter((tab) => tab.pending).length === 0) {
        newActiveTabs = [...activeTabs, ...newTab]
        methods.setActiveTabs([...activeTabs, ...newTab])
        return newActiveTabs

        // If the clicked on tab does not exist in the list of tabs
        // Swap out the old pending tab for the new pending tab
      } else if (activeTabs.filter((tab) => path === tab.path).length === 0) {
        newActiveTabs = activeTabs.map((tab) =>
          tab.pending ? { path, pending: true } : tab
        )
        methods.setActiveTabs(newActiveTabs)
        return newActiveTabs
      }
    }
    return newTab
  }

  const doubleClick = async (activeTabs: Tab[]) => {
    // On a double click, convert any pending tab to false
    const newActiveTabs = activeTabs.map((tab) => {
      if (tab.pending) {
        return { ...tab, pending: false }
      } else {
        return tab
      }
    })
    methods.setActiveTabs(newActiveTabs)
  }

  useDoubleClick({
    latency: 250,
    onDoubleClick: async () => {
      const activeTabs = await singleClick()
      if (activeTabs.length >= 1) {
        await doubleClick(activeTabs)
      }
    },
    onSingleClick: async () => {
      await singleClick()
    },
    ref: buttonRef,
  })

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
              ? `${colors.accent} !important`
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
          ref={buttonRef}
          onClick={async () => {}}
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
