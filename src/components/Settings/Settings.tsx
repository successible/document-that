import { Stack } from '@mantine/core'
import { useStore } from '../../store/store'
import { DeleteRepoInBrowser } from './Button/DeleteRepoInBrowserButton'
import { LogoutButton } from './Button/LogoutButton'
import { AccountHeader } from './Header/AccountHeader'
import { RepositoryHeader } from './Header/RepositoryHeader'

export const Settings = () => {
  const activeRepo = useStore((state) => state.activeRepo)
  const accessToken = useStore((state) => state.accessToken)
  const showRepo = accessToken !== '' && activeRepo

  return (
    <Stack
      align="center"
      pb={30}
      sx={{
        width: '100%',
      }}
    >
      <Stack align="center">
        {showRepo && <RepositoryHeader />}
        {showRepo && <DeleteRepoInBrowser />}
        <AccountHeader />
        <LogoutButton />
      </Stack>
    </Stack>
  )
}
