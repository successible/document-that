import { Stack } from '@mantine/core'
import { isEmpty } from 'lodash'
import { getActiveData } from '../../../helpers/fs/getActiveData'

import { FileTree, useStore } from '../../../store/store'
import { EmptyFileTree } from './EmptyFileTree'
import { RecursiveFileTree } from './RecursiveFileTree'

export const FileTreeContainer = () => {
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const activeData = getActiveData(activeRepo, data)
  const repoExists = activeRepo && !isEmpty(activeRepo)

  return (
    <Stack
      spacing={0}
      sx={{
        width: '100%',
      }}
    >
      {!repoExists ? (
        <EmptyFileTree repoExists={Boolean(!repoExists)} />
      ) : (
        <RecursiveFileTree
          fileTree={activeData.fileTree[activeRepo.name] as unknown as FileTree}
          fullPath={[activeRepo.name]}
        />
      )}
    </Stack>
  )
}
