export const INFO = 'violet'
export const WARNING = 'orange'
export const SUCCESS = 'green'
export const ERROR = 'red'

export type Colors = {
  background: string
  bold: string
  button: {
    accent: string
    danger: string
    primary: string
    secondary: string
    success: string
    neutral: string
  }
  code: string
  comment: string
  divider: string
  emphasis: string
  foreground: string
  accent: string
  heading: string
  highlight: string
  link: {
    body: string
    url: string
  }
  outline: string
  quote: string
  sidebar: {
    icons: string
  }
  text: string
}

export const defaultColors: Colors = {
  accent: '#6272a4',
  background: '#282a36',
  bold: '#ffb86c',
  button: {
    accent: '#6272a4',
    danger: '#ff5555',
    neutral: '#44475a',
    primary: '#bd93f9',
    secondary: '#ff79c6',
    success: '#3dc9b0',
  },
  code: '#50fa7b',
  comment: '#6272a4',
  divider: '#6272a4',
  emphasis: '#8be9fd',
  foreground: '#44475a',
  heading: '#bd93f9',
  highlight: '#44475a',
  link: {
    body: '#ff79c6',
    url: '#8be9fd',
  },
  outline: '#4c8bf5',
  quote: '#f1fa8c',
  sidebar: {
    icons: '#ff79c6',
  },
  text: '#ffffff',
}
