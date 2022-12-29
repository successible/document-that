export const INFO = 'violet'
export const WARNING = 'orange'
export const SUCCESS = 'green'
export const ERROR = 'red'

export type Colors = {
  background: string
  bold: string
  button: {
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
  heading: string
  link: {
    body: string
    url: string
  }
  quote: string
  sidebar: {
    icons: string
  }
  text: string
}

export const defaultColors: Colors = {
  background: '#282a36',
  bold: '#ffb86c',
  button: {
    danger: '#ff5555',
    neutral: '#343a40',
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
