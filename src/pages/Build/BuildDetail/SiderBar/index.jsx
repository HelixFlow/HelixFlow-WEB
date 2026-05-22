import React, { useMemo, useState, useContext } from 'react'
import './index.less'
import { SystemContext } from '@/components/CusProvider';
import { nodeIcons, nodeColors2 } from '@/constants'
import { ReactComponent as RightIcon } from "@/assets/right.svg";
import { Input, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'


const Icon = ({ type, fill }) => {
  let Icons = nodeIcons[type] || nodeIcons['unknown'];
  return <Icons fill={fill} />
}

export default (props) => {
  const {
    allNodes,
  } = useContext(SystemContext)
  const safeNodes = allNodes || [];
  const [keyword, setKeyword] = useState('')

  const onDrag = (e, data) => {
    e.dataTransfer.setData('nodeData', JSON.stringify(data))
  }

  const filteredNodes = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) return safeNodes;
    return safeNodes.filter((type) => `${type.name || ''} ${type.description || ''}`.toLowerCase().includes(text));
  }, [safeNodes, keyword]);

  return (
    <div className='sider'>
      <div className="siderHeader">
        <div>
          <div className="siderTitle">Node Library</div>
          <div className="siderHint">拖拽算子到画布</div>
        </div>
        <Tag>{safeNodes.length}</Tag>
      </div>
      <Input
        className="siderSearch"
        prefix={<SearchOutlined />}
        placeholder="搜索 node / connector"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        allowClear
      />
      <div className="siderGroupLabel">Built-in operators</div>
      {
        filteredNodes.map(type => (
          <div className="types" key={type.name} draggable onDragStart={(e) => onDrag(e, type)}>
            <div className="left"><Icon type={type.name} fill={(nodeColors2[type.name] || nodeColors2['unknown']).replace('opacity', '1')} /></div>
            <div className="center">
              <div className="name_ch">{type.name}</div>
              <div className="name_en textEllipsis">{type.description}</div>
            </div>
            <div className="right"><RightIcon /></div>
          </div>
        ))
      }
    </div>
  )
}
