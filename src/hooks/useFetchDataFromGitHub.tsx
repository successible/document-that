import { Octokit } from '@octokit/rest'
import { useEffect } from 'react'
import { fetchRepos } from '../helpers/github/operations/fetchRepos'
import { handleError } from '../helpers/utils/handleError'
import { useStore } from '../store/store'

export const useFetchDataFromGitHub = () => {
  const methods = useStore((state) => state.methods)
  const accessToken = useStore((state) => state.accessToken)

  useEffect(() => {
    const octokit = new Octokit({ auth: accessToken })
    accessToken !== '' &&
      Promise.all([
        // Currently, for privacy reasons, we do not want to access the user's email address.
        // However, if a user requests that feature in the future, we may add it.
        // octokit.rest.users.listEmailsForAuthenticatedUser(),
        octokit.rest.users.getAuthenticated(),
        fetchRepos(octokit),
      ])
        .then((responses) => {
          const [userResponse, repoResponse] = responses
          methods.setUser({
            ...userResponse.data,
            emails: [], // emailResponse.data,
          })
          methods.setRepos(repoResponse)
        })
        .catch((e) => handleError(e, methods))
  }, [accessToken, methods])
}
