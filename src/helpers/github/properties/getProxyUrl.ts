import { Repo } from '../../../pages'
import { isProduction } from '../../utils/isProduction'

const getProxyRoot = (serverDomain: string | undefined) => {
  if (serverDomain || isProduction()) {
    return `${serverDomain || window.location.origin}/github/`
  } else {
    return `http://localhost:3001/github/`
  }
}

export const getProxyUrl = (activeRepo: Repo) => {
  const repoUrl = activeRepo.html_url.replace('https://github.com/', '')
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN
  const proxyUrl = `${getProxyRoot(serverDomain)}${repoUrl}`
  return proxyUrl
}
