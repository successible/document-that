export const convertFileSystemPathToRepoPath = (
  path: string,
  newFolder?: string
) => {
  // We need to convert the file system path into JUST the repository path
  // Example: billy/wiki/foo/bar -> foo/bar
  // With if a new folder is passed, it is appended on the end
  // Example: billy/wiki/foo/bar/baz -> foo/bar/baz where baz is the folder
  return (newFolder ? `${path}/${newFolder}` : `${path}`)
    .split('/')
    .filter((name) => name !== '')
    .slice(1)
}
