/* eslint-disable @next/next/no-img-element */

import { Group, Loader, Stack } from '@mantine/core'
import React from 'react'
import { useStore } from '../../../../store/store'

type props = { path: string | undefined; fileContent: string }
export const BinaryFilePanel: React.FC<props> = ({ fileContent, path }) => {
  const lastRecalculated = useStore((state) => state.lastRecalculated)

  const isPDF = path?.includes('.pdf')

  return (
    <Stack
      justify="center"
      sx={{
        height: '100%',
        margin: '0px auto',
        maxWidth: isPDF ? undefined : 500,
        width: isPDF ? '100%' : '90%',
      }}
    >
      {path?.includes('.pdf') ? (
        <Group
          position="center"
          sx={{
            height: '100%',
            iframe: {
              height: '100%',
              width: '100%',
            },
            width: '100%',
          }}
        >
          {/* Until recalculateData has run, the object URL is invalid, as it was stored in localStorage from the last render */}
          {/* The PDF is rendered in this iframe */}
          {lastRecalculated ? (
            <iframe src={fileContent} />
          ) : (
            <Loader size={'lg'} color={'white'} variant={'dots'} />
          )}
        </Group>
      ) : (
        <img src={fileContent} alt={(path || '').split('/').slice(-1)[0]} />
      )}
    </Stack>
  )
}
