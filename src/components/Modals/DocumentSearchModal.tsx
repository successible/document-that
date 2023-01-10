import { Modal, Title } from '@mantine/core'
import { useImmer } from 'use-immer'
import { useStore } from '../../store/store'
import { DocumentSearchModalForm } from './DocumentSearchModal/components/DocumentSearchModalForm'
import { DocumentSearchModalResults } from './DocumentSearchModal/components/DocumentSearchModalResults'
import { Matches } from './SearchModal/helpers/findMatchesInDocuments'

export const DocumentSearchModal = () => {
  const [matches, setMatches] = useImmer({} as Matches)
  const openDocumentSearch = useStore((state) => state.openDocumentSearch)
  const methods = useStore((state) => state.methods)

  return (
    <Modal
      size={'800px'}
      onClose={() => {
        methods.setOpenDocumentSearch(false)
        setMatches({})
      }}
      opened={openDocumentSearch}
    >
      <Title mb={20}>Search documents</Title>
      <DocumentSearchModalForm setMatches={setMatches} />
      <DocumentSearchModalResults matches={matches} setMatches={setMatches} />
    </Modal>
  )
}
