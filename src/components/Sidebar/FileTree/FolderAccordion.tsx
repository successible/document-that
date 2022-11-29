import { Accordion, Box, Group } from '@mantine/core'
import reduce from 'immer'
import { get, set } from 'lodash'
import { getPathInFileTree } from '../../../helpers/fs/getPathInFileTree'
import { Folder, useStore } from '../../../store/store'
import { DotsButton } from './DotsButton'
import { RecursiveFileTree } from './RecursiveFileTree'

type props = { fullPath: string[]; folder: Folder; name: string }

export const FolderAccordion: React.FC<props> = ({
  folder,
  fullPath,
  name,
}) => {
  const colors = useStore((state) => state.colors)
  const activeRepo = useStore((state) => state.activeRepo)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)

  const expanded = folder.___expanded
  const value = expanded === 'yes' ? name : ''

  return (
    <Box>
      <Accordion
        chevronPosition="left"
        key={`accordion-${name}`}
        onChange={() => {
          // We show clicks the accordion chevron, will need to toggle the expanded section
          // Of the folder object in the relevant section of the file tree
          methods.setData(
            reduce(data, (draft) => {
              const folderPath = getPathInFileTree(activeRepo, fullPath)
              const folderInTree = get(draft, folderPath)
              folderInTree.___expanded = expanded === 'yes' ? 'no' : 'yes'
              set(draft, folderPath, folderInTree)
            })
          )
        }}
        styles={{
          content: {
            paddingBottom: 0,
            paddingLeft: 10,
            paddingRight: 0,
            paddingTop: 0,
          },
          control: {
            '&:hover': {
              background: 'inherit',
              color: colors.button.secondary,
            },
            outlineColor: `${colors.button.secondary} !important`,
            outlineWidth: `1px !important`,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            width: '100%',
          },
          item: {
            borderColor: 'transparent',
            width: '100%',
          },
          label: {
            fontSize: '1rem',
          },
        }}
        value={value}
      >
        <Accordion.Item value={name}>
          <Group mt={15} noWrap position="apart" spacing={8}>
            <Accordion.Control>{name}</Accordion.Control>
            <DotsButton fullPath={fullPath} isFolder={true} name={name} />
          </Group>
          <Accordion.Panel>
            <RecursiveFileTree fileTree={folder} fullPath={fullPath} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  )
}
