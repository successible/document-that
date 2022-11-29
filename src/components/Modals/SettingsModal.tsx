import { Modal } from '@mantine/core'
import { useStore } from '../../store/store'
import { Settings } from '../Settings/Settings'

export const SettingsModal = () => {
  const openSettings = useStore((state) => state.openSettings)
  const methods = useStore((state) => state.methods)
  return (
    <Modal
      onClose={() => {
        methods.setOpenSettings(false)
      }}
      opened={openSettings}
    >
      <Settings />
    </Modal>
  )
}
