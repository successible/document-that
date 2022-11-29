import '../../node_modules/file-icons-js/css/style.css'
import '../../node_modules/file-icons-js/dist/file-icons.js'
import 'core-js/actual/string' // Polyfill string methods using core.js

import FS from '@isomorphic-git/lightning-fs'
import { get } from 'lodash'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import Div100vh from 'react-div-100vh'
import { ErrorBoundary } from 'react-error-boundary'
import { Shell } from '../components/Shell/Shell'
import { useStore } from '../store/store'

function _App({ Component, pageProps }: AppProps) {
  const accessToken = useStore((state) => state.accessToken)
  const setFS = useStore((state) => state.methods.setFS)

  useEffect(() => {
    const fs = (get(window, 'fs', undefined) as unknown as FS) || new FS('fs')
    setFS(fs)
  }, [setFS, accessToken])

  return (
    <ErrorBoundary
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      FallbackComponent={({ error, resetErrorBoundary }) => {
        const cloneError = 'rendered with invalid value or without value'
        if (String(error).includes(cloneError)) {
          window.localStorage.clear()
          window.location.reload()
        }
        return <div />
      }}
    >
      <Div100vh>
        <Shell>
          <Head>
            <title>Document That</title>
          </Head>
          <Component {...pageProps} />
        </Shell>
      </Div100vh>
    </ErrorBoundary>
  )
}

export default _App
