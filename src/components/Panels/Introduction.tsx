import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  List,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { AlertCircle } from 'tabler-icons-react'
import { useImmer } from 'use-immer'
import { useStore } from '../../store/store'
import { SidebarAlert } from './Alerts/SidebarAlert'

export const Introduction = () => {
  const [localAccessToken, setLocalAccessToken] = useImmer('')
  const accessToken = useStore((state) => state.accessToken)
  const methods = useStore((state) => state.methods)
  const sidebarOpen = useStore((state) => state.openSidebar)

  return (
    <Stack
      align="center"
      sx={{
        margin: '0px auto',
        maxWidth: 600,
        width: '90%',
      }}
    >
      {accessToken === '' ? (
        <>
          <Title
            sx={{
              fontWeight: 900,
              marginTop: 75,
            }}
          >
            Almost there!
          </Title>
          <Text size="xl" weight={500} mb={10}>
            Your free wiki or blog will be ready in under five minutes. If you
            already have your GitHub access token, you can skip these
            instructions and save it below. Otherwise, read on!
          </Text>

          <Group sx={{ '> form': { width: '100%' }, width: '100%' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (localAccessToken !== '') {
                  methods.setAccessToken(localAccessToken)
                }
              }}
            >
              <TextInput
                mt={5}
                sx={{ width: '100%' }}
                label="Your GitHub access token"
                placeholder="github_pat_XXX"
                value={localAccessToken}
                onChange={(e) => setLocalAccessToken(e.target.value)}
                description="The token must be able to access the contents of your wiki or blog repository"
              ></TextInput>
              <Button mt={15} type="submit" color="green">
                Save
              </Button>
            </form>
          </Group>
          <Divider />
          <List size={'lg'} mb={100} type="ordered">
            <List.Item>
              Create a free GitHub.com account{' '}
              <Text
                ml={2}
                sx={{ display: 'inline', position: 'relative', top: -1 }}
                size={'sm'}
              >
                (3 min)
              </Text>
            </List.Item>

            <Alert
              mt={20}
              mb={20}
              color="blue"
              icon={<AlertCircle size={16} />}
              sx={{
                width: '100%',
              }}
              title="Not sure what GitHub is?"
            >
              Think of{' '}
              <Anchor
                href="https://github.com"
                size="sm"
                target="_blank"
                underline={true}
              >
                GitHub.com
              </Anchor>{' '}
              as a free and secure way to edit and sync text. It is owned by
              Microsoft and used by millions of people all across the world. We
              built Document That on top of GitHub. That is why you need a free
              GitHub account to use this app.
            </Alert>

            <List.Item>
              Create a private repository with any name{' '}
              <Text
                ml={2}
                sx={{ display: 'inline', position: 'relative', top: -1 }}
                size={'sm'}
              >
                (1 min)
              </Text>
            </List.Item>

            <Alert
              icon={<AlertCircle size={16} />}
              mt={20}
              mb={20}
              color="blue"
              title="What is a repository?"
            >
              Think of it like a folder. You should keep your entire wiki or
              blog in one repository. You can include both images and text. If
              you are stuck on a name, call it wiki or blog. Make sure it is
              private.
            </Alert>

            <List.Item>
              Create a GitHub access token{' '}
              <Text
                ml={2}
                sx={{ display: 'inline', position: 'relative', top: -1 }}
                size={'sm'}
              >
                (1 min)
              </Text>
            </List.Item>

            <Alert
              color="blue"
              icon={<AlertCircle size={16} />}
              mt={20}
              mb={20}
              title="Is my token secure?"
            >
              Yes! Your data is only stored in your browser{`'`}s localStorage.
              We cannot see or change it. Technically, we do proxy your request
              to GitHub via our server to bypass CORS. However, we do not store
              or log this request.{' '}
              <Anchor
                href="https://github.com/successible/document-that/blob/main/src/server/server.ts"
                size="sm"
                target="_blank"
                underline={true}
              >
                Our code is open
              </Anchor>
              , so you can audit this claim for yourself. You can even{' '}
              <Anchor
                href="https://github.com/successible/document-that#host-on-netlify"
                size="sm"
                target="_blank"
                underline={true}
              >
                host Document That yourself
              </Anchor>{' '}
              if that would make you more comfortable.
            </Alert>
            <Alert
              color="green"
              icon={<AlertCircle size={16} />}
              mt={20}
              mb={20}
              title="What permissions should I give my token?"
            >
              It depends! Document That needs read/write access to Contents of
              your wiki or blog repository to work. If you want to publish your
              repository to the Internet, great! We will also need read/write
              access to Actions and Workflows. That is because we publish your
              content using GitHub Actions.
            </Alert>
            <List.Item>Finally, save the token in the input above.</List.Item>
          </List>
        </>
      ) : (
        <>
          <Title
            sx={{
              '@media (min-width: 768px)': {
                marginTop: 0,
              },
              fontWeight: 900,
              marginTop: 75,
            }}
          >
            You are logged in!
          </Title>
          <Text size="xl" weight={500} mb={10} align="center">
            {sidebarOpen
              ? 'Select a repository from the dropdown on the sidebar ⚡'
              : 'Open the sidebar and select a repository from the dropdown ⚡'}
          </Text>
          <SidebarAlert />
        </>
      )}
    </Stack>
  )
}
