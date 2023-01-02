import { Stack } from '@mantine/core'
import { useStore } from '../../store/store'
import { ProgressBar } from './Bar/ProgressBar'
import { SearchButton } from './Button/SearchButton'
import { SettingsButton } from './Button/SettingsButton'
import { SyncButton } from './Button/SyncButton'
import { UserButton } from './Button/UserButton'
import { FileTreeContainer } from './FileTree/FileTreeContainer'
import { RepoList } from './RepoList'

export const Sidebar = () => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const accessToken = useStore((state) => state.accessToken)
  const loggedIn = accessToken !== ''

  return (
    <Stack
      align={'flex-start'}
      sx={{
        '@media (max-width: 320px)': {
          minWidth: 320,
          padding: 20,
          width: 320,
        },
        '@media (min-width: 768px)': {
          borderRight: `1px solid ${colors.text}`,
          width: 375,
        },
        backgroundColor: `${colors.background}`,
        height: 'calc(100vh - 50px)',
        minWidth: 375,
        overflowX: 'scroll',
        overflowY: 'scroll',
        padding: 25,
        position: 'relative',
        width: '100%',
        zIndex: 1,
      }}
    >
      <UserButton />
      {loggedIn && (
        <>
          <RepoList />
          <ProgressBar />
        </>
      )}
      {activeRepo && <SyncButton />}
      {loggedIn && <SettingsButton />}
      {loggedIn && <SearchButton />}
      {loggedIn && <FileTreeContainer />}
    </Stack>
  )
}
