import {
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import {
  findMatchesInDocuments,
  Matches,
} from '../../helpers/utils/findMatchesInDocuments'
import { useStore } from '../../store/store'

export const SearchModal = () => {
  const [text, setText] = useImmer('')
  const [matches, setMatches] = useImmer({} as Matches)

  const openSearch = useStore((state) => state.openSearch)
  const methods = useStore((state) => state.methods)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const activeData = getActiveData(activeRepo, data)
  return (
    <Modal
      onClose={() => {
        methods.setOpenSearch(false)
      }}
      opened={openSearch}
    >
      <Stack>
        <Title>Search</Title>
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
            placeholder="Value to search"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
        <Stack spacing={0}>
          {Object.keys(matches).map((key) => {
            console.log(matches[key].matches)
            return (
              <>
                <Group mt={10} mb={0}>
                  {key.split('/').slice(2).join('/')}
                </Group>
                {matches[key].matches.flatMap((match) => {
                  console.log(match)
                  return (
                    <Stack mt={10} mb={10}>
                      {match[0]}
                    </Stack>
                  )
                })}
                <Divider />
              </>
            )
          })}
        </Stack>
      </Stack>
    </Modal>
  )
}
