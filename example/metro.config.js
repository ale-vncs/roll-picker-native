/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')

const resolve = path.resolve(__dirname + '/../src')

const extraNodeModules = {
  'src': resolve
};
const watchFolders = [
  resolve
];

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders,
  resolver: {
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) =>
          //redirects dependencies referenced from common/ to local node_modules
          name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },
};
