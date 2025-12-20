const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

config.resolver.unstable_enablePackageExports = true;

// Add support for .native.ts files (prioritize over .ts)
config.resolver.sourceExts = ['native.ts', 'native.tsx', 'native.js', 'native.jsx', ...config.resolver.sourceExts, 'svg'];

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// Exclude native-only modules from web/server bundles
const nativeOnlyModules = [
  '@stripe/stripe-react-native',
  '@stripe/stripe-identity-react-native',
  'react-native-maps',
  'react-native-safe-area-context',
];

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Return empty module for native-only packages when bundling for web
  if (platform === 'web') {
    const isNativeOnly = nativeOnlyModules.some(
      mod => moduleName === mod || moduleName.startsWith(`${mod}/`)
    );
    if (isNativeOnly) {
      return { type: 'empty' };
    }
  }

  // Use default resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './globals.css' })