import React, { useEffect, useState, useContext, useMemo } from 'react'
import './index.less'
import { Input, Radio, Modal, message } from 'antd'
import { getDatasetForFlow } from '@/services/Flow';
import { SystemContext } from '@/components/CusProvider';

export default (props) => {
  const { value, size, nodeData } = props;
  const [datasetList, setDatasetList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showModel, setShowModel] = useState(false)
  const {
    flows,
    setFlows
  } = useContext(SystemContext)
  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id


  useEffect(() => {
    getDatasetForFlow().then(res => {
      setDatasetList(res.data)
    })
  }, [])

  const Value = useMemo(() => {
    if (datasetList.length) {
      return datasetList.find(item => item.dataset_id == value)?.dataset_name;
    } else {
      return value;
    }
  }, [datasetList, value])


  const flow = useMemo(() => {
    const _flow = { ...flows[appId] }
    return _flow.id ? _flow : ''
  }, [flows, appId])

  const onOpen = () => {
    const { edges, nodes } = flow.data;
    let nodeId = nodeData.id;
    let edge = edges.find(item => item.target === nodeId);
    if (edge) {
      setShowModel(true)
    } else {
      message.error('请先连接Embedding节点')
    }
  }

  const onChange = (id) => {
    const data = datasetList.find(item => item.dataset_id === id);
    const { embedding_key, embedding_url, embedding_name, dataset_id, dingodb_url, index_name } = data;
    const { edges, nodes } = flow.data;
    let customId = nodeData.id;
    let embeddingId = edges.find(item => item.target === customId).source;
    let embeddingNode = nodes.find(item => item.id === embeddingId).data;

    embeddingNode.node.template.api_key.value = embedding_key;
    embeddingNode.node.template.base_url.value = embedding_url.replace(/embed_documents$/, '');
    embeddingNode.node.template.model.value = embedding_name;
    nodeData.node.template.dataset.value = dataset_id;
    nodeData.node.template.dingodb_url.value = dingodb_url;
    nodeData.node.template.index_name.value = index_name;
    setShowModel(false)
    setFlows((prev) => {
      return {
        ...prev,
        [appId]: flow
      }
    });

  }

  return (
    <>
      <Input size={size} value={Value} onClick={onOpen} />
      <Modal title="选择数据集" open={showModel} footer={null} onCancel={() => setShowModel(false)} destroyOnClose={true}>
        <div className='build_knowledgeBase_select'>

          <Input.Search
            size='middle'
            placeholder="搜索数据集"
            onSearch={setSearchText}
            style={{
              width: '100%',
              marginBottom: '16px'
            }}
            allowClear
          />
          <Radio.Group value={value} onChange={e => onChange(e.target.value)} defaultValue={value}>
            {
              datasetList.filter(item =>
                item.dataset_name?.indexOf(searchText) > -1).map(item => (
                  <div className="dataset" key={item.dataset_id}>
                    <img src={require('@/assets/data.png')} alt="" />
                    <div className="name">{item.dataset_name}</div>
                    <Radio value={item.dataset_id} />
                  </div>

                ))
            }
          </Radio.Group>
        </div>
      </Modal>
    </>
  )
}