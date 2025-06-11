import React, { useEffect, useState, useMemo } from 'react'
import './index.less'
import { Input, Radio, Modal, Select } from 'antd'
import { getModelListForFlow } from '@/services/Model';

export default (props) => {
  const { value, size,onChange } = props;
  const [datasetList, setDatasetList] = useState([])
  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const Value = useMemo(() => {
    return value.model_name ? [value.model_name] : []
  }, [value])


  useEffect(() => {
    getModelListForFlow({
      model_type: 'LLM'
    }).then(res => {
      setDatasetList(res.data)
    })
  }, [])


  const onChangeValue = (model) => {
    if (model.length) {
      const data = datasetList.find(item => item.model === model[0]);
      if (data) {
        const { api_key, base_url } = data;
        onChange({
          model_name: model[0],
          openai_api_key: api_key,
          openai_api_base: base_url.replace(/\/chat\/completions$/, ''),
        })
      }
    } else {
      onChange({
        model_name: '',
        openai_api_key: '',
        openai_api_base: '',
      })
    }
  }

  return (
    <>
      <Select
        size={size}
        value={Value}
        mode='tags'
        maxCount={1}
        onChange={onChangeValue}
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