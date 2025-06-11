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
    types,
    templates,
    setFlows,
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

  useEffect(() => {
    // console.log(edges)
    if (reactFlowInstance && flow) {
      flow.data = reactFlowInstance.toObject();
      setFlows((prev) => {
        return {
          ...prev,
          [appId]: flow
        }
      });
    }
  }, [nodes, edges]);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      if (isValidConnection(newConnection, reactFlowInstance)) {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      }
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
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: "var(--baseTitleFont)" },
            className:
              (params.targetHandle.split("|")[0] === "Text"
                ? "stroke-foreground "
                : "stroke-foreground ") + " stroke-connection",
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
    let { type } = data;
    let newId = type + '-' + uid.rnd();
    let newNode = {
      id: newId,
      type: "genericNode",
      position,
      data: {
        ...data,
        id: newId,
        value: null,
      },
    };
    setNodes((nds) => nds.concat(newNode));
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
        <TestHistory checkFlow={checkFlow} onSave={onSave} />
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
          icon={<RocketFilled style={{ color: 'var(--primaryColor)' }} />}
        />
        <SiderBar />
        {
          Object.keys(templates).length > 0 && Object.keys(types).length > 0 &&
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
          >
            <Controls className='flow-control' showInteractive={false}></Controls>
          </ReactFlow>}
      </div>
    </div>
  )
}