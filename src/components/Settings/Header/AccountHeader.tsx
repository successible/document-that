import { Group, Title } from '@mantine/core'
import { Settings } from 'tabler-icons-react'

export const AccountHeader = () => {
  return (
    <Group mt={30}>
      <Settings size={35} />
      <Title
        sx={{
          fontWeight: 900,
        }}
      >
        Account
      </Title>
    </Group>
  )
}
