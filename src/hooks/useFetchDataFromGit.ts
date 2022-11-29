import * as git from 'isomorphic-git'
import { useEffect } from 'react'
import { getFS } from '../helpers/fs/getFS'
import { getProperties } from '../helpers/github/properties/getProperties'
import { handleError } from '../helpers/utils/handleError'
import { Repo, User } from '../pages'
import { Data, Methods } from '../store/store'

export const useFetchDataFromGit = (
  data: Data,
  accessToken: string,
  activeRepo: Repo | null,
  user: User | null,
  methods: Methods
) => {
  useEffect(() => {
    const fs = getFS()
    if (!activeRepo || !user || !fs) return
    git
      .currentBranch({
        ...getProperties(accessToken, activeRepo, user),
        fullname: false,
      })
      .then((branch) => branch && methods.setActiveBranch(branch))
      .catch((e) => {
        const notFound = String(e).includes('NotFoundError')
        !notFound && handleError(e, methods)
      })
  }, [data, accessToken, activeRepo, user, methods])
}
