export const getIcon = (filename: string) => {
  // See here: https://github.com/websemantics/file-icons-js
  // @ts-ignore - This library doesn't have types
  const icons = FileIcons as {
    getClass: (filename: string) => string | null
  }
  const className = icons.getClass(filename) || 'text-icon'
  return className
}
