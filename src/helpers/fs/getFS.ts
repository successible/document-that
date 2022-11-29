import { useStore } from '../../store/store'

export const getFS = () => {
  return useStore.getState().fs
}
