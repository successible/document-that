import { addHover } from './addHover'

export const styleButton = (color: string) => ({
  backgroundColor: `${color}`,
  ...addHover(color),
})
