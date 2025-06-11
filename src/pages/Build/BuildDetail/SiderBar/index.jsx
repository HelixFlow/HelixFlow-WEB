import React, { useEffect, useState, useContext } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { nodeNames, nodeIcons, nodeColors2 } from '@/constants'
import { ReactComponent as RightIcon } from "@/assets/right.svg";
import { ReactComponent as PluginIcon } from "@/assets/plugins.svg";
import { Popover } from 'antd'


const Icon = ({ type, fill }) => {
  let Icons = nodeIcons[type] || nodeIcons['unknown'];
  return <Icons fill={fill} />
}

export default (props) => {
  const {
    allNodes,
  } = useContext(SystemContext)

  const onDrag = (e, data) => {
    e.dataTransfer.setData('nodeData', JSON.stringify(data))
  }

  const nodes = [
    {
      "name": "plugin",
    },
    {
      "name": "llm",
    },
    {
      "name": "code",
    },
    {
      "name": "knowledge",
    },
    {
      "name": "workflow",
    },
    {
      "name": "condition",
    },
    {
      "name": "intentRecognition",
    },
    {
      "name": "textProcessing",
    },
    {
      "name": "message",
    },
    {
      "name": "question",
    },
    {
      "name": "variable",
    },
    {
      "name": "database",
    },
  ]

  return (
    <div className='sider'>
      {
        allNodes.map(type => (
          <div className="types" key={type.name} draggable onDragStart={(e) => onDrag(e, type)}>
            <div className="left"><Icon type={type.name} fill={(nodeColors2[type.name] || nodeColors2['unknown']).replace('opacity', '1')} /></div>
            <div className="center">
              <div className="name_ch">{type.name}</div>
              <div className="name_en textEllipsis">{type.description}</div>
            </div>
            <div className="right"><RightIcon /></div>
          </div>
        ))
      }
    </div>
  )
}