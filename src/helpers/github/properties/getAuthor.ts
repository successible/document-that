import { User } from '../../../pages'

export const getAuthor = (user: User) => ({
  email: undefined,
  name: user.login || '',
})
