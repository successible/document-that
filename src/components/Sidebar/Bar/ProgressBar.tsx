import { Progress, Stack, Text } from '@mantine/core'
import { GitProgressEvent } from 'isomorphic-git'
import { isEmpty, round } from 'lodash'
import { useStore } from '../../../store/store'

export const ProgressBar = () => {
  const cloneProgress = useStore((state) => state.cloneProgress)
  const getProgressBarValue = (progress: GitProgressEvent) => {
    if (!progress.total && !isEmpty(progress)) {
      return 100
    }
    if (progress.loaded) {
      return round((progress.loaded / progress.total) * 100, 0)
    } else {
      return 0
    }
  }

  const progress = getProgressBarValue(cloneProgress)
  const hideText =
    (cloneProgress.phase === 'Analyzing workdir' && progress === 100) ||
    (cloneProgress.phase === 'Updating workdir' && progress === 100) ||
    isEmpty(cloneProgress)

  return (
    <Stack
      sx={{
        minHeight: !hideText ? 50 : 5,
        width: '100%',
      }}
    >
      <Progress
        sx={{ height: 5, minHeight: 5, width: '100%' }}
        value={progress}
      />

      {!hideText && (
        <Text size="md">
          {cloneProgress.phase}: {progress}%
        </Text>
      )}
    </Stack>
  )
}
