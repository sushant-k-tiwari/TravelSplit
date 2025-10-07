// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;

// Get Expo's default Metro config
const config = getDefaultConfig(projectRoot);

// Pass the config through NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
