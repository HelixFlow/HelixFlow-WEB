import React, { useEffect, useState, useMemo, useContext } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { Tooltip } from 'antd'
import { nodeColors, nodeNames } from '@/constants'
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

export default ({ nodeData, paramData }) => {
  const { left, type, title, id } = paramData;

  return (
    <span className='handler_btn'>
      <Handle
        type={left ? "target" : "source"}
        position={left ? Position.Left : Position.Right}
        id={id}
        className={`flow_handler flow_handler_${left ? 'target' : 'source'}`}
      ></Handle>
    </span>
  )
}