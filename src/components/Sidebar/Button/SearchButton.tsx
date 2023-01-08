import { Button } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'

export const SearchButton = () => {
  const colors = useStore((state) => state.colors)
  const methods = useStore((state) => state.methods)

  return (
    <Button
      leftIcon={<Search />}
      sx={{
        ...styleButton(colors.button.neutral),
        minHeight: 34,
        width: '100%',
      }}
      onClick={async () => {
        methods.setOpenDocumentSearch(true)
      }}
    >
      Search
    </Button>
  )
}
