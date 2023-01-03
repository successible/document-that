import { Modal, Title } from '@mantine/core'
import { useImmer } from 'use-immer'
import { useStore } from '../../store/store'
import { SearchModalForm } from './components/SearchModalForm'
import { SearchModalResults } from './components/SearchModalResults'
import { Matches } from './helpers/SearchModal/findMatchesInDocuments'

export const SearchModal = () => {
  const [matches, setMatches] = useImmer({} as Matches)
  const openSearch = useStore((state) => state.openSearch)
  const methods = useStore((state) => state.methods)

  return (
    <Modal
      size={'800px'}
      onClose={() => {
        methods.setOpenSearch(false)
        setMatches({})
      }}
      opened={openSearch}
    >
      <Title mb={20}>Search documents</Title>
      <SearchModalForm setMatches={setMatches} />
      <SearchModalResults matches={matches} setMatches={setMatches} />
    </Modal>
  )
}
