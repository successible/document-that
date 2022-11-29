import { Group, Title } from '@mantine/core'
import { Database } from 'tabler-icons-react'

export const RepositoryHeader = () => (
  <Group mb={10} mt={25}>
    <Database size={35} />
    <Title
      sx={{
        fontWeight: 900,
      }}
    >
      Repository
    </Title>
  </Group>
)
