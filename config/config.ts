import { defineConfig } from 'umi';
import routes from './route';

const path = require('path');
const iconsLibDir = path.dirname(require.resolve('@ant-design/icons/lib/index.js'));
const iconsSvgLibDir = path.dirname(require.resolve('@ant-design/icons-svg/lib/index.js'));

export default defineConfig({
  routes,
  mfsu: false,
  polyfill: { imports: [] },
  layout: {},
  alias: {
    '@ant-design/icons$': require.resolve('@ant-design/icons/lib/index.js'),
    '@ant-design/icons/es': iconsLibDir,
    '@ant-design/icons-svg/es': iconsSvgLibDir,
  },
  plugins: [
    '@umijs/plugins/dist/request',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/layout',
  ],
  request: {},
  model: {},
  initialState: {},
  proxy: {
    '/helixflow': {
      target: 'http://127.0.0.1:11110',
      changeOrigin: true,
    },
  },
});
