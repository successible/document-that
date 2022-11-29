import { Stack } from '@mantine/core'
import { isEmpty } from 'lodash'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { FileTree as FileTreeType, useStore } from '../../../store/store'
import { EmptyFileTree } from './EmptyFileTree'
import { RecursiveFileTree } from './RecursiveFileTree'

export const FileTree = () => {
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const fileTree = getActiveData(activeRepo, data).fileTree

  return (
    <Stack
      spacing={0}
      sx={{
        width: '100%',
      }}
    >
      {isEmpty(activeRepo) || !fileTree || !activeRepo ? (
        <EmptyFileTree />
      ) : (
        <RecursiveFileTree
          fileTree={fileTree[activeRepo.name] as FileTreeType}
          fullPath={[activeRepo.name]}
        />
      )}
    </Stack>
  )
}