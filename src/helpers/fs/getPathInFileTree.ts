import { Repo } from '../../pages'

export const getPathInFileTree = (
  activeRepo: Repo | null,
  fullPath: string[]
): string[] => {
  const repoName = activeRepo?.full_name || ''
  return [repoName, 'fileTree', ...fullPath]
}
