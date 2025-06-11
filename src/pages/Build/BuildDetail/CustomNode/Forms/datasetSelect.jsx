import React, { useEffect, useState, useMemo,useContext } from 'react'
import { SystemContext } from '@/components/CusProvider';
import './index.less'
import { Input, Radio, Modal, message } from 'antd'
import { getDatasetForFlow } from '@/services/Flow';

export default (props) => {
  const { value, size,onChange,nodeData } = props;
  const [datasetList, setDatasetList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showModel, setShowModel] = useState(false)
  const {
    setFlowData,
  } = useContext(SystemContext)


  useEffect(() => {
    getDatasetForFlow().then(res => {
      setDatasetList(res.data)
    })
  }, [])

  useEffect(()=>{
    if (datasetList.length && value?.dataset) {
      let name = datasetList.find(item => item.dataset_id == value.dataset)?.dataset_name;
      if(!name){
        onEditData({
            dataset_id: '',
            dingodb_url: '',
            index_name: '',
            embedding_key: '',
            embedding_url: '',
            embedding_name: '',
          })
      }
    }
  },[value,datasetList])

  const Value = useMemo(() => {
    if (datasetList.length) {
      let name = datasetList.find(item => item.dataset_id == value?.dataset)?.dataset_name;
      if(value?.dataset && name){
        console.log('hasvalue and name')
        return name;
      }else{
        console.log('no value or name')
        return ''
      }
    } else {
      return value?.dataset;
    }
  }, [datasetList, value])


  const onOpen = () => {
    setShowModel(true)
  }

  const onChangeValue = (id) => {
    const data = datasetList.find(item => item.dataset_id === id);
    setShowModel(false)
    onEditData(data);
  }

  const onEditData = (data) => {
    const { embedding_key, embedding_url, embedding_name, dingodb_url, index_name,dataset_id } = data;
    let datasetIndex = nodeData.params?.findIndex(item => item.name === 'dataset');
    let embeddingIndex = nodeData.params?.findIndex(item => item.name === 'embedding');
    nodeData.params[datasetIndex].value = {
      dataset: dataset_id,
      dingodb_url: dingodb_url,
      index_name: index_name,
    };
    nodeData.params[embeddingIndex].value = {
      api_key: embedding_key,
      base_url: embedding_url.replace(/embed_documents$/, ''),
      model: embedding_name,
    }
    setFlowData((prev) => {
      return {
        ...prev,
      };
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
          <Radio.Group value={value.dataset} onChange={e => onChangeValue(e.target.value)} defaultValue={value}>
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