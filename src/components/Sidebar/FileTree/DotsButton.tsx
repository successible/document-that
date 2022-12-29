import { Group } from '@mantine/core'
import { Menu, UnstyledButton } from '@mantine/core'
import * as git from 'isomorphic-git'
import toast from 'react-hot-toast'
import { FaThumbsDown } from 'react-icons/fa'
import { Dots, Edit, Folder, Message, Plus, Trash } from 'tabler-icons-react'

import { createFile } from '../../../helpers/fs/createFile'
import { createFolder } from '../../../helpers/fs/createFolder'
import { deleteFile } from '../../../helpers/fs/deleteFile'
import { deleteFolder } from '../../../helpers/fs/deleteFolder'
import { getPathInFileSystem } from '../../../helpers/fs/getPathInFileSystem'
import { renameFolderOrFile } from '../../../helpers/fs/renameFolderOrFile'
import { getProperties } from '../../../helpers/github/properties/getProperties'
import { useStore } from '../../../store/store'

export const DotsButton: React.FC<{
  name: string
  isFolder: boolean
  fullPath: string[]
}> = ({ fullPath, isFolder, name }) => {
  const colors = useStore((state) => state.colors)
  const accessToken = useStore((state) => state.accessToken)
  const activeRepo = useStore((state) => state.activeRepo)
  const user = useStore((state) => state.user)
  const methods = useStore((state) => state.methods)
  const item = isFolder ? 'folder' : 'file'
  const path = getPathInFileSystem(activeRepo, fullPath.slice(1))

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton
          sx={{
            '&:focus': {
              borderColor: colors.foreground,
              outline: 0,
            },
            '&:hover, &:active': {
              backgroundColor: colors.foreground,
            },
            border: '2px solid transparent',
            borderRadius: 5,
            height: 30,
            width: 30,
          }}
        >
          <Group
            sx={{
              height: '100%',
              svg: {
                margin: '0px auto',
              },
              width: '100%',
            }}
            spacing={0}
          >
            <Dots
              aria-label={`Three dots that open menu for ${name}`}
              size={18}
            />
          </Group>
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

        {!isFolder && (
          <Menu.Item icon={<Message size={14} />} onClick={async () => {}}>
            View changes
          </Menu.Item>
        )}

        <>
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            icon={<FaThumbsDown size={14} />}
            onClick={async () => {
              if (activeRepo && user) {
                await git.checkout({
                  ...getProperties(accessToken, activeRepo, user),
                  filepaths: [fullPath.slice(1).join('/')],
                  force: true,
                })
                await methods.recalculateData()
                toast.success('Changes discarded')
              }
            }}
          >
            Discard changes
          </Menu.Item>

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
  )
}
