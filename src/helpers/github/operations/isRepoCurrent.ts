import * as git from 'isomorphic-git'
import { Repo, User } from '../../../pages'
import { getProperties } from '../properties/getProperties'
import { getProxyUrl } from '../properties/getProxyUrl'

export const isRepoCurrent = async (
  accessToken: string,
  activeRepo: Repo,
  user: User
) => {
  const branch = 'main'
  const local = await git.log({
    ...getProperties(accessToken, activeRepo, user),
  })
  const remote = await git.listServerRefs({
    ...getProperties(accessToken, activeRepo, user),
    prefix: `refs/heads/${branch}`,
    url: getProxyUrl(activeRepo),
  })

  // https://github.com/isomorphic-git/isomorphic-git/issues/398
  // The push will error if the local repo and remote repo are fully up to date
  // Hence, we must compare the oid(s) against each other
  if (local && local.length > 0 && remote && remote.length > 0) {
    if (local[0].oid === remote[0].oid) {
      console.log('Push skipped. The local and remote repo are up to date.')
      return true
    }
  }
  return false
}
