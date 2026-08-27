// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Añadir 'txt' a la lista de extensiones de assets soportadas
config.resolver.assetExts.push("txt");

module.exports = config;
