const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

config.resolver.unstable_enablePackageExports = true;

// Add support for .native.ts files (prioritize over .ts)
config.resolver.sourceExts = ['native.ts', 'native.tsx', 'native.js', 'native.jsx', ...config.resolver.sourceExts, 'svg'];

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

module.exports = withNativeWind(config, { input: './globals.css' })