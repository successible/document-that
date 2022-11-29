import * as git from 'isomorphic-git'
import { Repo, User } from '../../../pages'
import { getFS } from '../../fs/getFS'
import { getDir } from '../properties/getDir'

export const createGitConfig = async (activeRepo: Repo, user: User) => {
  const fs = getFS()
  if (!fs) return

  const dir = getDir(activeRepo)

  await git.setConfig({
    dir,
    fs,
    path: 'user.name',
    value: user.login,
  })

  const emails = user.emails.filter((email) => email.primary)

  await git.setConfig({
    dir,
    fs,
    path: 'user.email',
    value: emails.length >= 1 ? emails[0].email : '',
  })
}
