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
    flows,
    setFlows
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
                init[item.name] = {
                  show: true,
                  advanced: false,
                  name: item.name,
                  type: 'str',
                  isExtra: true,
                }
                return init;
              }, {}),
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
    let newTemplate = { ...nodeData.node.template };
    let oldTemplate = Object.entries(newTemplate).reduce((init, [key, value]) => {
      if (!value.isExtra) {
        init[key] = value;
      }
      return init;
    }, {});
    nodeData.node.template = {
      ...oldTemplate,
      ...template
    }
    nodeData.node.template.server_url.value = server_url;
    nodeData.node.template.tool_name.value = option;
    nodeData.node.template.method.value = method;

    setFlows((prev) => {
      return {
        ...prev,
      };
    });
  }

  return (
    <>
      <Select
        size={size}
        value={value}
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