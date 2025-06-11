import React, { useEffect, useState,useContext, useMemo } from 'react'
import './index.less'
import { Select, Input,Cascader } from 'antd'
import { SystemContext } from '@/components/CusProvider';

export default ( {type = 'reference',value,onChange,nodeId,noSelect = false,readOnly=false} ) => {
  const [showSelect1, setShowSelect1] = useState(false)
  const [showSelect2, setShowSelect2] = useState(false)
  const {
    flowData,
  } = useContext(SystemContext)

  const findSource = (id,data,result) => {
    for(let i = 0;i<data.length;i++){
      if(data[i].target == id && !result.includes(data[i].source)){
        result.push(data[i].source)
        findSource(data[i].source,data,result)
      }
    }
  }

  const options = useMemo(() => {
    const { nodes,edges } = flowData?.data;
    let result = [];
    let prevNode = [];
    findSource(nodeId,edges,prevNode)
    prevNode.forEach((item)=>{
      let node = nodes.find((node)=>node.id == item);
      const {name , display_name , output = [] , input = []} = node.data;
      let option = {
        label: display_name,
        value: display_name,
        children: []
      }
      let data = name == 'start'?input:output;
      if(data?.length){
        data.forEach((item)=>{
          option.children.push({
            label: item.name,
            value: item.name
          })
        })
        result.push(option)
      }
    })
    return result;
  }, [nodeId,flowData])

  const cascaderValue = useMemo(() => {
    return value?value.split('/'):[]
  }, [value])

  

  const onSelectType = (data) => {
    onChange(data == 'reference'?true:false,'reference')
  }
  const onSelectValue = (data) => {
    onChange(data.join('/'))
  }

  const onChangeInput = (e) => {
    onChange(e.target.value)
  }


  return (
    <div className='defaultInput'>
            {!noSelect && <Select
              options={[
                {
                  label: 'reference',
                  value: 'reference',
                },
                {
                  label: 'input',
                  value: 'input',
                },
              ]}
              value={type}
              onChange={onSelectType}
              onSelect={() => setShowSelect1(false)}
              onBlur={() => setShowSelect1(false)}
              onFocus={() => setShowSelect1(true)}
              open={showSelect1}
              disabled={readOnly}
            />}
            {type == 'reference'?<Cascader
              placeholder='请选择 value'
              allowClear={false}
              options={options}
              value={cascaderValue}
              onChange={onSelectValue}
              // onSelect={() => setShowSelect2(false)}
              onBlur={() => setShowSelect2(false)}
              onFocus={() => setShowSelect2(true)}
              open={showSelect2}
              disabled={readOnly}
            />:<Input placeholder='请输入 value' value={value} onChange={onChangeInput} 
            readOnly={readOnly}/>}
    </div>
  )
}