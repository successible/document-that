import { Button } from '@mantine/core'
import { Logout } from 'tabler-icons-react'
import { clearLocalData } from '../../../helpers/github/operations/clearLocalData'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'

const DELETE_LOCAL_ALL = `All of your data is stored privately and securely on your local device. Hence, you do not need to log out like you would with a traditional website.

However, there may come a time when you want to delete your local data and access token from your device. That is what this button does. Your data in GitHub and other devices, will not be affected. Are you sure you want to do this?`

export const LogoutButton = () => {
  const colors = useStore((state) => state.colors)
  const methods = useStore((state) => state.methods)
  return (
    <Button
      leftIcon={<Logout />}
      onClick={async () => {
        const response = window.confirm(DELETE_LOCAL_ALL)
        if (response) {
          await clearLocalData(methods)
        }
      }}
      sx={{
        ...styleButton(colors.button.primary),
        width: 250,
      }}
    >
      Logout
    </Button>
  )
}
