import toast from 'react-hot-toast'
import { Methods } from '../../../store/store'

export const clearLocalData = async (methods: Methods) => {
  window.localStorage.clear()
  await window.indexedDB.deleteDatabase('fs')
  toast.success(`You've been logged out`)
  methods.resetStore()
}
