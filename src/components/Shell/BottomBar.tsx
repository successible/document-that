import { Box, Group } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { getContactEmail } from '../../helpers/utils/getContactEmail'
import { useStore } from '../../store/store'

export const BottomBar = () => {
  const colors = useStore((state) => state.colors)

  return (
    <Group
      position={'center'}
      sx={{
        a: { color: colors.button.primary },
        backgroundColor: `${colors.background}`,
        borderTop: `1px solid ${colors.text}`,
        fontSize: 16,
        fontWeight: 900,
        height: 50,
        width: '100%',
      }}
    >
      <Box mr={10}>
        <a href={`mailto:${getContactEmail()}`}>{getContactEmail()}</a>
      </Box>
      <Box
        sx={{
          a: {
            outlineColor: `${colors.outline} !important`,
          },
        }}
      >
        <Link href="/legal">Legal</Link>
      </Box>
    </Group>
  )
}
