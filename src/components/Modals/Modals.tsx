import { CreateFolderProgressModal } from './CreateFolderProgressModal'
import { DeleteFolderProgressModal } from './DeleteFolderProgressModal'
import { SettingsModal } from './SettingsModal'

export const Modals = () => {
  return (
    <>
      <SettingsModal />
      <CreateFolderProgressModal />
      <DeleteFolderProgressModal />
    </>
  )
}
