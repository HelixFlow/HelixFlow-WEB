import React, { useEffect, useState, useContext, useMemo } from 'react'
import './index.less'
import { Input, Radio, Modal, Select } from 'antd'
import { getModelListForFlow } from '@/services/Model';
import { SystemContext } from '@/components/CusProvider';

export default (props) => {
  const { value, size, nodeData } = props;
  const [datasetList, setDatasetList] = useState([])
  const {
    flows,
    setFlows
  } = useContext(SystemContext)
  const [showSelectOptions, setShowSelectOptions] = useState(false)


  useEffect(() => {
    getModelListForFlow({
      model_type: 'LLM'
    }).then(res => {
      setDatasetList(res.data)
    })
  }, [])


  const onChange = (model) => {
    const data = datasetList.find(item => item.model === model);
    const { api_key, base_url } = data;
    nodeData.node.template.model_name.value = model;
    nodeData.node.template.openai_api_key.value = api_key;
    nodeData.node.template.openai_api_base.value = base_url.replace(/\/chat\/completions$/, '');
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
        options={datasetList.reduce((init, curr) => {
          init.push({
            ...curr,
            label: curr.model,
            value: curr.model,
          })
          return init;
        }, [])}
      />
    </>
  )
}