import { Alert } from '@mantine/core'
import { Folder } from 'tabler-icons-react'

export const EmptyFileTree = () => {
  return (
    <Alert
      color="gray"
      icon={<Folder size={16} />}
      mt={20}
      sx={{
        width: '100%',
      }}
      title="Bummer!"
    >
      This repository has no files.
    </Alert>
  )
}
