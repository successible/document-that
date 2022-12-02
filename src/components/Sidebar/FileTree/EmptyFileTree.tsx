import { Alert } from '@mantine/core'
import { Folder } from 'tabler-icons-react'

export const EmptyFileTree: React.FC<{ repoExists: boolean }> = ({
  repoExists,
}) => {
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
      No{' '}
      {repoExists ? 'repository has been selected' : 'files have been selected'}
    </Alert>
  )
}
