import React, { useEffect, useState } from 'react'
import './index.less'
import { Input, Radio } from 'antd'
import { getDatasetList } from '@/services/Flow';

export default (props) => {
  const { value, onChange } = props;
  const [datasetList, setDatasetList] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getDatasetList().then(res => {
      setDatasetList(res.data)
    })
  }, [])

  return (
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
      <Radio.Group value={value} onChange={e => { console.log(e.target.value); onChange(e.target.value) }} defaultValue={value}>
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
  )
}