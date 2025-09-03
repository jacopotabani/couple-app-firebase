import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'

const interFont = createInterFont()

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body: interFont,
    heading: interFont,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
  themes: {
    ...config.themes,
    // Custom couple app theme
    couple: {
      ...config.themes.light,
      background: '#fef7f0',
      backgroundHover: '#fef2e8',
      backgroundPress: '#feecd0',
      backgroundFocus: '#fee6c8',
      color: '#8b4513',
      colorHover: '#a0522d',
      colorPress: '#654321',
      colorFocus: '#8b4513',
      borderColor: '#deb887',
      borderColorHover: '#d2b48c',
      borderColorPress: '#cd853f',
      borderColorFocus: '#daa520',
    },
  },
})

export default tamaguiConfig
export type AppConfig = typeof tamaguiConfig