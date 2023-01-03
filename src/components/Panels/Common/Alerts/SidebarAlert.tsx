import { Alert, Burger } from '@mantine/core'
import { useStore } from '../../../../store/store'

export const SidebarAlert = () => {
  const sidebarOpen = useStore((state) => state.openSidebar)

  return (
    <>
      {!sidebarOpen && (
        <Alert>
          To open the sidebar, click or tap the{' '}
          <Burger
            opened={false}
            size={16}
            sx={{
              position: 'relative',
              top: -4,
            }}
          />{' '}
          icon on the top right.
        </Alert>
      )}
    </>
  )
}
