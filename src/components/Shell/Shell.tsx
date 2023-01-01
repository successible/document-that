import {
  Box,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { Toaster } from 'react-hot-toast'
import { useImmer } from 'use-immer'
import { useMounted } from '../../hooks/useMounted'
import { useStore } from '../../store/store'
import { BottomBar } from './BottomBar'
import { TopBar } from './TopBar/TopBar'

type props = { children: React.ReactNode }
export const Shell: React.FC<props> = ({ children }) => {
  const accessToken = useStore((state) => state.accessToken)
  const colors = useStore((state) => state.colors)
  const { mounted } = useMounted()
  const preferredColorScheme = useColorScheme()

  const [colorScheme, setColorScheme] =
    useImmer<ColorScheme>(preferredColorScheme)

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={(value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
      }
    >
      <MantineProvider
        theme={{
          colors: {
            dark: [
              colors.text, // The default color for text
              // https://mantine.dev/theming/dark-theme/
              // We keep the default for every other input
              '#A6A7AB',
              '#909296',
              '#5C5F66',
              '#373A40',
              '#2C2E33',
              '#25262B',
              '#1A1B1E',
              '#141517',
              '#101113',
            ],
          },
          colorScheme: 'dark',
          components: {
            Button: {
              styles: {
                root: {
                  outlineColor: `${colors.outline} !important`,
                },
              },
            },
            Select: {
              styles: {
                input: {
                  '&:focus': {
                    borderColor: `${colors.outline} !important`,
                  },
                },
              },
            },
            UnstyledButton: {
              styles: {
                root: {
                  outlineColor: `${colors.outline} !important`,
                },
              },
            },
          },
          fontSizes: {
            sm: 16,
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Box
          sx={{
            backgroundColor: colors.background,
            height: '100%',
            width: '100%',
          }}
        >
          <TopBar />
          {children}
          {/* Only show the footer when not logged in */}
          {mounted && accessToken == '' && <BottomBar />}
        </Box>
        <Toaster
          toastOptions={{
            position: 'top-right',
            style: {
              background: colors.foreground,
              color: colors.text,
            },
          }}
        />
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
