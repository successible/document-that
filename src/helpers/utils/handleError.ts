import toast from 'react-hot-toast'
import { Methods } from '../../store/store'
import { clearLocalData } from '../github/operations/clearLocalData'

export const toastPromiseOptions = {
  error: { style: { display: 'none' } },
}

export const handleError = (error: unknown, methods: Methods): string => {
  const e = String(error)
  console.log(e)
  if (e.includes('Bad credentials')) {
    toast.error('🛑 Incorrect GitHub credentials')
    clearLocalData(methods)
  } else if (String(e).includes('404')) {
    toast.error('👻 Repository unavailable or missing')
  } else {
    // We do not want to show an error for the unknown case.
  }
  return e
}
