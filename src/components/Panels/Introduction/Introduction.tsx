import {
  Alert,
  Anchor,
  Burger,
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
import { useStore } from '../../../store/store'

export const Introduction = () => {
  const [localAccessToken, setLocalAccessToken] = useImmer('')
  const accessToken = useStore((state) => state.accessToken)
  const methods = useStore((state) => state.methods)

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
            already have your GitHub access token, you can skip the instructions
            and save it below. Otherwise, read on!
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
                description="Keep it scoped to the wiki or blog repository"
              ></TextInput>
              <Button mt={15} type="submit" color="green">
                Save
              </Button>
            </form>
          </Group>
          <Divider />
          <List size={'lg'} mb={100}>
            <List.Item>
              Create a free GitHub account{' '}
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
              Think of GitHub as a free and secure way to edit and sync text. It
              is owned by Microsoft and used by millions all across the world.
              We built Document That on top of GitHub. Hence, you need a free
              GitHub account to use this app.
            </Alert>

            <List.Item>
              Create a repo with any name{' '}
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
              It is like a folder. Keep your entire wiki or blog in one
              repository. You want to include both images and text.
            </Alert>

            <List.Item>
              Create a personal access token{' '}
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
              Yes! Your data is only stored in the browser. We cannot see it.
              Technically, we also proxy your request to GitHub via our server
              to bypass CORS. However, we do not store or log this request.
              Also,{' '}
              <Anchor
                href="https://github.com/successible/document-that"
                size="sm"
                target="_blank"
                underline={true}
              >
                our code is open
              </Anchor>
              , so you can audit this claim for yourself. You can even host
              Document That yourself if you want.
            </Alert>
            <Alert
              color="green"
              icon={<AlertCircle size={16} />}
              mt={20}
              mb={20}
              title="What permissions should I give?"
            >
              It depends! Document That needs read/write access to Contents to
              work. If you also want to publish the wiki or blog, it also needs
              read/write access to Actions and Workflows. That is because we
              publish content using GitHub Actions.
            </Alert>
            <List.Item>Finally, save the token in the input.</List.Item>
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
          <Text size="xl" weight={500} mb={10}>
            You{`'`}re almost there! You open the sidebar and select a
            repository from the dropdown.
          </Text>
          <Alert>
            To open the sidebar, click or tap the{' '}
            <Burger
              opened={false}
              size={16}
              sx={{
                position: 'relative',
                top: -4,
              }}
            />{' '}
            icon on the top of the screen ☝️.
          </Alert>
        </>
      )}
    </Stack>
  )
}
