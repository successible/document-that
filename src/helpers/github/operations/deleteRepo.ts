import { showNotification } from '@mantine/notifications'
import { Repo } from '../../../pages'
import { Methods } from '../../../store/store'
import { INFO, SUCCESS } from '../../../theme/colors'
import { deleteFolder } from '../../fs/deleteFolder'
import { getDir } from '../properties/getDir'

export const deleteRepo = async (activeRepo: Repo, methods: Methods) => {
  showNotification({
    color: INFO,
    message: '⌛ It should take less than a minute',
    title: 'Repository being deleted',
  })

  await deleteFolder(getDir(activeRepo), activeRepo, methods, false)

  showNotification({
    color: SUCCESS,
    message: '🗑️ It will be removed from the sidebar within a minute',
    title: 'Repository successfully deleted!',
  })

  await methods.resetRepo()
}
