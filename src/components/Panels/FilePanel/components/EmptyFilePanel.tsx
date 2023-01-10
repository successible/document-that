import { Stack, Text, Title } from '@mantine/core'
import { useStore } from '../../../../store/store'
import { SidebarAlert } from '../../Common/SidebarAlert'

export const EmptyFilePanel = () => {
  const sidebarOpen = useStore((state) => state.openSidebar)

  return (
    <Stack
      justify="center"
      sx={{
        height: '100%',
        margin: '0px auto',
        maxWidth: 500,
        width: '90%',
      }}
    >
      <>
        <Title
          sx={{
            '@media (min-width: 768px)': {
              marginTop: 0,
            },
            fontWeight: 900,
            marginTop: 75,
            textAlign: 'center',
          }}
        >
          So empty!
        </Title>
        <Text size="xl" weight={500} mb={10} align="center">
          {sidebarOpen
            ? 'Select a file on the sidebar to start writing ⚡'
            : 'Open the sidebar and select a file to start writing ⚡'}
        </Text>
        <SidebarAlert />
      </>
    </Stack>
  )
}
