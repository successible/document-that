import { hideNotification, showNotification } from '@mantine/notifications'
import { GitProgressEvent } from 'isomorphic-git'
import * as git from 'isomorphic-git'
import { Repo, User } from '../../../pages'
import { Methods } from '../../../store/store'
import { ERROR, INFO, SUCCESS } from '../../../theme/colors'
import { getFS } from '../../fs/getFS'
import { getProperties } from '../properties/getProperties'
import { getProxyUrl } from '../properties/getProxyUrl'
import { createGitConfig } from './createGitConfig'
import { deleteRepo } from './deleteRepo'

const notifyStagePending = () => {
  hideNotification('notify-stage-pending')
  showNotification({
    color: INFO,
    id: 'notify-stage-pending',
    message: ``,
    title: '💾 Changes are being staged',
  })
}

const notifyStageSuccess = () => {
  hideNotification('notify-stage-success')
  showNotification({
    color: SUCCESS,
    id: 'notify-stage-success',
    message: ``,
    title: '🚀 Changes have been staged',
  })
}

const notifyPushPending = () => {
  hideNotification('notify-push-pending')
  showNotification({
    color: INFO,
    id: 'notify-push-pending',
    message: '',
    title: '⬆️ Changes are being pushed up',
  })
}

const notifyPushSuccess = () => {
  hideNotification('notify-push-success')
  showNotification({
    color: SUCCESS,
    id: 'notify-push-success',
    message: ``,
    title: '🚀 Changes pushed up',
  })
}

const notifyPullPending = () => {
  hideNotification('notify-sync-pending')
  showNotification({
    color: INFO,
    id: 'notify-sync-pending',
    message: '',
    title: '🌎 Changes are being pulled down',
  })
}

const notifyPullSuccess = () => {
  hideNotification('notify-sync-success')
  showNotification({
    color: SUCCESS,
    id: 'notify-sync-success',
    message: '',
    title: '🚀 Changes pulled down',
  })
}

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
    notifyPullPending()
    console.log('Pulling repository...')
    await git.pull({
      ...getProperties(accessToken, activeRepo, user),
      onProgress: (progress: GitProgressEvent) => {
        methods.setCloneProgress(progress)
      },
      singleBranch: true,
      url: getProxyUrl(activeRepo),
    })
    console.log('Pulled repository')
    notifyPullSuccess()
  } catch (e) {
    const clone =
      // First two errors occur on Chrome, the last error occurs on Safari
      String(e).includes('ENOENT') ||
      String(e).includes('Cannot read properties of null') ||
      String(e).includes('null is not an object')

    if (clone) {
      try {
        notifyPullPending()
        console.log('Cloning repository...')
        await git.clone({
          ...getProperties(accessToken, activeRepo, user),
          onProgress: (progress: GitProgressEvent) => {
            console.log(progress)
            methods.setCloneProgress(progress)
          },
          url: getProxyUrl(activeRepo),
        })
        console.log('Cloned repository!')
        await createGitConfig(activeRepo, user)
      } catch (e) {
        console.log(e)

        // If git clone is unsuccessful, and the error is 404
        // Alert the user to the fact they may have changed or deleted their repository
        if (String(e).includes('404')) {
          await deleteRepo(activeRepo, methods)
          hideNotification('notify-sync-pending')
          hideNotification('notify-sync-missing')
          showNotification({
            color: ERROR,
            id: 'notify-sync-missing',
            message: `👻 Did you delete or rename it?`,
            title: 'Repository unavailable',
          })
          return
        }
      }
      notifyPullSuccess()
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
      notifyStagePending()
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
      notifyStageSuccess()

      // Now the files that have been changed are staged
      // We can now commit them and push them up

      notifyPushPending()
      await git.commit({
        ...getProperties(accessToken, activeRepo, user),
        message: `Update at ${new Date().toISOString()}`,
      })
      await git.push({
        ...getProperties(accessToken, activeRepo, user),
        onProgress: (progress: GitProgressEvent) => {
          console.log(progress)
        },
      })
      notifyPushSuccess()
    }
  }

  await methods.recalculateData()
}
