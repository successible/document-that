import { CreateFolderProgressModal } from './CreateFolderProgressModal'
import { DeleteFolderProgressModal } from './DeleteFolderProgressModal'
import { SearchModal } from './SearchModal'
import { SettingsModal } from './SettingsModal'

export const Modals = () => {
  return (
    <>
      <SearchModal />
      <SettingsModal />
      <CreateFolderProgressModal />
      <DeleteFolderProgressModal />
    </>
  )
}
