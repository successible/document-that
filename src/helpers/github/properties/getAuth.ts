export const getAuth = (accessToken: string) => {
  // Azure doesn't need a username, just a colon
  // Other providers, like GitHub just need ANY username, like foo
  const auth = Buffer.from(`document-that:${accessToken}`).toString('base64')
  return auth
}
