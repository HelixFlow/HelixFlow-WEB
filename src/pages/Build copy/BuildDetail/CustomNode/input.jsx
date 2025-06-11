import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Input, Modal, Switch, InputNumber, Select, Drawer, Button } from 'antd'
import { KnowledgeBase, CodeEditor, Prompt, DatasetSelect, ModelName, ToolSelect } from './Forms'
import { ReactComponent as OpenModal } from "@/assets/openModal.svg";
import { ReactComponent as KBModal } from "@/assets/kbModal.svg";
import { ReactComponent as Plus } from "@/assets/plus.svg";
import { ReactComponent as Minus } from "@/assets/minus.svg";
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { getUUID } from '@/utils';

export default ({ value, onChange, type, data, nodeData, name, size = 'small' }) => {
  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const modelRef = useRef(null)

  const Value = useMemo(() => {
    if (value) {
      return value;
    } else {
      return data.list ? [''] : ''
    }
  }, [value, data])

  //多行输入
  const multiLineValueChange = (index, value, flag = 1) => {
    let newData = [...Value];
    if (flag !== 3) {
      newData[index] = value;
    } else {
      newData.splice(index, 1)
    }
    onChange(newData)
  }

  //关闭弹窗
  const onModalChange = (_value) => {
    let func = (data) => {
      console.log(data)
      setShowModel(false)
      onChange(data);
    }
    if (modelRef.current?.checkAndSave) {
      modelRef.current?.checkAndSave(func);
    } else {
      func(_value)
    }
  }


  return (
    <div className={`build_custom_node_input_line build_custom_node_input_line_${size}`}>
      {/* 多行输入 */}
      {
        data.options && name !== 'model_name' ? (
          <div className="input_line" >
            <Select
              size={size}
              value={Value}
              onChange={onChange}
              onSelect={() => setShowSelectOptions(false)}
              onBlur={() => setShowSelectOptions(false)}
              onFocus={() => setShowSelectOptions(true)}
              open={showSelectOptions}
              options={data.options.reduce((init, curr) => {
                init.push({
                  label: curr,
                  value: curr,
                })
                return init;
              }, [])}
            />
          </div>
        ) : data.list && name !== 'model_name' ? (
          Value.map((item, index) => (
            <div key={index} className="input_line">
              <Input
                size={size}
                value={item}
                onChange={e => multiLineValueChange(index, e.target.value)}
              />
              {index == Value.length - 1 ?
                <Plus className="changeLineCount input_option" onClick={() => multiLineValueChange(index + 1, '', 2)}></Plus> :
                <Minus className="changeLineCount input_option" onClick={() => multiLineValueChange(index, '', 3)}></Minus>
              }
            </div>
          ))
        ) : (
          // 单行输入
          <div className="input_line">
            {
              type == 'bool' ? <Switch size={size} checked={Value} onChange={checked => onChange(checked)} /> :
                type == 'float' ? <InputNumber size={size} controls={{ upIcon: <UpOutlined onClick={() => onChange(Value >= 0.9 ? 1 : Value + 0.1)} />, downIcon: <DownOutlined onClick={() => onChange(Value <= 0.1 ? 0 : Value - 0.1)} /> }} value={Number(Value)} precision={1} min={0} max={1} onChange={onChange} /> :
                  type == 'int' ? <InputNumber size={size} controls={{ upIcon: <UpOutlined onClick={() => onChange(Value + 1)} />, downIcon: <DownOutlined onClick={() => onChange(Value <= 1 ? 0 : Value - 1)} /> }} value={Number(Value)} min={0} onChange={onChange} /> :
                    // name == 'index_name' ? <Input size={size} value={Value} onClick={() => setShowModel(true)} /> :
                    name == 'dataset' ? <DatasetSelect size={size} value={Value} nodeData={nodeData} /> :
                      name == 'model_name' ? <ModelName size={size} value={Value} nodeData={nodeData} /> :
                        name == 'tool_name' ? <ToolSelect size={size} value={Value} nodeData={nodeData} /> :
                          ['index_name', 'server_url'].includes(name) ? <Input size={size} value={Value} readOnly /> :
                            type == 'code' ? <Input size={size} value={Value} onClick={() => setShowModel(true)} /> :
                              type == 'prompt' ? <Input size={size} value={Value} onClick={() => setShowModel(true)} /> :
                                <Input size={size} type={data.password ? 'password' : 'text'} value={Value} onChange={e => onChange(e.target.value)} />

            }
            {/* 右侧按钮 */}
            {
              // name == "index_name" ? (
              //   <KBModal className="input_option" onClick={() => setShowModel(true)}>Sl</KBModal>
              // ) : type == "code" ? (
              type == "code" ? (
                <OpenModal className="input_option" onClick={() => setShowModel(true)}>Cd</OpenModal>
              ) : type == "prompt" ? (
                <OpenModal className="input_option" onClick={() => setShowModel(true)}>pt</OpenModal>
              ) : ''
            }
          </div>
        )
      }


      {/* 选择数据集弹窗 */}
      {/* {
        name == 'dataset' && <Modal title="选择数据集" open={showModel} footer={null} onCancel={() => setShowModel(false)} destroyOnClose={true}>
          <DatasetSelect value={Value} />
        </Modal>
      } */}
      {/* 选择知识库弹窗 */}
      {
        name == 'index_name' && <Modal title="知识库选择" open={showModel} footer={null} onCancel={() => setShowModel(false)} destroyOnClose={true}>
          <KnowledgeBase value={Value} onChange={onModalChange} />
        </Modal>
      }
      {/* 代码编辑弹窗 */}
      {
        type == 'code' && <Drawer extra={<Button type="primary" onClick={onModalChange}>检查&保存</Button>} width={'40%'} title={<div style={{ display: 'flex', alignItems: 'center' }}><img style={{ width: '24px', marginRight: '8px' }} src={require('@/assets/editCode.png')} alt="" />编辑代码</div>} open={showModel} onClose={() => setShowModel(false)} destroyOnClose={true}>
          <CodeEditor ref={modelRef} value={Value} />
        </Drawer>
      }
      {/* prompt编辑弹窗 */}
      {
        type == 'prompt' && <Drawer extra={<Button type="primary" onClick={onModalChange}>检查&保存</Button>} width={'40%'} title={<div style={{ display: 'flex', alignItems: 'center' }}><img style={{ width: '24px', marginRight: '8px' }} src={require('@/assets/editPrompt.png')} alt="" />编辑提示词</div>} open={showModel} onClose={() => setShowModel(false)} destroyOnClose={true}>
          <Prompt
            ref={modelRef}
            value={Value}
            data={data}
            nodeData={nodeData}
          />
        </Drawer>
      }
    </div >
  )
}