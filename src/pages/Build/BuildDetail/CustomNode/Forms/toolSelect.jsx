import React, { useEffect, useState, useContext, useMemo } from 'react'
import './index.less'
import { Input, Radio, Modal, Select } from 'antd'
import { getModelListForFlow } from '@/services/Model';
import { SystemContext } from '@/components/CusProvider';
import { getApiLink } from '@/services/Tool';

export default (props) => {
  const { value, size, nodeData } = props;
  const [toolList, setToolList] = useState([])
  const {
    setFlowData
  } = useContext(SystemContext)
  const [showSelectOptions, setShowSelectOptions] = useState(false)


  useEffect(() => {
    getApiLink().then(res => {
      let list = []
      res.data.forEach(item => {
        const { tool_str, typ, name } = item;
        if (typ == 'api') {
          const toolList = JSON.parse(tool_str);
          toolList.forEach(tool => {
            const { operation_id, parameters, server_url, method } = tool;
            list.push({
              label: name + '/' + operation_id,
              value: name + '/' + operation_id,
              server_url,
              method,
              template: parameters.reduce((init, item) => {
                init.push( {
                  "field_type": "str",
                  "required": true,
                  "show": true,
                  "value": null,
                  "name": item.name,
                  "display_name": item.name,
                  "display_type": "text",
                  "description": "",
                  "editable": true,
                  "reference": false,
                  isExtra: true,
                })
                return init;
              }, []),
            })
          })
        }
      })
      setToolList(list)
    })
  }, [])


  const onChange = (option) => {
    const data = toolList.find(item => item.value === option);
    const { template, server_url, method } = data;
    let oldTemplate = [ ...nodeData.input ].filter(item => !item.isExtra);
    let linkIndex = nodeData.params?.findIndex(item => item.name === 'links');
    nodeData.input = [
      ...oldTemplate,
      ...template
    ]
    nodeData.params[linkIndex].value = {
      server_url,
      method,
      tool_name: option,
    };

    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }

  return (
    <>
      <Select
        size={size}
        value={value.tool_name}
        onChange={onChange}
        onSelect={() => setShowSelectOptions(false)}
        onBlur={() => setShowSelectOptions(false)}
        onFocus={() => setShowSelectOptions(true)}
        open={showSelectOptions}
        options={toolList}
      />
    </>
  )
}