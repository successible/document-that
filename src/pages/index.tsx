import { Group, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { RestEndpointMethodTypes } from '@octokit/rest'
import React, { useEffect } from 'react'
import { Modals } from '../components/Modals/Modals'
import { MainPanel } from '../components/Panels/MainPanel'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { getActiveData } from '../helpers/fs/getActiveData'
import { mobileWidth } from '../helpers/utils/theme/layout'
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
  const activeData = getActiveData(activeRepo, data)
  const methods = useStore((state) => state.methods)

  // Why: https://gist.github.com/meotimdihia/9faec94a4b223932143cd81a19058f05
  const { mounted } = useMounted()
  const { width } = useViewportSize()

  const isMobile = width <= mobileWidth
  const filesExist = activeRepo && activeData.files.length >= 1
  const showSidebar =
    accessToken !== '' && (!isMobile || (isMobile && filesExist))
  const showMainPanel = !isMobile || (isMobile && !sidebarOpen)

  useEffect(() => {
    // Should we open the sidebar when the application mounts?
    showSidebar && methods.setOpenSidebar(true)
  }, [methods, showSidebar])

  useFetchDataFromGitHub()
  usePullOrCloneRepo()
  useFetchDataFromGit(data, accessToken, activeRepo, user, methods)

  return (
    <Stack spacing={0}>
      <Modals />
      <Group noWrap spacing={0}>
        {sidebarOpen && <Sidebar />}
        {mounted && showMainPanel ? <MainPanel /> : <div />}
      </Group>
    </Stack>
  )
}

export default Index
