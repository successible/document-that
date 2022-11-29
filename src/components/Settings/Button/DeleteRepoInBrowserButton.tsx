import { Button } from '@mantine/core'
import { Browser } from 'tabler-icons-react'
import { deleteRepo } from '../../../helpers/github/operations/deleteRepo'
import { useStore } from '../../../store/store'

const DELETE_REPO_LOCAL = `This action will delete the repository in your browser. 
The repository will still exist in GitHub and your other devices. 
Are you sure you want to do this?`

export const DeleteRepoInBrowser = () => {
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)

  return (
    <Button
      sx={{ width: '100%' }}
      leftIcon={<Browser size={20} />}
      onClick={async () => {
        const response = window.confirm(DELETE_REPO_LOCAL)
        if (response && activeRepo) {
          await deleteRepo(activeRepo, methods)
          methods.setOpenSettings(false)
        }
      }}
    >
      Delete in browser
    </Button>
  )
}
