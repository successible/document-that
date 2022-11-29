import { Burger, Group, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { Book } from 'tabler-icons-react'
import { useMounted } from '../../hooks/useMounted'
import { useStore } from '../../store/store'

export const TopBar = () => {
  const colors = useStore((state) => state.colors)
  const accessToken = useStore((state) => state.accessToken)

  const openSidebar = useStore((state) => state.openSidebar)
  const methods = useStore((state) => state.methods)

  const { mounted } = useMounted()

  return (
    <Group
      sx={{
        a: {
          textDecoration: 'none',
        },
        backgroundColor: `${colors.background}`,
        borderBottom: `1px solid ${colors.text}`,
        height: 50,
      }}
    >
      <Group ml={20}>
        <Book color={colors.text} />
      </Group>
      <Link href="/">
        <Text
          onClick={() => {
            methods.setOpenSettings(false)
            methods.setOpenSidebar(true)
          }}
          sx={{
            color: `${colors.text}`,
            fontWeight: 900,
          }}
        >
          Document That
        </Text>
      </Link>
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
