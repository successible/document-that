import { hideNotification, showNotification } from '@mantine/notifications'
import { Methods } from '../../store/store'
import { ERROR } from '../../theme/colors'
import { clearLocalData } from '../github/operations/clearLocalData'

export const handleError = (error: unknown, methods: Methods): string => {
  const e = String(error)
  console.log(e)
  if (e.includes('Bad credentials')) {
    hideNotification('read-introduction')
    hideNotification('incorrect-git-credentials')
    showNotification({
      color: ERROR,
      id: 'incorrect-git-credentials',
      message: `🛑 Did you revoke access?`,
      title: 'Incorrect GitHub credentials',
    })
    clearLocalData(methods)
    hideNotification('logout-successful')
  } else {
    // Default case
    const getMessage = () => {
      if (e.includes('EEXIST')) {
        return 'That item already exists'
      } else {
        return e
      }
    }
    hideNotification('error')
    showNotification({
      color: ERROR,
      id: 'error',
      message: getMessage(),
      title: '🛑 Something went wrong',
    })
  }
  return e
}
