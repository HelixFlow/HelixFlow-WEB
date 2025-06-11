import type { RequestConfig, RunTimeLayoutConfig } from "umi";
import { history } from "umi";
import React from "react";
import { message } from "antd";
import { QuestionCircleFilled } from '@ant-design/icons';
import RightContent from '@/components/RightContent';
import CusProvider from '@/components/CusProvider';
import LogoWhite from '@/assets/logo.png';
import { CookieUse } from '@/utils';
// const { getCookie, setCookie } = CookieUse();

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  console.log("getInitialState");
  try {
    let data: any = JSON.parse(localStorage.getItem("userData") || '{}');
    return {
      user: data,
    };
  } catch (error) {
    return {
      user: null,
    };
  }
}

// export async function render(oldRender: any) {
//   console.log('render');
//   let hash = window.location.hash;
//   // if (getCookie('login_token_cookie') && !['login', 'register'].filter(item => hash.indexOf(item) > -1).length) {
//   if (!['login', 'register'].filter(item => hash.indexOf(item) > -1).length) {
//     // const res = await getUserResource('root');
//     // const resource = res.result || {};
//     // localStorage.setItem('helixflowTabData', JSON.stringify(resource?.menu?.map((item: any) => '/' + item.resource_key) || []));
//     oldRender();
//   } else {
//     if (!['login', 'register'].filter(item => hash.indexOf(item) > -1).length) {
//       history.push('/login');
//     }
//     oldRender();
//   }
// }

const loopMenuItem = (menus: any) => {
  return menus.map((item: any) => {
    const { iconKey, path, name } = item;
    // item.icon = iconKey && getIcon(iconKey, path)
    if (iconKey) {
      item.name = <QuestionCircleFilled />
    }
    return item;
  })
};

//页面布局
export const layout = (initialData: any) => {
  console.log("layout", initialData);
  const { initialState } = initialData;
  return {
    menuDataRender: (data: any) => (loopMenuItem(data)),
    rightContentRender: () => <RightContent initialState={initialState} />,
    menu: {
      locale: false,
    },
    title: '',
    logo: LogoWhite,
    layout: "top",
    splitMenus: true,
    fixSiderbar: true,
    siderWidth: 230,
  };
};


//统一拦截
export const request: RequestConfig = {
  // timeout: 100,
  // other axios options you want
  // validateStatus: (status) => { return status >= 200 && status < 500 },
  errorConfig: {
    errorHandler(err: any) {
      if (err.response?.data?.detail) {
        message.error(err.response?.data?.detail);
      }
    },
    errorThrower() { },
  },
  requestInterceptors: [
    (url: any, options: any) => {
      return {
        url, options: {
          ...options,
          // validateStatus: (status) => {
          //   return status >= 200 && status < 500
          // },
        }
      };
    },
  ],
  responseInterceptors: [
    [
      (response: any) => {
        if (response.data?.code && response.data?.code !== 200) {
          if (response.data?.code == 401) {
            setTimeout(() => {
              history.push('/login');
            }, 300);
            return response;
          }
          if (response.data?.code == 201) {
            return response;
          }
          message.error(response.data?.msg || response.msg);
          return Promise.resolve(response);
        } else {
          return response;
        }
      },
      (error: any): any => {
        return Promise.reject(error);
      },
    ],
  ],
};


export function rootContainer(container: any) {
  return React.createElement(CusProvider, null, container);
}

