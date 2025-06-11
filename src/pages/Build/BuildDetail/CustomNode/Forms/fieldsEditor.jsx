import React, { useEffect, useState, useContext } from 'react'
import { SystemContext } from '@/components/CusProvider';
import './index.less'
import { Table, Button, Switch } from 'antd'
import Input from '../input'

export default (props) => {
  const { data, onChange } = props;
  const [dataSource, setDataSource] = useState([])
  const {
    setFlows,
  } = useContext(SystemContext)

  const [_, fouceUpdateNode] = useState(false)

  useEffect(() => {
    if (data.id) {
      let renderArr = [];
      Object.values(data.node.template).forEach(item => {
        if (item.name && item.show && ["str", "bool", "float", "code", "prompt", "file", "int"].includes(item.type)) renderArr.push({
          ...item,
        })
      })
      setDataSource(renderArr)
    }
  }, [data, _])

  const handleOnNewValue = (record, key, newValue) => {
    data.node.template[record.name][key] = ['float', 'int'].includes(record.type) ? Number(newValue) : newValue;
    fouceUpdateNode(!_)
    // Set state to pending
    setFlows((prev) => {
      return {
        ...prev,
      };
    });
  }
  const columns = [
    {
      title: '参数',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <span>{record.name}{record.required ? <span className='requireText' style={{}}>*</span> : ''} </span>
      }
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (text, record, _, action) => {
        return <Input
          size={'large'}
          type={record.type}
          name={record.name}
          value={record.value}
          onChange={(data) => handleOnNewValue(record, 'value', data)}
          data={record}
          nodeData={data}
        />
      }
    },
    {
      title: '展示',
      key: 'option',
      dataIndex: 'option',
      render: (text, record, _, action) => {
        return <Switch checked={!record.advanced} onChange={(data) => handleOnNewValue(record, 'advanced', !data)} />
      }
    },
  ];

  return (
    <div className='build_code_editor'>
      <Table pagination={false} rowKey={'name'} dataSource={dataSource} columns={columns} />
    </div>
  )
}