import React, { useEffect, useState, useContext } from 'react'
import { Popconfirm, Table, Button, Space, Tag, Modal, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.less'
import { history } from 'umi'
import { getFlowList, createAndEditFlow, deleteFlow } from '@/services/Flow';
import DetailModal from './DetailModal'

export default (props) => {
  const { } = props;
  const [showModal, setShowModal] = useState(false)
  const [editInfo, setEditInfo] = useState(null)

  const [renderData, setRenderData] = useState([])
  useEffect(() => {
    init()
  }, [])
  const init = () => {
    getFlowList().then(res => {
      setRenderData(res.data.flows)
    })
  }

  const onBuild = () => {
    setShowModal(true);
    setEditInfo({})
  }

  const onEdit = (info) => {
    const { id, name, description } = info
    setShowModal(true);
    setEditInfo({ id, name, description })
  }

  const onPublish = (info) => {
    const { id, status } = info;
    setRenderData(renderData.map(item => {
      if (item.id === id) {
        return { ...item, publishing: true }
      } else {
        return item
      }
    }))
    createAndEditFlow({ id, status: 3 - (status || 1) }).then(res => {
      init()
    }).catch(() => {
    })
  }

  const onDelete = (info) => {
    Modal.confirm({
      title: '你确定要删除吗?',
      onOk() {
        deleteFlow(info.id).then(res => init())
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleSubmit = (value) => {
    // console.log(value);
    init();
    setShowModal(false);
  }


  const columns = [
    {
      title: '工作流名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '工作流描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      ellipsis: true,
    },
    // {
    //   title: '创建人',
    //   dataIndex: 'user_id',
    //   key: 'user_id',
    //   width: '10%',
    // },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: '15%',
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: '15%',
    },
    {
      title: '启用',
      dataIndex: 'status',
      key: 'status',
      width: '5%',
      render: (text, record) => {
        return <Switch disabled={record.publishing} checked={text == '2'} onChange={(data) => onPublish(record)} />
      }
    },
    {
      title: '操作',
      key: 'option',
      dataIndex: 'option',
      width: '15%',
      render: (text, record, _, action) => {
        return record.status !== 2 ? (
          <Space size="middle">
            <>
              <a onClick={() => onEdit(record)}>编辑</a>
              <a onClick={() => history.push(`/buildApp/buildDetail?id=${record.id}`)}>开发</a>
            </>
            <a onClick={() => onDelete(record)}>删除</a>
          </Space>) : <a onClick={() => history.push(`/buildApp/buildDetail?id=${record.id}`)}>详情</a>

      }
    },
  ];

  return (
    <div className='buildAppPage basePage'>
      <div className="title">工作流{renderData.length}个 <Button onClick={onBuild} type='primary' icon={<PlusOutlined />}>新增工作流</Button></div>
      <div className="content">
        <Table rowKey={'id'} columns={columns} dataSource={renderData} />
      </div>
      <Modal
        title={editInfo?.id ? '编辑工作流' : '新建工作流'}
        open={showModal}
        onOk={() => { }}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose={true}
      >
        <DetailModal
          editInfo={editInfo}
          onOK={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}