import React, { useEffect, useState,useContext } from 'react'
import './index.less'
import Handler from '../handler'
import {ConditionOptions} from '@/constants'
import DefaultInput from './defaultInput'
import { SystemContext } from '@/components/CusProvider';
import { Select } from 'antd'
import { MinusCircleOutlined , PlusCircleOutlined } from '@ant-design/icons'

export default ( {data,onChange,nodeData} ) => {
  const {
    setFlowData,
  } = useContext(SystemContext)
  const {name,display_name,value} = data;
  const {compare,compare_reference,compare_value,reference} = value;
  const [showSelectOptions, setShowSelectOptions] = useState(false)

  const onChangeDataA = (newValue,key) => {
    console.log(newValue,key)
    let dataObj = {
      ...value,
      reference: newValue
    };
    onChange(dataObj)
    
  }
  const onChangeCompare = (data) => {
    let dataObj = {
      ...value,
      compare: data
    }
    onChange(dataObj)
  }
  const onChangeDataB = (newValue,key) => {
    console.log(newValue,key)
    let dataObj = {
      ...value,
    };
    if(key == 'reference'){
      dataObj.compare_reference = newValue;
      dataObj.compare_value = ''
    }else{
      dataObj.compare_value = newValue;
    }
    onChange(dataObj)
  }

  const onAdd  = () => {
    console.log('add:',nodeData)
    let id = getMinNum(nodeData.params.filter(item=>item.display_name.indexOf('else_if')>-1).map(item=>item.display_name.split('_')[item.display_name.split('_').length - 1]));
    let newObj = {
      field_type: "condition",
      required: true,
      show: true,
      value: {
          reference: null,
          compare: null,
          compare_value: null,
          compare_reference: false
      },
      name: "else_if",
      display_name: `else_if_${id}`,
      display_type: "text",
      description: "",
      editable: true
    }
    nodeData.params.splice(nodeData.params.length - 1 , 0 , newObj)
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }
  const onDelete = () => {
    console.log('delete:',nodeData)
    let index = nodeData.params.findIndex(item=>item.display_name == display_name);
    nodeData.params.splice(index,1)
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }



  const getMinNum = (arr) => {
    console.log(arr)
    let num = 1;
    let max = arr.length;
    for (let i = 0; i < max; i++) {
      if (arr.find(item=>item == num)) {
        num++;
      }
    }
    return num;
  }

  return (
    <div className='field_condition'>
      {
        name !== 'else'?(<>
          <DefaultInput 
            nodeId={nodeData.display_name}
            type={'reference'}
            value={reference}
            onChange={onChangeDataA}
            noSelect={true}
          />

          <Select
            options={ConditionOptions}
            value={compare}
            onChange={onChangeCompare}
            onSelect={() => setShowSelectOptions(false)}
            onBlur={() => setShowSelectOptions(false)}
            onFocus={() => setShowSelectOptions(true)}
            open={showSelectOptions}
            placeholder='请选择比较符'
          />
          {
            ['is empty','is not empty'].includes(compare)?'':<DefaultInput 
              nodeId={nodeData.display_name}
              type={compare_reference?'reference':'input'}
              value={compare_value}
              onChange={onChangeDataB}
            />
          }
          {
            name == 'if'?<PlusCircleOutlined onClick={onAdd} />:<MinusCircleOutlined onClick={onDelete} />
          }
        </>):''
      }
    <Handler
            nodeData={nodeData}
            paramData={{
              id: display_name,
              left: false,
            }}
          />
    </div>
  )
}