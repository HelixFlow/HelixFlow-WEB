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
    validatePrompt({
      name: data.name,
      template: prompt,
      frontend_node: nodeData.node,
    }).then(res => {
      if (res.input_variables?.length) {
        nodeData.node = res.frontend_node;
        callback?.(prompt);
      } else {
        message.info('您的prompt中没有变量')
      }
    })
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