import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { SystemContext } from '@/components/CusProvider';
import './index.less'
import { toTitleCase, isValidConnection, groupByFamily } from '@/utils'
import NewInput from './input'
import { Input, Select } from 'antd'
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { Tooltip } from 'antd'

export default ({ nodeData, paramData, position, ...other }) => {
  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id
  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const {
    left = true,
    display_type,
    name = "",
    required = false,
    info = "",
    editable,
    value,
    reference,
  } = paramData;
  const {
    reactFlowInstance,
    flowData,
    setFlowData,
  } = useContext(SystemContext)


  const handleOnNewValue = useCallback((newValue,key = 'value') => {
    if(key == 'reference'){
      nodeData[position[0]][position[1]]['value'] = ''
    }
    if(key == 'name'){
      let oldName = nodeData.display_name + '/' + nodeData[position[0]][position[1]]['name'];
      let newName = nodeData.display_name + '/' + newValue;
      const { nodes } = flowData?.data;
      nodes.forEach((node)=>{
        const { input,output,params } = node.data;
        let data = [...(input || []), ...(output || []), ...(params || [])];
        data.forEach((item)=>{
          if(item.field_type !== 'condition'){
            if(item.reference && item.value == oldName){
              item.value = newName;
            }
          }else{
            if(item.value.reference == oldName){
              item.value.reference = newName;
            }
            if(item.value.compare_reference && item.value.compare_value == oldName){
              item.value.compare_value = newName;
            }
          }
        })
      })
    }
    nodeData[position[0]][position[1]][key] = newValue;
    // Set state to pending
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }, [nodeData, position]);

  return (
    <NewInput
      type={display_type}
      name={name}
      value={value}
      onChange={handleOnNewValue}
      data={paramData}
      nodeData={nodeData}
      editable={editable}
      {...other}
    />
  )
}