import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { isValidConnection, validateNodes } from '@/utils';
import CustomNode from '../CustomNode'
import SiderBar from '../SiderBar'
import { history } from 'umi';
import { ReactComponent as Back } from '@/assets/back.svg'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button, FloatButton, notification, message } from 'antd'
import { SaveOutlined, RocketFilled } from '@ant-design/icons'
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 5 });
import { createAndEditFlow } from '@/services/Flow';
import TestHistory from './testHistory'


const nodeTypes = {
  genericNode: CustomNode,
};


export default ({ flow }) => {
  const {
    reactFlowInstance,
    setReactFlowInstance,
    setFlowData,
  } = useContext(SystemContext)

  const [nodes, setNodes, onNodesChange] = useNodesState(
    flow.data?.nodes ?? []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flow.data?.edges ?? []
  );

  const edgeUpdateSuccessful = useRef(true);
  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id

  useEffect(() => {
    return () => {
      setReactFlowInstance(null) // 销毁reactflow实例
    }
  }, [])

  // useEffect(() => {
  //   console.log(flow)
  // }, [flow]);

  useEffect(() => {
    if (reactFlowInstance && flow) {
      flow.data = reactFlowInstance.toObject();
      setFlowData({...flow});
    }
  }, [nodes, edges]);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [reactFlowInstance, setEdges]
  );

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onConnect = useCallback(
    (params) => {
      console.log(params)
      const {source , target} = params;
      if(source.indexOf('if_condition') > -1 && target.indexOf('if_condition') > -1){
        notification.error({message: '条件节点不能连接条件节点', placement: 'bottomRight',})
        return;
      }
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: "var(--baseTitleFont)" },
            className: "stroke-foreground  stroke-connection",
            id: `${params.source}-${params.target}`,
            // type: 'smoothstep',
            animated: true // params.targetHandle.split("|")[0] === "Text",
          },
          eds
        )
      );
    },
    [setEdges, setNodes]
  );

  const onDrop = (e) => {
    // console.log('drop:', e)
    // console.log(e.dataTransfer.getData("nodeData"))
    const position = reactFlowInstance.project({
      x: e.clientX - 294,
      y: e.clientY - 88,
    });
    let data = JSON.parse(e.dataTransfer.getData("nodeData"));
    let { name } = data;
    let kinds = nodes.filter(item => item.id.indexOf(name) > -1).map(item => item.id.split('_')[item.id.split('_').length-1]);
    let newId = `${name}_${getMinNum(kinds)}`;
    if(name == 'start'){
      if(kinds.length){
        notification.error({message: '开始节点只能有一个', placement: 'bottomRight',})
        return;
      }
      newId = 'start';
    }
    if(name == 'end'){
      if(kinds.length){
        notification.error({message: '结束节点只能有一个', placement: 'bottomRight',})
        return;
      }
      newId = 'end';
    }


    let newNode = {
      id: newId,
      type: "genericNode",
      position,
      data: {
        ...data,
        display_name: newId,
        value: null,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }

  const getMinNum = (arr) => {
    let num = 1;
    let max = arr.length;
    for (let i = 0; i < max; i++) {
      if (arr.find(item=>item == num)) {
        num++;
      }
    }
    return num;
  }


  const onBack = () => {
    history.back();
  }

  const checkFlow = (func) => {
    const errors = validateNodes(reactFlowInstance);
    // console.log(errors)
    if (errors.length) {
      notification.error({
        placement: 'bottomRight',
        description: <>
          {
            errors.map(item => <p key={item}>{item}</p>)
          }
        </>
      })
    } else {
      if (func) {
        func()
      } else {
        notification.success({ message: '流程校验通过 ', placement: 'bottomRight', })
      }
    }
  }

  const onSave = (func) => {
    createAndEditFlow(flow).then(res => {
      if (func) {
        func()
      } else {
        message.success('保存成功')
      }
    })
  }

  return (
    <div className='flowPage'>
      <div className="flowPage_header">
        <Back className='hoverIcon back' onClick={onBack} />
        <div className="app_name">{flow.name}</div>
        <TestHistory disabled={flow.status == '2'} checkFlow={checkFlow} onSave={onSave} />
        <Button type='primary' disabled={flow.status == '2'} onClick={() => onSave()} icon={<SaveOutlined />}>保存</Button>
      </div>
      <div className="mainContent">
        <FloatButton
          onClick={() => checkFlow()}
          shape="square"
          style={{
            top: 92,
            bottom: 'auto',
            right: 24,

          }}
          tooltip="流程校验"
          icon={<RocketFilled style={{ color: 'var(--primaryColor)' }} />}
        />
        <SiderBar />
        {
          <ReactFlow
            deleteKeyCode={null}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            minZoom={0.01}
            maxZoom={8}
            fitView
            proOptions={{
              hideAttribution: true,
            }}
            fitViewOptions={{
              includeHiddenNodes: true,
              includeHiddenEdges: true,
              maxZoom: 1,
              minZoom: 0.4,
            }}
          >
            <Controls className='flow-control' showInteractive={false}></Controls>
          </ReactFlow>}
      </div>
    </div>
  )
}