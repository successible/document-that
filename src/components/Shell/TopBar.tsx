import { Burger, Button, Group, Text } from '@mantine/core'
import produce from 'immer'
import Link from 'next/link'
import React from 'react'
import { Book } from 'tabler-icons-react'
import { useMounted } from '../../hooks/useMounted'
import { useStore } from '../../store/store'

export const TopBar = () => {
  const colors = useStore((state) => state.colors)
  const accessToken = useStore((state) => state.accessToken)
  const editorOptions = useStore((state) => state.editorOptions)

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
      <Button
        sx={{
          fontSize: '13px',
        }}
        compact
        onClick={() => {
          methods.setEditorOptions(
            produce(editorOptions, (draft) => {
              draft.richText = !draft.richText
            })
          )
        }}
        styles={(theme) => ({
          root: {
            '&:hover': {
              backgroundColor: theme.fn.darken(colors.button.neutral, 0.05),
            },
            backgroundColor: colors.button.neutral,
          },
        })}
      >
        {editorOptions.richText ? 'Rich' : 'Plain'} text
      </Button>
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
