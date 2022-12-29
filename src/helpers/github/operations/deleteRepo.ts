import toast from 'react-hot-toast'
import { Repo } from '../../../pages'
import { Methods } from '../../../store/store'
import { deleteFolder } from '../../fs/deleteFolder'
import { handleError } from '../../utils/handleError'
import { getDir } from '../properties/getDir'

export const deleteRepo = async (activeRepo: Repo, methods: Methods) => {
  const deleteFolderPromise = deleteFolder(
    getDir(activeRepo),
    activeRepo,
    methods,
    false
  )

  toast.promise(deleteFolderPromise, {
    error: (error) => handleError(error, methods),
    loading: 'Deleting repository',
    success: () => 'Repository deleted',
  })

  await deleteFolderPromise
  console.log('Repository deleted!')
  await methods.resetRepo()
}
