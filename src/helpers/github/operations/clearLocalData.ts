import { hideNotification, showNotification } from '@mantine/notifications'
import { Methods } from '../../../store/store'
import { SUCCESS } from '../../../theme/colors'

export const clearLocalData = async (methods: Methods) => {
  window.localStorage.clear()
  await window.indexedDB.deleteDatabase('fs')

  hideNotification('logout-successful')
  showNotification({
    color: SUCCESS,
    id: 'logout-successful',
    message: '🚪 You been successfully logged out.',
    title: 'Logout successful!',
  })

  methods.resetStore()
}
