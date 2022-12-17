import { Box, Group, Text, UnstyledButton } from '@mantine/core'
import flatten from 'flat'
import reduce from 'immer'
import { get, set } from 'lodash'
import { Folder as FolderIcon } from 'tabler-icons-react'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { getPathInFileTree } from '../../../helpers/fs/getPathInFileTree'
import { FileTree, Folder, useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'
import { RecursiveFileTree } from './RecursiveFileTree'

type props = { fullPath: string[]; folder: Folder; name: string }

export const FolderItem: React.FC<props> = ({ folder, fullPath, name }) => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)

  const activeFilePath = String(getActiveData(activeRepo, data).file?.path)
    .split('/')
    .slice(2)
    .join('/')

  const path = getPathInFileTree(activeRepo, fullPath).slice(3).join('/')

  // In the event you want to see what folder is selected as well
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedFolder = activeFilePath.includes(path)

  const expanded = folder.___expanded
  const value = expanded === 'yes' ? name : ''

  // If any of the files in the flattened folder has a WORKDIR_STATUS_KEY of 2
  // Something in the folder has has been edited or created
  const flattenedFolder = flatten(folder) as Record<string, unknown>
  const isChanged = Object.keys(flattenedFolder).find((key) => {
    return flattenedFolder[key] === 2
  })

  return (
    <Box sx={{ width: '100%' }}>
      <Group
        sx={{
          marginTop: 5,
          width: '100%',
        }}
        noWrap
        spacing={0}
      >
        <UnstyledButton
          sx={{
            '&:focus': {
              borderColor: colors.comment,
              outline: 0,
            },
            '&:hover, &:active': {
              backgroundColor: colors.foreground,
            },
            border: '2px solid transparent',
            borderRadius: 5,
            height: 30,
            padding: '0px 6px',
            width: '100%',
          }}
          onClick={() => {
            // We show clicks the accordion chevron, will need to toggle the expanded section
            // Of the folder object in the relevant section of the file tree
            methods.setData(
              reduce(data, (draft) => {
                const folderPath = getPathInFileTree(activeRepo, fullPath)
                const folderInTree = get(draft, folderPath)
                folderInTree.___expanded = expanded === 'yes' ? 'no' : 'yes'
                set(draft, folderPath, folderInTree)
              })
            )
          }}
        >
          <Group spacing={0}>
            <FolderIcon
              width={18}
              height={18}
              color={isChanged ? colors.emphasis : undefined}
            />
            <Text
              ml={12}
              size="md"
              sx={{ color: isChanged ? colors.emphasis : undefined }}
            >
              {name}
            </Text>
          </Group>
        </UnstyledButton>
        <DotsButton fullPath={fullPath} isFolder={true} name={name} />
      </Group>
      {value && (
        <Box ml={10}>
          {/* folder is always of Folder type but passing it to RecursiveFileTree as such causes a type error */}
          {/* Even though RecursiveFileTree takes FileMeta | Folder  */}
          <RecursiveFileTree
            fileTree={folder as unknown as FileTree}
            fullPath={fullPath}
          />
        </Box>
      )}
    </Box>
  )
}
