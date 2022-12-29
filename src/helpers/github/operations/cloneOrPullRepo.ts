import { GitProgressEvent } from 'isomorphic-git'
import * as git from 'isomorphic-git'
import toast from 'react-hot-toast'
import { Repo, User } from '../../../pages'
import { Methods } from '../../../store/store'
import { getFS } from '../../fs/getFS'
import { handleError } from '../../utils/handleError'
import { getProperties } from '../properties/getProperties'
import { getProxyUrl } from '../properties/getProxyUrl'
import { createGitConfig } from './createGitConfig'

export const cloneOrPullRepo = async (
  accessToken: string,
  activeRepo: Repo | null,
  user: User | null,
  methods: Methods,
  pushChanges = false
) => {
  const fs = getFS()

  // Silently abort the clone or pull repo operation if any of these are null or undefined
  if (!fs || !activeRepo || !user || accessToken === '') return

  try {
    console.log('Pulling repository...')
    const pullPromise = git.pull({
      ...getProperties(accessToken, activeRepo, user),
      onProgress: (progress: GitProgressEvent) => {
        methods.setCloneProgress(progress)
      },
      singleBranch: true,
      url: getProxyUrl(activeRepo),
    })
    toast.promise(pullPromise, {
      error: (error) => handleError(error, methods),
      loading: 'Changes are being pulled down',
      success: () => 'Changes pulled down',
    })
    await pullPromise
    console.log('Pulled repository')
  } catch (e) {
    const clone =
      // First two errors occur on Chrome, the last error occurs on Safari
      String(e).includes('ENOENT') ||
      String(e).includes('Cannot read properties of null') ||
      String(e).includes('null is not an object')

    if (clone) {
      try {
        console.log('Cloning repository...')
        const clonePromise = git.clone({
          ...getProperties(accessToken, activeRepo, user),
          onProgress: (progress: GitProgressEvent) => {
            console.log(progress)
            methods.setCloneProgress(progress)
          },
          url: getProxyUrl(activeRepo),
        })
        toast.promise(clonePromise, {
          error: (error) => handleError(error, methods),
          loading: 'Repository is being cloned down',
          success: () => 'Repository cloned down',
        })
        await clonePromise
        console.log('Cloned repository!')
        await createGitConfig(activeRepo, user)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log(e)
    }
  }

  // We only want to stage, commit, and push files
  // If the user has explicitly asked for that by clicking the sync button
  if (pushChanges) {
    // Let's changed for any changed files
    let filesChanged = false
    const statuses = await git
      .statusMatrix({ ...getProperties(accessToken, activeRepo, user) })
      .then((status) =>
        Promise.all(
          status.map(([filepath, , worktreeStatus]) => {
            // 2 = Create or edited a file
            // 1 = Unchanged
            // 0 = Deleted a file
            if (worktreeStatus !== 1) {
              filesChanged = true
            }
            return { filepath, worktreeStatus }
          })
        )
      )

    // If files have changed, let's stage them
    // This is the equivalent of  git add -A

    if (filesChanged) {
      const stagingPromise = new Promise((resolve) => {
        for (const status of statuses) {
          const { filepath, worktreeStatus } = status
          worktreeStatus
            ? git.add({
                ...getProperties(accessToken, activeRepo, user),
                filepath,
              })
            : git.remove({
                ...getProperties(accessToken, activeRepo, user),
                filepath,
              })
        }
        return resolve(true)
      })

      toast.promise(stagingPromise, {
        error: (error) => handleError(error, methods),
        loading: 'Changes being staged',
        success: () => 'Changes staged',
      })

      await stagingPromise
      console.log('Files staged!')

      // Now the files that have been changed are staged
      // We can now commit them and push them up

      const commitPromise = git.commit({
        ...getProperties(accessToken, activeRepo, user),
        message: `Update at ${new Date().toISOString()}`,
      })
      const pushPromise = git.push({
        ...getProperties(accessToken, activeRepo, user),
        onProgress: (progress: GitProgressEvent) => {
          console.log(progress)
        },
      })

      const pushAndCommitPromise = commitPromise.then(() => pushPromise)
      toast.promise(pushAndCommitPromise, {
        error: (error) => handleError(error, methods),
        loading: 'Changes being pushed up',
        success: () => 'Changes pushed up',
      })

      await pushAndCommitPromise
      console.log('Files pushed up!')
    }
  }

  await methods.recalculateData()
}
