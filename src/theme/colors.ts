export const INFO = 'violet'
export const WARNING = 'orange'
export const SUCCESS = 'green'
export const ERROR = 'red'

export type Colors = {
  background: string
  foreground: string
  comment: string
  sidebar: {
    icons: string
  }
  button: {
    primary: string
    secondary: string
    danger: string
  }
  quote: string
  bold: string
  emphasis: string
  text: string
  heading: string
  code: string
  link: {
    body: string
    url: string
  }
}

export const defaultColors: Colors = {
  background: '#282a36',
  bold: '#ffb86c',
  button: {
    danger: '#ff5555',
    primary: '#bd93f9',
    secondary: '#ff79c6',
  },
  code: '#50fa7b',
  comment: '#6272a4',
  emphasis: '#8be9fd',
  foreground: '#44475a',
  heading: '#bd93f9',
  link: {
    body: '#ff79c6',
    url: '#8be9fd',
  },
  quote: '#f1fa8c',
  sidebar: {
    icons: '#ff79c6',
  },
  text: '#ffffff',
}
