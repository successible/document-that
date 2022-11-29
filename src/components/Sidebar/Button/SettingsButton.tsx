import { Button } from '@mantine/core'
import { Settings } from 'tabler-icons-react'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'

export const SettingsButton = () => {
  const methods = useStore((state) => state.methods)
  const colors = useStore((state) => state.colors)

  return (
    <Button
      leftIcon={<Settings />}
      onClick={() => {
        methods.setOpenSettings(true)
      }}
      sx={{
        ...styleButton(colors.button.primary),
        minHeight: 34,
        width: '100%',
      }}
    >
      Settings
    </Button>
  )
}
