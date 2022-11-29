import { Loader, Modal, Stack, Title } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useStore } from '../../store/store'

export const PushProgressModal = () => {
  const pushProgress = useStore((state) => state.pushProgress)

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={() => {}}
      opened={!isEmpty(pushProgress)}
      withCloseButton={false}
    >
      <Stack align={'center'}>
        <Title
          sx={{
            fontSize: '1.5rem',
            weight: 900,
          }}
        >
          Pushing changes to GitHub
        </Title>
        <Loader />
      </Stack>
    </Modal>
  )
}
