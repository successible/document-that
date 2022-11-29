import { Divider, Modal, Stack, Text, Title } from '@mantine/core'
import { useStore } from '../../store/store'

export const CreateFolderProgressModal = () => {
  const openCreateFolder = useStore((state) => state.openCreateFolder)
  const methods = useStore((state) => state.methods)
  const fileBeingCreated = useStore((state) => state.fileBeingCreated)

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={() => methods.setOpenCreateFolder(false)}
      opened={openCreateFolder}
      withCloseButton={false}
    >
      <Stack>
        <Title
          sx={{
            fontSize: '1.5rem',
            weight: 900,
          }}
        >
          Uploading contents to browser
        </Title>
        <Divider />
        <Text>Uploading {fileBeingCreated}</Text>
      </Stack>
    </Modal>
  )
}
