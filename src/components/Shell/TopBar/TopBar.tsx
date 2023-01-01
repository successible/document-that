import { Burger, Group } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React from 'react'
import { MOBILE_WIDTH } from '../../../helpers/utils/isMobile'
import { useMounted } from '../../../hooks/useMounted'
import { useStore } from '../../../store/store'
import { Tabs } from './Tabs'
import { TextSwitcher } from './TextSwitcher'
import { Title } from './Title'

export const TopBar = () => {
  const colors = useStore((state) => state.colors)
  const accessToken = useStore((state) => state.accessToken)
  const openSidebar = useStore((state) => state.openSidebar)
  const methods = useStore((state) => state.methods)

  const { mounted } = useMounted()
  const { width } = useViewportSize()

  return (
    <Group
      align={'center'}
      sx={{
        backgroundColor: `${colors.background}`,
        borderBottom: `1px solid ${colors.text}`,
        height: 50,
      }}
    >
      <Title />
      <TextSwitcher />
      {mounted && width >= MOBILE_WIDTH && <Tabs />}
      {mounted && accessToken && (
        <Burger
          color={'white'}
          mr="xl"
          onClick={() => methods.setOpenSidebar(!openSidebar)}
          opened={openSidebar}
          size="sm"
          sx={{
            marginLeft: 'auto',
          }}
        />
      )}
    </Group>
  )
}
