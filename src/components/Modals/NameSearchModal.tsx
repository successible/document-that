import {
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import Fuse from 'fuse.js'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { getActiveData } from '../../helpers/fs/getActiveData'
import { getPathInFileSystem } from '../../helpers/fs/getPathInFileSystem'
import { readFile } from '../../helpers/fs/readFile'
import { useStore } from '../../store/store'

export const NameSearchModal = () => {
  const [text, setText] = useImmer('')
  const [matches, setMatches] = useImmer([] as string[])

  const colors = useStore((state) => state.colors)
  const openNameSearch = useStore((state) => state.openNameSearch)
  const data = useStore((state) => state.data)
  const activeRepo = useStore((state) => state.activeRepo)
  const activeData = getActiveData(activeRepo, data)
  const files = activeData.files
  const methods = useStore((state) => state.methods)

  const fuse = new Fuse(
    files.map((file) => file[0]),
    {
      includeScore: true,
    }
  )

  const INPUT_ID = 'name-search-modal-text-input'
  useEffect(() => {
    const input = document.getElementById(INPUT_ID) as HTMLInputElement | null
    if (input && openNameSearch) {
      setTimeout(() => {
        input.focus()
      }, 0)
    }
  }, [openNameSearch])

  return (
    <Modal
      size={'800px'}
      onClose={() => {
        methods.setOpenNameSearch(false)
        setText('')
        setMatches([])
      }}
      opened={openNameSearch}
    >
      <Title mb={20}>Find file</Title>
      <TextInput
        id={INPUT_ID}
        value={text}
        onChange={(e) => {
          const newText = e.target.value
          const results = fuse.search(newText)
          if (newText !== '') {
            setMatches(results.slice(0, 20).map((result) => result.item))
          } else {
            setMatches([])
          }
          setText(newText)
        }}
        placeholder={'Search for file by name'}
      />
      {matches.length >= 1 && <Divider mt={20} />}
      <Stack mt={20}>
        {matches.map((match) => (
          <UnstyledButton
            key={match}
            onClick={async () => {
              const path = getPathInFileSystem(activeRepo, match.split('/'))
              const file = await readFile(path)

              methods.setActiveFile({ content: file, path })

              methods.setOpenNameSearch(false)
              setText('')
              setMatches([])
            }}
          >
            <Group>
              <Text>{match.split('/').slice(-1)[0]}</Text>
              <Text sx={{ color: colors.accent, fontSize: '16px' }}>
                {match.split('/').slice(0, -1).join('/')}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Modal>
  )
}
