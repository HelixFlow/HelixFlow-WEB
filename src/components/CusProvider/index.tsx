import { Button } from 'antd';
import { createContext, useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme as themeComp } from 'antd';

export const SystemContext = createContext({})

export default (props: any) => {
  // console.log(props);
  // console.log(theme)
  // const defaultTheme = localStorage.getItem('system_theme') as (String | undefined)
  // const [theme, setTheme] = useState<String>(defaultTheme || 'light')
  const [theme, setTheme] = useState<String>('light')
  const [types, setTypes] = useState({});
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [templates, setTemplates] = useState({});
  const [allNodes, setAllNodes] = useState([]);
  const [flows, setFlows] = useState({});
  const [flowData, setFlowData] = useState({});
  const [allBtns, setAllBtns] = useState({});

  const deleteNode = (idx: string) => {
    reactFlowInstance.setNodes(
      reactFlowInstance.getNodes().filter((n: any) => n.id !== idx)
    );
    reactFlowInstance.setEdges(
      reactFlowInstance
        .getEdges()
        .filter((ns: any) => ns.source !== idx && ns.target !== idx)
    );
  }

  useEffect(() => {
    let body = document.getElementsByTagName('body')[0];
    if (theme !== 'dark') {
      body.className = 'body-wrap-light'; // 切换自定义组件的主题
    } else {
      body.className = 'body-wrap-dark';
    }
  }, [theme])

  const SystemModel = useMemo(() => {

    return ({
      data: {
        theme
      },
      reactFlowInstance,
      types,
      templates,
      flows,
      flowData,
      allNodes,
      allBtns,
      setReactFlowInstance,
      setTypes,
      setFlowData,
      deleteNode,
      setTemplates,
      setAllNodes,
      setFlows,
      setAllBtns,
      changeTheme: (val: string) => {
        localStorage.setItem('system_theme', val)
        setTheme(val)
      }
    })
  }, [theme, types, templates, allNodes, flows, allBtns, reactFlowInstance,flowData])

  return <>
    <SystemContext.Provider
      value={SystemModel}
    >
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? themeComp.darkAlgorithm : themeComp.defaultAlgorithm,
          token: {
            // colorPrimary: '#ff8617',
            colorPrimary: '#1677ff',
          }
        }}
      >
        {props.children}
      </ConfigProvider>
    </SystemContext.Provider>
  </>
}
