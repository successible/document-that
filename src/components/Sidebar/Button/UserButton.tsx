import { Anchor, Box, Group, Text } from '@mantine/core'
import { FaGithub } from 'react-icons/fa'
import { useStore } from '../../../store/store'

export const UserButton = () => {
  const colors = useStore((state) => state.colors)
  const user = useStore((state) => state.user)
  const accessToken = useStore((state) => state.accessToken)
  const activeBranch = useStore((state) => state.activeBranch)

  if (user && accessToken !== '') {
    const url = user?.html_url
    return (
      <Anchor
        href={url}
        rel="noopener noreferer"
        target="_blank"
        sx={{
          outlineColor: `${colors.outline} !important`,
          padding: '0px 3px',
        }}
      >
        <Box
          sx={{
            ':focus, :hover': {
              textDecoration: 'underline',
            },
            color: colors.text,
          }}
        >
          <Group spacing={0}>
            <FaGithub />
            <Text ml={10} size={'md'} weight={700}>
              {url.replace('https://github.com/', '')}{' '}
              {activeBranch && <>({activeBranch})</>}
            </Text>
          </Group>
        </Box>
      </Anchor>
    )
  } else {
    return <></>
  }
}
