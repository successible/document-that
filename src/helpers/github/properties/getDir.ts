import { Repo } from '../../../pages'

export const getDir = (activeRepo: Repo | null) =>
  `/${activeRepo?.full_name.replaceAll('/', '-')}`
