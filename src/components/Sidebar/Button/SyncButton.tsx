import { Button } from '@mantine/core'
import { Refresh } from 'tabler-icons-react'
import { cloneOrPullRepo } from '../../../helpers/github/operations/cloneOrPullRepo'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'

export const SyncButton = () => {
  const colors = useStore((state) => state.colors)
  const user = useStore((state) => state.user)
  const activeRepo = useStore((state) => state.activeRepo)
  const accessToken = useStore((state) => state.accessToken)
  const methods = useStore((state) => state.methods)

  return (
    <Button
      leftIcon={<Refresh />}
      onClick={async () => {
        await cloneOrPullRepo(accessToken, activeRepo, user, methods, true)
      }}
      sx={{
        ...styleButton(colors.button.secondary),
        minHeight: 34,
        width: '100%',
      }}
    >
      Sync changes
    </Button>
  )
}
