import React, { useEffect, useState, useContext } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { nodeNames, nodeIcons } from '@/constants'
import { ReactComponent as RightIcon } from "@/assets/right.svg";
import { ReactComponent as PluginIcon } from "@/assets/plugins.svg";
import { Popover } from 'antd'


const Icon = ({ type }) => {
  let Icons = nodeIcons[type] || nodeIcons['unknown'];
  return <Icons />
}

export default (props) => {
  const {
    reactFlowInstance,
    setReactFlowInstance,
    types,
    templates,
    allNodes,
    deleteNode,
  } = useContext(SystemContext)

  const onDrag = (e, data) => {
    e.dataTransfer.setData('nodeData', JSON.stringify(data))
  }

  return (
    <div className='sider'>
      {
        Object.keys(allNodes).sort().map(type => (
          Object.keys(allNodes[type]).length ? <Popover
            key={type}
            overlayClassName='sider_types_popover'
            placement="right"
            arrow={false}
            content={<div className='sider_types_popover_plugins'>
              {
                Object.keys(allNodes[type]).map(plugin => (
                  <div className="plugin" key={plugin} draggable onDragStart={(e) => onDrag(e, { type: plugin, node: allNodes[type][plugin] })}>
                    <PluginIcon />
                    {plugin}
                  </div>
                ))
              }
            </div>}
          >
            <div className="types">
              <div className="left"><Icon type={type} /></div>
              <div className="name_ch">{(nodeNames[type] || nodeNames['unknown'])?.split('/')[0]}</div>
              <div className="name_en textEllipsis">{(nodeNames[type] || nodeNames['unknown'])?.split('/')[1]}</div>
              <div className="right"><RightIcon /></div>
            </div>
          </Popover> : ''
        ))
      }
    </div>
  )
}