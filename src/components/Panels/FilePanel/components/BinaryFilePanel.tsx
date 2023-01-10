/* eslint-disable @next/next/no-img-element */

import { Box, Loader, Stack } from '@mantine/core'
import React from 'react'

type props = { path: string | undefined; fileContent: string }
export const BinaryFilePanel: React.FC<props> = ({ fileContent, path }) => {
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
        <Box
          sx={{
            height: '100%',
            iframe: {
              height: '100%',
              width: '100%',
            },
            width: '100%',
          }}
        >
          <iframe src={fileContent} /> : <Loader />
        </Box>
      ) : (
        <img src={fileContent} alt={(path || '').split('/').slice(-1)[0]} />
      )}
    </Stack>
  )
}
