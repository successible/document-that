import { Box, Group, UnstyledButton } from '@mantine/core'
import flatten from 'flat'
import reduce from 'immer'
import { get, set } from 'lodash'
import { Folder as FolderIcon } from 'tabler-icons-react'
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

  const expanded = folder.___expanded
  const value = expanded === 'yes' ? name : ''

  // If any of the files in the flattened folder has a WORKDIR_STATUS_KEY of 2
  // Something in the folder has has been edited or created
  const flattenedFolder = flatten(folder) as Record<string, unknown>
  const isChanged = Object.keys(flattenedFolder).find((key) => {
    return flattenedFolder[key] === 2
  })

  return (
    <Box mt={10} sx={{ width: '100%' }}>
      <Group sx={{ width: '100%' }}>
        <FolderIcon
          width={18}
          height={18}
          color={isChanged ? colors.button.primary : undefined}
        />
        <UnstyledButton
          sx={{
            color: isChanged ? colors.button.primary : undefined,
            flex: 1,
            height: 25,
            paddingRight: 20,
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
          {name}
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
