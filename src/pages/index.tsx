import { Group, Stack } from '@mantine/core'
import { getHotkeyHandler, useViewportSize } from '@mantine/hooks'
import { RestEndpointMethodTypes } from '@octokit/rest'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Modals } from '../components/Modals/Modals'
import { MainPanel } from '../components/Panels/MainPanel'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { MOBILE_WIDTH } from '../helpers/utils/isMobile'
import { usePullOrCloneRepo } from '../hooks/useCloneOrPullRepo'
import { useFetchDataFromGit } from '../hooks/useFetchDataFromGit'
import { useFetchDataFromGitHub } from '../hooks/useFetchDataFromGitHub'
import { useMounted } from '../hooks/useMounted'
import { useStore } from '../store/store'

export type Repos =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data']
export type Repo = Repos[number]

export type User =
  RestEndpointMethodTypes['users']['getAuthenticated']['response']['data'] & {
    emails: RestEndpointMethodTypes['users']['listEmailsForAuthenticatedUser']['response']['data']
  }

const Index = () => {
  const accessToken = useStore((state) => state.accessToken)
  const sidebarOpen = useStore((state) => state.openSidebar)
  const activeRepo = useStore((state) => state.activeRepo)
  const user = useStore((state) => state.user)
  const data = useStore((state) => state.data)
  const methods = useStore((state) => state.methods)
  const editorOptions = useStore((state) => state.editorOptions)

  // Why: https://gist.github.com/meotimdihia/9faec94a4b223932143cd81a19058f05
  const { mounted } = useMounted()
  const { width } = useViewportSize()

  const isMobile = width <= MOBILE_WIDTH
  const showSidebar = isMobile
  const showMainPanel = true

  useEffect(() => {
    // Should we open the sidebar when the application mounts?
    showSidebar && methods.setOpenSidebar(true)
  }, [methods, showSidebar])

  useFetchDataFromGitHub()
  usePullOrCloneRepo()
  useFetchDataFromGit(data, accessToken, activeRepo, user, methods)

  useEffect(() => {
    const handler = getHotkeyHandler([
      ['mod+p', () => methods.setOpenNameSearch(true)],
      // We want to disable the browser's default save behavior
      // That is because we save the file on every key stroke
      ['mod+s', () => toast.success('File saved')],
      [
        'mod+m',
        () =>
          methods.setEditorOptions({
            ...editorOptions,
            richText: !editorOptions.richText,
          }),
      ],
    ])

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editorOptions, methods])

  return (
    <Stack spacing={0}>
      <Modals />
      <Group noWrap spacing={0}>
        {sidebarOpen && accessToken && <Sidebar />}
        {mounted && showMainPanel ? <MainPanel /> : <div />}
      </Group>
    </Stack>
  )
}

export default Index
