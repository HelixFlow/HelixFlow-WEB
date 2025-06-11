import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Input, Modal, Switch, InputNumber, Select, Drawer, Button } from 'antd'
import { KnowledgeBase, CodeEditor, Prompt, DatasetSelect, ModelName, ToolSelect,DefaultInput,Condition } from './Forms'
import { ReactComponent as OpenModal } from "@/assets/openModal.svg";
import { ReactComponent as KBModal } from "@/assets/kbModal.svg";
import { ReactComponent as Plus } from "@/assets/plus.svg";
import { ReactComponent as Minus } from "@/assets/minus.svg";
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import { getUUID } from '@/utils';
import {fieldOptions} from '@/constants'

export default ({ value, onChange, type, data, nodeData, name, size = 'middle' , selectType = false,editable = true }) => {
  const { name:nodeName } = nodeData;
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
        selectType ? (
            <div className="line">
              <div className="item">
                <Input value={name} onChange={e => onChange(e.target.value, 'name')} readOnly={!editable} />
              </div>
              <div className="item">
                <Select
                  options={fieldOptions}
                  value={data.field_type}
                  onChange={data=>onChange(data,'field_type')}
                  onSelect={() => setShowSelectOptions(false)}
                  onBlur={() => setShowSelectOptions(false)}
                  onFocus={() => setShowSelectOptions(true)}
                  open={showSelectOptions}
                  disabled={!editable}
                />
              </div>
            </div>
          ):data.field_type == 'condition'? (
            <Condition 
              data={data}
              onChange={onChange}
              nodeData={nodeData}
            />
          ) : data.options ? (
            <div className="line">
              <div className="item">
                <Input value={name} />
              </div>
              <div className="item">
                <Select
                  options={data.options.reduce((init, curr) => {
                    init.push({
                      label: curr,
                      value: curr,
                    })
                    return init;
                  }, [])}
                  value={Value}
                  onSelect={() => setShowSelectOptions(false)}
                  onBlur={() => setShowSelectOptions(false)}
                  onFocus={() => setShowSelectOptions(true)}
                  open={showSelectOptions}
                />
              </div>
            </div>
          ) : data.list ? (
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
          ) : name == 'dataset' && nodeName == 'retrieval'?(
            <div className="input_line">
              <DatasetSelect size={size} value={Value} nodeData={nodeData} onChange={onChange}  />
            </div>
          // ):name == 'model' && nodeName == 'call_model'?(
          //   <div className="input_line">
          //     <ModelName size={size} value={Value} nodeData={nodeData} onChange={onChange} />
          //   </div>
          ):name == 'links' && nodeName == 'call_link'?(
            <div className="input_line">
              <ToolSelect size={size} value={Value} nodeData={nodeData} onChange={onChange} />
            </div>
          ):name == 'prompts' && nodeName == 'call_model'?(
            <div className="input_line">
              <Input size={size} value={Value} onClick={() => setShowModel(true)} />
            </div>
          ):(
            <div className="line">
              <div className="item">
                <Input placeholder='请输入name' value={name} onChange={e => onChange(e.target.value, 'name')} readOnly={!editable} />
              </div>
              <div className="item">
                <DefaultInput 
                  nodeId={nodeData.display_name}
                  type={data.reference ? 'reference' : 'input'}
                  value={Value}
                  onChange={onChange}
                  readOnly={!editable}
                />
              </div>
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
        name == 'code' && <Drawer extra={<Button type="primary" onClick={onModalChange}>检查&保存</Button>} width={'40%'} title={<div style={{ display: 'flex', alignItems: 'center' }}><img style={{ width: '24px', marginRight: '8px' }} src={require('@/assets/editCode.png')} alt="" />编辑代码</div>} open={showModel} onClose={() => setShowModel(false)} destroyOnClose={true}>
          <CodeEditor ref={modelRef} value={Value} />
        </Drawer>
      }
      {/* prompts编辑弹窗 */}
      {
        name == 'prompts' && <Drawer extra={<Button type="primary" onClick={onModalChange}>检查&保存</Button>} width={'40%'} title={<div style={{ display: 'flex', alignItems: 'center' }}><img style={{ width: '24px', marginRight: '8px' }} src={require('@/assets/editPrompt.png')} alt="" />编辑提示词</div>} open={showModel} onClose={() => setShowModel(false)} destroyOnClose={true}>
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