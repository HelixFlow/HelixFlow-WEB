import React, { useEffect, useState, useContext } from 'react'
import './index.less'
import Param from './param'
import Handler from './handler'
import NodeToolbar from '../NodeToolbar'
import { nodeColors2, nodeIcons } from '@/constants'
import { SystemContext } from '@/components/CusProvider';
import { toTitleCase, isValidConnection } from '@/utils'
import { Button,Dropdown,Input } from 'antd'
import { PlusOutlined,EllipsisOutlined,MinusCircleOutlined } from '@ant-design/icons'


const Icon = ({ type, fill }) => {
  let Icons = nodeIcons[type] || nodeIcons['unknown'];
  return <Icons fill={fill} />
}

export default ({ data, selected }) => {
  // console.log(data)
  const { description, name, display_name, input = [], output = [], params = [] } = data;
  const {
    flowData,
    setFlowData,
    deleteNode
  } = useContext(SystemContext)
  const [editName, setEditName] = useState(false)

  const handleEdit = () => {
    setEditName(true);
  }
  const handleSave = () => {
    setEditName(false);
  }

  const handleDelete = () => {
    console.log('删除')
    let oldNames = [];
    let data = [...(input || []), ...(output || []), ...(params || [])];
    data.forEach((item)=>{
      oldNames.push(display_name + '/' + item.name);
    })
    deleteRelation(oldNames);
    deleteNode(display_name)
  }

  const onInputChange = (e) => {
    data.description = e.target.value;
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
    
  }

  const handleAddField = (type) => {
    console.log(data)
    data[type].push({
      "field_type": "str",
      "required": false,
      "show": true,
      "value": null,
      "name": "",
      "display_name": "",
      "display_type": "text",
      "description": "",
      "editable": true,
      "reference": false
    })
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }
  const handleDeleteField = (type,index) => {

    let oldName = data.display_name + '/' + data[type][index]['name'];

    deleteRelation([oldName])



    data[type].splice(index,1)
    setFlowData((prev) => {
      return {
        ...prev,
      };
    });
  }

  const deleteRelation = (oldNames = []) => {

    const { nodes } = flowData?.data;
    nodes.forEach((node)=>{
      const { input,output,params } = node.data;
      let data = [...(input || []), ...(output || []), ...(params || [])];
      data.forEach((item)=>{
        if(item.field_type !== 'condition'){
          if(item.reference && oldNames.includes(item.value)){
            item.value = '';
          }
        }else{
          if(oldNames.includes(item.value.reference)){
            item.value.reference = '';
          }
          if(item.value.compare_reference && oldNames.includes(item.value.compare_value)){
            item.value.compare_value = '';
          }
        }
      })
    })
  }

  return (
    <div className={`flow_custom_node ${selected ? 'flow_custom_node_selected' : ''}`} style={{ borderColor: nodeColors2[name]?.replace('opacity', '0.35') }}>
      <div className="flow_custom_node_content" style={{ backgroundColor: nodeColors2[name]?.replace('opacity', '0.1') }}>
        <div className="custom_node_title" style={{ color: nodeColors2[name]?.replace('opacity', '1') }}>
          <Icon type={name} fill={nodeColors2[name]?.replace('opacity', '1')} />
          <span className='flex1Box'>{toTitleCase(display_name)}</span>
          <Dropdown
            menu={{
              items:[
                {
                  key: 'edit',
                  name: 'Edit',
                  label: '编辑',
                  onClick: handleEdit
                },
                {
                  key: 'delete',
                  danger: true,
                  label: '删除',
                  onClick: handleDelete
                }
              ],
            }}
          >
            <EllipsisOutlined style={{fontSize:'24px'}} />
          </Dropdown>
        </div>
        <div className="custom_node_desc">
          {!editName?description:<Input autoFocus type="text" onBlur={handleSave} value={description} onChange={onInputChange} />}
        </div>
        <div className="custom_node_content">
          {input?.length ? <div className="module input" style={{ borderColor: nodeColors2[name]?.replace('opacity', '0.3') }}>
            <div className="module_title">Input</div>
            <div className="fields">
              <div className="line">
                <div className="desc">Variable name</div>
                <div className="desc">Variable type</div>
              </div>
              {
                input?.map((item, index) => (
                  item.show && <div className="build_custom_node_input_line_box">
                    <Param
                      key={item.display_name}
                      nodeData={data}
                      paramData={item}
                      position={['input', index]}
                      selectType={name == 'start'}
                    />
                    { name !=='call_link' &&  <MinusCircleOutlined onClick={()=>handleDeleteField('input',index)} />}
                  </div> 
                ))
              }
              { name !=='call_link' && <Button style={{
                border: '1px solid',
                borderColor: nodeColors2[name].replace('opacity', '0.4'),
                color: nodeColors2[name].replace('opacity', '1')
              }} className='addBtn' onClick={()=>handleAddField('input')} icon={<PlusOutlined />}></Button>}
            </div>
          </div> : ''}
          {
            params?.map((item, index) => (
              item.show && <div className="module param" key={item.display_name} style={{ borderColor: nodeColors2[name]?.replace('opacity', '0.3') }}>
                <div className="module_title">{toTitleCase(item.display_name)}</div>
                {/* <div className="fields"></div> */}
                <div className="fields">
                  <Param
                    nodeData={data}
                    paramData={item}
                    position={['params', index]}
                  />
                </div>
              </div>
            ))
          }
          {output?.length ? <div className="module output" style={{ borderColor: nodeColors2[name]?.replace('opacity', '0.3') }}>
            <div className="module_title">Output</div>
            <div className="fields">
              <div className="line">
                <div className="desc">Variable name</div>
                <div className="desc">Variable type</div>
              </div>
              {
                output?.map((item, index) => (
                  item.show && <div className="build_custom_node_input_line_box">
                    <Param
                      key={item.display_name}
                      nodeData={data}
                      paramData={item}
                      position={['output', index]}
                      selectType={name !== 'end'}
                    />
                    {/* <MinusCircleOutlined  onClick={()=>handleDeleteField('output',index)} /> */}
                  </div>
                ))
              }
              {/* {output.filter(outputItem=>outputItem.editable).length ? <Button style={{
                border: '1px solid',
                borderColor: nodeColors2[name].replace('opacity', '0.4'),
                color: nodeColors2[name].replace('opacity', '1')
              }} className='addBtn'  onClick={()=>handleAddField('output')} icon={<PlusOutlined />}></Button>:''} */}
            </div>
          </div> : ''}
          {name !=='start' && <Handler
            nodeData={data}
            paramData={{
              title: display_name,
              id: name,
              type: name,
              left: true,
            }}
          />}
          {!['end','if_condition'].includes(name) && <Handler
            nodeData={data}
            paramData={{
              title: display_name,
              id: name,
              type: name,
              left: false,
            }}
          />}
        </div>
      </div>
    </div>
  )
}