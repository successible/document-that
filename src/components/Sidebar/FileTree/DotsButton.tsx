import { Group } from '@mantine/core'
import { Menu, UnstyledButton } from '@mantine/core'
import { FaThumbsDown } from 'react-icons/fa'
import { Dots, Edit, Folder, Plus, Trash } from 'tabler-icons-react'

import { createFile } from '../../../helpers/fs/createFile'
import { createFolder } from '../../../helpers/fs/createFolder'
import { deleteFile } from '../../../helpers/fs/deleteFile'
import { deleteFolder } from '../../../helpers/fs/deleteFolder'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { renameFolderOrFile } from '../../../helpers/fs/renameFolderOrFile'
import { useStore } from '../../../store/store'

export const DotsButton: React.FC<{
  name: string
  isFolder: boolean
  fullPath: string[]
}> = ({ fullPath, isFolder, name }) => {
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)
  const item = isFolder ? 'folder' : 'file'
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))

  return (
    <Group
      sx={{
        height: 18,
      }}
    >
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton sx={{ height: 18 }}>
            <Dots
              aria-label={`Three dots that open menu for ${name}`}
              size={18}
            />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Options</Menu.Label>

          {isFolder && (
            <Menu.Item
              icon={<Plus size={14} />}
              onClick={async () => await createFile(path, methods)}
            >
              New file
            </Menu.Item>
          )}

          {isFolder && (
            <Menu.Item
              icon={<Folder size={14} />}
              onClick={async () => createFolder(path, activeRepo, methods)}
            >
              New folder
            </Menu.Item>
          )}

          <Menu.Item
            icon={<Edit size={14} />}
            onClick={async () => await renameFolderOrFile(path, item, methods)}
          >
            Rename {item}
          </Menu.Item>

          <>
            <Menu.Divider />
            <Menu.Label>Danger zone</Menu.Label>
            {!isFolder && (
              <Menu.Item
                icon={<FaThumbsDown size={14} />}
                onClick={async () => {}}
              >
                Discard changes
              </Menu.Item>
            )}
            <Menu.Item
              icon={<Trash size={14} />}
              onClick={async () => {
                if (activeRepo && isFolder) {
                  deleteFolder(path, activeRepo, methods, true)
                } else if (activeRepo && !isFolder) {
                  await deleteFile(path, methods)
                }
              }}
            >
              Delete {item}
            </Menu.Item>
          </>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}
