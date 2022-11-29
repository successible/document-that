import * as git from 'isomorphic-git'
import { Repo, User } from '../../../pages'
import { getFS } from '../../fs/getFS'
import { getProperties } from '../properties/getProperties'

export const checkoutBranch = async (
  accessToken: string,
  activeRepo: Repo,
  user: User,
  branch: string
) => {
  const fs = getFS()
  if (!fs) return

  try {
    await git.checkout({
      ...getProperties(accessToken, activeRepo, user),
      ref: branch,
    })
  } catch (e) {
    console.log(e)
  }
}
