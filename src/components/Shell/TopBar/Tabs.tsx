import { Box, Button, Group } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { flatten } from 'flat'
import React, { useEffect } from 'react'
import { WORKDIR_STATUS_KEY } from '../../../helpers/fs/createFileTree'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { readFile } from '../../../helpers/fs/readFile'
import { MOBILE_WIDTH } from '../../../helpers/utils/isMobile'
import { FileContent, useStore } from '../../../store/store'

export const Tabs = () => {
  const colors = useStore((state) => state.colors)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)
  const activeRepo = useStore((state) => state.activeRepo)

  const activeData = getActiveData(activeRepo, data)

  const { width } = useViewportSize()

  // This very niche check ensures that on mobile, if a file is selected AND the user switches to desktop
  // The active file has a corresponding tab added.
  useEffect(() => {
    const path = activeData.file?.path
    if (
      width >= MOBILE_WIDTH &&
      path &&
      activeData.tabs.find((tab) => tab.path === path) === undefined
    ) {
      methods.setActiveTabs([...activeData.tabs, { path }])
    }
  }, [activeData.file?.path, activeData.tabs, methods, width])

  return (
    <Group
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
          width: '0px',
        },
        alignItems: 'center',
        flex: 1,
        flexWrap: 'nowrap',
        height: 50,
        lineHeight: 0,
        overflow: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {activeData.tabs.map((tab) => {
        const activeTab = activeData.file?.path === tab.path

        const flattedFileTree = flatten(
          // We exclude the top level key.
          // For example, if the repo is named wiki, we exclude that folder and dive into (and flatten) the subfolders
          activeData.fileTree[Object.keys(activeData.fileTree)[0]]
        ) as Record<string, string | number>

        const flattenPath = tab.path
          .replaceAll('/', '.')
          .split('.')
          .slice(2)
          .join('.')

        const isChanged =
          flattedFileTree[flattenPath + '.' + WORKDIR_STATUS_KEY] === 2

        return (
          <Group spacing={0} key={tab.path} noWrap>
            <Button
              onClick={async () => {
                const file = await readFile(tab.path)
                methods.setActiveFile({ content: file, path: tab.path })
              }}
              sx={{
                '&:focus': {
                  borderColor: colors.outline,
                },
                border: '2px solid transparent',
                borderRadius: '5px 0px 0px 5px',
                color: isChanged ? colors.emphasis : colors.text,
                fontSize: '13px',
                outlineWidth: '0px !important',
                paddingRight: 4,
              }}
              compact
              styles={(theme) => ({
                root: {
                  '&:hover': {
                    backgroundColor: theme.fn.darken(
                      activeTab ? colors.comment : colors.button.neutral,
                      0.05
                    ),
                  },
                  backgroundColor: activeTab
                    ? colors.comment
                    : colors.button.neutral,
                },
              })}
            >
              {tab.path.split('/').slice(-1)[0]}
            </Button>
            <Button
              compact
              sx={{
                '&:focus': {
                  borderColor: colors.outline,
                },
                border: '2px solid transparent',
                borderRadius: '0px 5px 5px 0px',
                fontSize: '13px',
                outlineWidth: '0px !important',
                paddingLeft: 4,
              }}
              onClick={async () => {
                let removedIndex = 0
                const tabsToKeep = activeData.tabs.filter((t, i) => {
                  const removeTab = t.path === tab.path
                  if (removeTab) {
                    removedIndex = i
                  }
                  return !removeTab
                })

                let file = undefined as FileContent | null | undefined

                if (activeTab && tabsToKeep.length >= 1) {
                  // removedIndex will work if the tab deleted is surrounded by a tab on each side
                  // Or it the activeTab is the first tab.
                  // However, if the activeTab is at the end, we will need to subtract one from removeIndex

                  const indexToUse =
                    activeData.tabs.length - 1 === removedIndex
                      ? removedIndex - 1
                      : removedIndex

                  const content = await readFile(tabsToKeep[indexToUse].path)
                  file = {
                    content,
                    path: tabsToKeep[indexToUse].path,
                  } as FileContent
                } else if (activeTab && tabsToKeep.length === 0) {
                  file = null
                }

                methods.setActiveTabs(tabsToKeep, file)
              }}
              styles={(theme) => ({
                root: {
                  '&:hover': {
                    backgroundColor: theme.fn.darken(
                      activeTab ? colors.comment : colors.button.neutral,
                      0.05
                    ),
                  },
                  backgroundColor: activeTab
                    ? colors.comment
                    : colors.button.neutral,
                },
              })}
            >
              <Box
                sx={{
                  position: 'relative',
                  top: '-1px',
                }}
              >
                x
              </Box>
            </Button>
          </Group>
        )
      })}
    </Group>
  )
}
