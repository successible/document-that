import { Octokit } from '@octokit/rest'

export const fetchRepos = (octokit: Octokit) => {
  return octokit.rest.repos.listForAuthenticatedUser().then((response) => {
    return response.data
  })
}
