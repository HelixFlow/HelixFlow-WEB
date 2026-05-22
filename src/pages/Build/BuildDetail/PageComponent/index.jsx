import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { getUrlParam, isValidConnection, validateNodes } from '@/utils';
import CustomNode from '../CustomNode'
import SiderBar from '../SiderBar'
import { history } from 'umi';
import { ReactComponent as Back } from '@/assets/back.svg'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  MarkerType,
  updateEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button, FloatButton, notification, message, Tag } from 'antd'
import { BranchesOutlined, CodeOutlined, DatabaseOutlined, NodeIndexOutlined, SaveOutlined, RocketFilled } from '@ant-design/icons'
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 5 });
import { createAndEditFlow } from '@/services/Flow';
import TestHistory from './testHistory'


const nodeTypes = {
  genericNode: CustomNode,
};

const directedEdgeDefaults = {
  animated: true,
  className: "stroke-foreground stroke-connection",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: "var(--baseTitleFont)",
  },
  style: {
    stroke: "var(--baseTitleFont)",
    strokeWidth: 1.6,
  },
};

const withDirectionalEdge = (edge) => ({
  ...directedEdgeDefaults,
  ...edge,
  markerEnd: edge.markerEnd || directedEdgeDefaults.markerEnd,
  style: {
    ...directedEdgeDefaults.style,
    ...(edge.style || {}),
  },
  className: edge.className || directedEdgeDefaults.className,
});

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
    (flow.data?.edges ?? []).map(withDirectionalEdge)
  );

  const edgeUpdateSuccessful = useRef(true);
  const appId = getUrlParam("id"); //id
  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);
  const selectedNodeData = selectedNode?.data || {};
  const flowStatusText = flow.status == 2 ? '已启用' : '草稿';
  const flowStatusColor = flow.status == 2 ? 'success' : 'default';

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
      setEdges((els) => updateEdge(oldEdge, withDirectionalEdge(newConnection), els));
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
          withDirectionalEdge({
            ...params,
            id: `${params.source}-${params.target}`,
            // type: 'smoothstep',
          }),
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
        <div className="app_identity">
          <div className="app_name">{flow.name}</div>
          <div className="app_subtitle">Agent workflow orchestration / drag, configure, validate, run</div>
        </div>
        <div className="flowHeaderMeta">
          <Tag color={flowStatusColor}>{flowStatusText}</Tag>
          <Tag>{nodes.length} nodes</Tag>
          <Tag>{edges.length} links</Tag>
        </div>
        <TestHistory disabled={flow.status == 2} checkFlow={checkFlow} onSave={onSave} />
        <Button type='primary' disabled={flow.status == 2} onClick={() => onSave()} icon={<SaveOutlined />}>保存</Button>
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
        <section className="workflowCanvasShell">
          <div className="canvasTopbar">
            <div>
              <div className="canvasTitle">Workflow Canvas</div>
              <div className="canvasHint">拖拽左侧算子到画布，连接节点后执行校验与试运行。</div>
            </div>
            <div className="canvasStats">
              <span><NodeIndexOutlined /> {nodes.length} 节点</span>
              <span><BranchesOutlined /> {edges.length} 连线</span>
              <span><CodeOutlined /> {flow.status == 2 ? '只读详情' : '可编辑'}</span>
            </div>
          </div>
          <div className="workflowCanvasBody">
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
              defaultEdgeOptions={directedEdgeDefaults}
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
              <Background color="#cbd5e1" gap={22} size={1} />
              <Controls className='flow-control' showInteractive={false}></Controls>
            </ReactFlow>
          </div>
          <div className="canvasBottombar">
            <span>Drop zone active</span>
            <span>Edge validation: enabled</span>
            <span>Checkpoint run: memory saver</span>
          </div>
        </section>
        <aside className="workflowInspector">
          <div className="inspectorHeader">
            <div>
              <div className="inspectorTitle">Inspector</div>
              <div className="inspectorHint">节点、参数和运行上下文</div>
            </div>
            <Tag color={selectedNode ? 'processing' : 'default'}>{selectedNode ? 'Selected' : 'Canvas'}</Tag>
          </div>
          <div className="inspectorCard selectedNodeCard">
            <div className="inspectorCardTitle">当前对象</div>
            {selectedNode ? (
              <>
                <div className="selectedNodeName">{selectedNodeData.display_name}</div>
                <div className="selectedNodeType">{selectedNodeData.name}</div>
                <p>{selectedNodeData.description || '暂无描述'}</p>
              </>
            ) : (
              <>
                <div className="selectedNodeName">未选择节点</div>
                <p>点击画布中的节点后，这里会显示节点类型、输入输出和参数概览。</p>
              </>
            )}
          </div>
          <div className="inspectorGrid">
            <div className="inspectorMetric">
              <span>Inputs</span>
              <strong>{selectedNodeData.input?.length || 0}</strong>
            </div>
            <div className="inspectorMetric">
              <span>Params</span>
              <strong>{selectedNodeData.params?.length || 0}</strong>
            </div>
            <div className="inspectorMetric">
              <span>Outputs</span>
              <strong>{selectedNodeData.output?.length || 0}</strong>
            </div>
            <div className="inspectorMetric">
              <span>Links</span>
              <strong>{edges.length}</strong>
            </div>
          </div>
          <div className="inspectorCard">
            <div className="inspectorCardTitle"><DatabaseOutlined /> Runtime Settings</div>
            <div className="inspectorList">
              <span>Run mode <b>checkpoint</b></span>
              <span>Pause patch <b>enabled</b></span>
              <span>Secret masking <b>enabled</b></span>
              <span>FlinkSQL handoff <b>available</b></span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
