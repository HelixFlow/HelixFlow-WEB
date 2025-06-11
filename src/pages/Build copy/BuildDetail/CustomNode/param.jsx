import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { SystemContext } from '@/components/CusProvider';
import './index.less'
import { toTitleCase, isValidConnection, groupByFamily } from '@/utils'
import Input from './input'
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { nodeColors, nodeNames } from '@/constants'
import { Tooltip } from 'antd'

export default ({ nodeData, paramData, onChange }) => {
  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id
  const {
    left = true,
    // data,
    // tooltipTitle,
    // color,
    type,
    name = "",
    required = false,
    info = "",
    value,
  } = paramData;
  const id = paramData.id || ((paramData.input_types?.join(";") ?? paramData.type) + "|" + paramData.name + "|" + nodeData.id);
  const title = paramData.title || toTitleCase(name);
  const tooltipTitle = left ? (paramData.input_types?.join("\n") ?? paramData.type) : nodeData.node.base_classes.join(",")
  const optionalHandle = paramData.input_types || null;
  const {
    types,
    setFlows,
    reactFlowInstance,
    allNodes,
  } = useContext(SystemContext)

  const toolTipHtml = useMemo(() => {
    if (left) {
      const groupedObj = groupByFamily(allNodes, tooltipTitle, left, type);
      return Object.values(groupedObj).map(item => nodeNames[item.family] + (item.type ? ('-' + item.type) : ''))
    } else {
      return [nodeNames[types[nodeData.type]] + '-' + tooltipTitle]
    }
  }, [left, tooltipTitle, allNodes])

  const fieldColor = useMemo(() => {
    if (left) {
      return nodeColors[types[paramData.type]] || nodeColors[paramData.type] || nodeColors['unknown']
    } else {
      return nodeColors[types[nodeData.type]] || nodeColors['unknown']
    }
  }, [left, tooltipTitle, allNodes])


  const handleOnNewValue = useCallback((newValue) => {
    // console.log(newValue)
    nodeData.node.template[name].value = ['float', 'int'].includes(type) ? Number(newValue) : newValue;
    // Set state to pending
    setFlows((prev) => {
      return {
        ...prev,
      };
    });
  }, [appId, nodeData]);

  return (
    <div className={`custom_node_field ${["str", "bool", "float", "code", "prompt", "file", "int"].includes(type) && !optionalHandle ? '' : left ? 'custom_node_field_handler' : 'custom_node_field_handler_right'}`}>
      <div className={`custom_node_field_name`}>{title}{required ? <span className='requireText'>*</span> : ''}</div>
      {left && ["str", "bool", "float", "code", "prompt", "file", "int"].includes(type) && (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={handleOnNewValue}
          data={paramData}
          nodeData={nodeData}
        />
      )}
      {left && ["str", "bool", "float", "code", "prompt", "file", "int"].includes(type) && !optionalHandle ? ('') : (
        <span className='handler_btn'>
          <Tooltip
            color='white'
            placement={left ? 'left' : 'right'}
            overlayInnerStyle={{
              whiteSpace: 'pre-wrap',
              color: '#141414'
            }}
            title={toolTipHtml.join('\n')}>
            <Handle
              type={left ? "target" : "source"}
              position={left ? Position.Left : Position.Right}
              id={id}
              isValidConnection={(connection) =>
                isValidConnection(connection, reactFlowInstance)
              }
              className={`flow_handler flow_handler_${left ? 'target' : 'source'}`}
              style={{
                backgroundColor: fieldColor,
              }}
            ></Handle>
          </Tooltip>
        </span>
      )
      }
    </div >
  )
}