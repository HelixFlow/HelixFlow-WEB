import { defineConfig } from "umi";
import Routes from "./config/route";
const fs = require("fs");
const path = require("path");

const settingPath = path.resolve(__dirname, "setting.ts");
let setting: any = {};

if (fs.existsSync(settingPath)) {
  try {
    setting = require("./setting.ts");
  } catch (error: any) {
    if (error?.code !== "MODULE_NOT_FOUND") {
      console.warn("Failed to load optional setting.ts, falling back to defaults:", error);
    }
    setting = {};
  }
}

const proxyAddress = setting?.proxyAddress || process.env.PROXY_ADDRESS || "http://localhost:11110";

// console.log('获取环境变量', process.env);
export default defineConfig({
  routes: Routes,
  proxy: {
    "/helixflow": {
      target: proxyAddress,
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
