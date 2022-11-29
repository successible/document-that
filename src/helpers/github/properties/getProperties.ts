import FS from '@isomorphic-git/lightning-fs'
import http from 'isomorphic-git/http/web'
import { Repo, User } from '../../../pages'
import { getFS } from '../../fs/getFS'
import { getAuth } from './getAuth'
import { getAuthor } from './getAuthor'
import { getDir } from './getDir'

export const getProperties = (
  accessToken: string,
  activeRepo: Repo,
  user: User
) => {
  const fs = getFS() as FS
  return {
    author: getAuthor(user),
    dir: getDir(activeRepo),
    fs,
    headers: {
      Authorization: `Basic ${getAuth(accessToken)}`,
    },
    http,
  }
}
