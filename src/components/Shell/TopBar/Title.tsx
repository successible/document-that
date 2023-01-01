import { Group, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { Book } from 'tabler-icons-react'
import { useStore } from '../../../store/store'
useStore

export const Title = () => {
  const colors = useStore((state) => state.colors)
  const methods = useStore((state) => state.methods)
  return (
    <>
      <Group ml={20}>
        <Book color={colors.text} />
      </Group>
      <Group
        sx={{
          a: {
            outlineColor: `${colors.outline} !important`,
            padding: '0px 3px',
            textDecoration: 'none',
          },
          height: 'auto',
        }}
      >
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
      </Group>
    </>
  )
}
