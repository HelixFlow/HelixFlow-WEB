export default [
  {
    path: "/login",
    // component: "@/pages/Login",
    component: "@/pages/Login",
    name: "登录",
    hideInMenu: true,
    menuRender: false,
    headerRender: false,
    layout: false,
  },
  {
    path: "/",
    redirect: "/buildApp",
    wrappers: ['@/wrappers/auth'],
  },
  {
    path: "/*",
    redirect: "/buildApp",
    wrappers: ['@/wrappers/auth'],
  },
  {
    path: "/buildApp",
    name: "Agent开发",
    component: "@/pages/Build",
  },
  {
    path: "/buildApp/buildDetail",
    name: "构建应用详情",
    hideInMenu: true,
    component: "@/pages/Build/BuildDetail",
    layout: false,
  },
  {
    name: '404',
    path: '/404',
    component: './404',
    hideInMenu: true,
  },
]