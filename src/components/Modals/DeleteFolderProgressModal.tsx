import { Divider, Modal, Stack, Text, Title } from '@mantine/core'
import { useStore } from '../../store/store'

export const DeleteFolderProgressModal = () => {
  const openDeleteFolder = useStore((state) => state.openDeleteFolder)
  const folderBeingDeleted = useStore((state) => state.folderBeingDeleted)
  const fileBeingDeleted = useStore((state) => state.fileBeingDeleted)
  const methods = useStore((state) => state.methods)

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={() => methods.setOpenDeleteFolder(false)}
      opened={openDeleteFolder}
      withCloseButton={false}
    >
      <Stack>
        <Title
          sx={{
            fontSize: '1.5rem',
            weight: 900,
          }}
        >
          Deleting {folderBeingDeleted?.replaceAll('-', '/')} from browser
        </Title>
        <Divider />
        <Text>Deleting {fileBeingDeleted}</Text>
      </Stack>
    </Modal>
  )
}
