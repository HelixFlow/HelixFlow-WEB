import React, { useEffect, useState, useContext, useCallback } from 'react'
import './index.less'
import { ReactComponent as DeleteIcon } from "@/assets/deleteFlow.svg";
import { ReactComponent as SettingIcon } from "@/assets/settingFlow.svg";
import { SystemContext } from '@/components/CusProvider';
import { Input, Modal, Switch, InputNumber, Select } from 'antd'
import { FieldsEditor } from '../CustomNode/Forms'

export default (props) => {
  const { nodeData } = props;
  const {
    deleteNode,
  } = useContext(SystemContext)
  const [showModel, setShowModel] = useState(false)

  const handleDelete = () => {
    deleteNode(nodeData.id)
  }

  return (
    <div className='build_custom_node_toolbar'>
      <DeleteIcon onClick={handleDelete} />
      <SettingIcon onClick={() => setShowModel(true)} />
      {/* 属性编辑弹窗 */}
      <Modal width={700} title={nodeData.type + '  ID: ' + nodeData.id} open={showModel} footer={null} onCancel={() => setShowModel(false)} destroyOnClose={true}>
        <div style={{ marginBottom: '8px' }} className="common_description">{nodeData.node?.description}</div>
        <FieldsEditor data={nodeData} />
      </Modal>
    </div>
  )
}