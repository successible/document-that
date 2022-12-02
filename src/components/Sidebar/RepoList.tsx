import { Select } from '@mantine/core'
import { Database } from 'tabler-icons-react'
import { cloneOrPullRepo } from '../../helpers/github/operations/cloneOrPullRepo'
import { useStore } from '../../store/store'

export const RepoList = () => {
  const colors = useStore((state) => state.colors)
  const repos = useStore((state) => state.repos)
  const user = useStore((state) => state.user)
  const accessToken = useStore((state) => state.accessToken)
  const activeRepo = useStore((state) => state.activeRepo)
  const methods = useStore((state) => state.methods)

  console.log(activeRepo)

  return (
    <Select
      data={repos?.map((repo) => ({
        label: repo.name,
        value: repo.name,
      }))}
      icon={<Database size={14} />}
      label="Select your repository"
      nothingFound="No options"
      onChange={(value) => {
        const repo = repos.find((repo) => repo.name === value)
        repo && cloneOrPullRepo(accessToken, repo, user, methods)
        repo && methods.setActiveRepo(repo)
      }}
      placeholder="Repository"
      searchable
      styles={{
        input: {
          backgroundColor: colors.foreground,
        },
        label: {
          color: colors.text,
          marginBottom: 10,
        },
      }}
      sx={{
        width: '100%',
      }}
      value={activeRepo?.name || null}
      clearable
    />
  )
}
