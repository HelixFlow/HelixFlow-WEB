import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import './index.less'
import { Input, Button, message } from 'antd'
import { validatePrompt } from '@/services/Flow';


export default forwardRef((props, ref) => {
  const { value, data, nodeData } = props;
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    if (value) {
      setPrompt(value)
    }
  }, [value])

  const checkAndSave = async (callback) => {
    console.log('checkAndSave prompt')

    const {input} = nodeData;
    const fields = prompt.match(/{([^}]+)}/g)?.map(match => match.slice(1, -1));
    if(fields?.length){
      const inputNames = input.map(item => item.name)
      let arr = fields.filter(item => !inputNames.includes(item));
      if(arr.length){
        message.error('请添加变量:' + arr.join(','))
        return
      }else{
        callback?.(prompt);
      }
    }else{
      callback?.(prompt);
    }
  }

  useImperativeHandle(ref, () => {
    return {
      checkAndSave: checkAndSave,
    };
  }, [prompt])

  return (
    <div className='build_prompt_editor'>
      <div className="tip">
        <div className="title">提示词变量:{'{x}'}</div>
        <div className="desc">提示词的名称可以在大括号内任意选择，例如 {'{variable_name}'}</div>
      </div>
      <Input.TextArea autoFocus={true} rows={30} value={prompt} onChange={e => setPrompt(e.target.value)}></Input.TextArea>
    </div>
  )
})