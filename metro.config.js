const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Enable SVG support
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// Ensure .svg is not treated as asset
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

// (Optional) Add any missing custom extensions directly
config.resolver.assetExts.push("glb", "gltf", "png", "jpg");
config.resolver.sourceExts.push("cjs", "mjs", "ts", "tsx", "js", "jsx");

module.exports = config;
