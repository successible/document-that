import Color from 'color'

export const addHover = (color: string) => ({
  '&:hover, &:focus, &:active': {
    backgroundColor: `${Color(color).darken(0.1).string()}`,
  },
})
