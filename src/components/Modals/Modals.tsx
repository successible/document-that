import { CreateFolderProgressModal } from './CreateFolderProgressModal'
import { DeleteFolderProgressModal } from './DeleteFolderProgressModal'
import { DocumentSearchModal } from './DocumentSearchModal'
import { NameSearchModal } from './NameSearchModal'
import { SettingsModal } from './SettingsModal'

export const Modals = () => {
  return (
    <>
      <DocumentSearchModal />
      <NameSearchModal />
      <SettingsModal />
      <CreateFolderProgressModal />
      <DeleteFolderProgressModal />
    </>
  )
}
