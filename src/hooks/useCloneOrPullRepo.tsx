import { useEffect } from 'react'

import { cloneOrPullRepo } from '../helpers/github/operations/cloneOrPullRepo'

import { useStore } from '../store/store'

export const usePullOrCloneRepo = () => {
  const activeRepo = useStore((state) => state.activeRepo)
  const user = useStore((state) => state.user)
  const accessToken = useStore((state) => state.accessToken)
  const methods = useStore((state) => state.methods)

  useEffect(() => {
    cloneOrPullRepo(accessToken, activeRepo, user, methods)
    // We only cloneOrPullRepo to run once on mount, so we only pass in user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
}
