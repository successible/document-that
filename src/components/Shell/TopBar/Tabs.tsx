import { Box, Button, Group } from '@mantine/core'
import { flatten } from 'flat'
import React from 'react'
import { WORKDIR_STATUS_KEY } from '../../../helpers/fs/createFileTree'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { readFile } from '../../../helpers/fs/readFile'
import { FileContent, useStore } from '../../../store/store'

export const Tabs = () => {
  const colors = useStore((state) => state.colors)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)
  const activeRepo = useStore((state) => state.activeRepo)

  const activeData = getActiveData(activeRepo, data)

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
        const activeButtonColor = colors.button.neutral

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
          <Group
            spacing={0}
            key={tab.path}
            noWrap
            sx={{
              border: '2px solid transparent',
              borderColor: activeTab
                ? colors.button.success
                : colors.button.neutral,
              borderRadius: 5,
            }}
          >
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
                borderRadius: '3px 0px 0px 3px',
                color: isChanged ? colors.emphasis : colors.text,
                fontSize: '13px',
                fontStyle: tab.pending ? 'italic' : 'normal',
                outlineWidth: '0px !important',
                paddingRight: 4,
              }}
              compact
              styles={(theme) => ({
                root: {
                  '&:hover': {
                    backgroundColor: theme.fn.darken(activeButtonColor, 0.05),
                  },
                  backgroundColor: activeButtonColor,
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
                borderRadius: '0px 3px 3px 0px',
                fontSize: '13px',
                outlineWidth: '0px !important',
                paddingLeft: 4,
              }}
              // What happens when you click the x on a tab?
              // The behavior is the same as observed in VS Code
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
                    backgroundColor: theme.fn.darken(activeButtonColor, 0.05),
                  },
                  backgroundColor: activeButtonColor,
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
