const { withTamagui } = require('@tamagui/next-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@couple-app/app',
    '@couple-app/database', 
    '@couple-app/firebase',
    '@couple-app/shared',
    '@couple-app/ui'
  ],
  experimental: {
    esmExternals: false,
  },
}

module.exports = withTamagui({
  config: '../../packages/ui/src/tamagui.config.ts',
  components: ['@tamagui/core', '@tamagui/animations-react-native'],
  importsWhitelist: ['constants.js', 'colors.js'],
  logTimings: true,
  disableExtraction: process.env.NODE_ENV === 'development',
  shouldExtract: (path) => {
    if (path.includes('node_modules/@tamagui/core')) {
      return true
    }
    if (path.includes('packages/ui')) {
      return true
    }
  },
  excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
})(nextConfig)