import { Box, Button, Checkbox, Loader, TextInput } from '@mantine/core'
import { Updater, useImmer } from 'use-immer'
import { getActiveData } from '../../../../helpers/fs/getActiveData'
import { styleButton } from '../../../../helpers/utils/theme/styleButton'
import { useStore } from '../../../../store/store'
import {
  findMatchesInDocuments,
  Matches,
} from '../../SearchModal/helpers/findMatchesInDocuments'

type props = { setMatches: Updater<Matches> }
type STATUS = 'ACTIVE' | 'INACTIVE' | 'LOADING'

export const DocumentSearchModalForm: React.FC<props> = ({ setMatches }) => {
  const [text, setText] = useImmer('')
  const [caseSensitive, setCaseSensitive] = useImmer(false)
  const [status, setStatus] = useImmer('INACTIVE' as STATUS)

  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const activeData = getActiveData(activeRepo, data)

  return (
    <Box mb={10}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (status === 'INACTIVE') {
            if (activeRepo && text && text !== '') {
              const matchesPromise = findMatchesInDocuments(
                activeData.files,
                activeRepo,
                text,
                { caseSensitive }
              )
              setStatus('LOADING')
              const matches = await matchesPromise
              setStatus('ACTIVE')
              setMatches(matches)
            }
          } else if (status === 'ACTIVE') {
            setText('')
            setStatus('INACTIVE')
            setMatches({})
            setCaseSensitive(false)
          }
        }}
      >
        <TextInput
          mb={10}
          placeholder="Text or regex to search"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Checkbox
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.currentTarget.checked)}
          mt={20}
          mb={20}
          label="Make case sensitive"
        />
        <Button
          mt={5}
          sx={{ ...styleButton(colors.button.primary) }}
          type="submit"
        >
          {status === 'ACTIVE' ? (
            'Clear'
          ) : status === 'INACTIVE' ? (
            'Search'
          ) : (
            <>
              <Loader variant={'dots'} color={'white'} mr={10} size={'sm'} />{' '}
              Searching
            </>
          )}
        </Button>
      </form>
    </Box>
  )
}
