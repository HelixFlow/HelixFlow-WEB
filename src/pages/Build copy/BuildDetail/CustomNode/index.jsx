import React, { useEffect, useState, useContext } from 'react'
import './index.less'
import Param from './param'
import NodeToolbar from '../NodeToolbar'
import { nodeColors, nodeIcons } from '@/constants'
import { SystemContext } from '@/components/CusProvider';


const Icon = ({ type }) => {
  let Icons = nodeIcons[type] || nodeIcons['unknown'];
  return <Icons />
}

export default ({ data, selected }) => {
  const { id, node, type, value } = data;
  const [_, fouceUpdateNode] = useState(false)
  const {
    types
  } = useContext(SystemContext)

  return (
    <div className={`flow_custom_node ${selected ? 'flow_custom_node_selected' : ''}`} style={{ backgroundColor: nodeColors[types[node.display_name] || 'unknown'] }}>
      {selected && <NodeToolbar nodeData={data} onChange={() => fouceUpdateNode(!_)} />}
      <div className="custom_node_title"><Icon type={types[type]} />{node.display_name}</div>
      <div className="custom_node_content">
        <div className="custom_node_desc">{node.description}</div>
        {
          Object.values(node?.template).filter(item => item.name).map((item, index) => (
            item.show && !item.advanced && <Param
              key={index}
              nodeData={data}
              paramData={item}
              onChange={() => fouceUpdateNode(!_)}
            />
          ))
        }
        <Param
          nodeData={data}
          paramData={{
            title:
              data.node.output_types && data.node.output_types.length > 0
                ? data.node.output_types.join("|")
                : data.type,
            id: [data.type, data.id, ...data.node.base_classes].join("|"),
            type: data.node.base_classes.join("|"),
            left: false,
          }}
        />
      </div>
    </div>
  )
}