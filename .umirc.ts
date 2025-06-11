import { defineConfig } from "umi";
import Routes from "./config/route";
let setting: any = {};

try {
  setting = require("./setting.ts");
  console.log("Loaded setting.ts successfully:", setting);
} catch (error) {
  console.error("Error loading setting.ts:", error);
  setting = {};
}

// console.log('获取环境变量', process.env);
export default defineConfig({
  routes: Routes,
  proxy: {
    "/helixflow": {
      target: setting?.proxyAddress || "http://localhost:11110",
      changeOrigin: true,
      secure: false,
      // pathRewrite: {
      //   "": "/",
      // },
    },
  },
  npmClient: "yarn",
  plugins: [
    "@umijs/plugins/dist/initial-state",
    "@umijs/plugins/dist/model",
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/layout",
  ],
  layout: {},
  initialState: {},
  model: {},
  request: {},
  history: { type: "hash" },
  esbuildMinifyIIFE: true,
  historyWithQuery: {},
  chainWebpack(config) {
    const loaderPath = require.resolve("./src/loaders/mdLoader.js");
    // 为 .md 文件添加正确的 loader
    config.module
      .rule("markdown")
      .test(/\.md$/)
      .type("javascript/auto")
      .use("markdown-loader")
      .loader(loaderPath);
  },
});
