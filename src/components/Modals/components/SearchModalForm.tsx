import { Box, Button, TextInput } from '@mantine/core'
import { Updater, useImmer } from 'use-immer'
import { getActiveData } from '../../../helpers/fs/getActiveData'
import { styleButton } from '../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../store/store'
import {
  findMatchesInDocuments,
  Matches,
} from '../helpers/SearchModal/findMatchesInDocuments'

type props = { setMatches: Updater<Matches> }

export const SearchModalForm: React.FC<props> = ({ setMatches }) => {
  const [text, setText] = useImmer('')

  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const activeData = getActiveData(activeRepo, data)

  return (
    <Box mb={30}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (activeRepo && text && text !== '') {
            const matches = await findMatchesInDocuments(
              activeData.files,
              activeRepo,
              text
            )
            setMatches(matches)
          }
        }}
      >
        <TextInput
          mb={10}
          placeholder="Text to search"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          mt={5}
          sx={{ ...styleButton(colors.button.primary) }}
          type="submit"
        >
          Search
        </Button>
      </form>
    </Box>
  )
}
