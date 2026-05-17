import React, { useEffect, useState, useContext, useMemo } from 'react'
import { history } from 'umi';
import { SystemContext } from '@/components/CusProvider';
import useFlowDraw from '@/utils/useFlow'
import { getUrlParam } from '@/utils'
import Page from './PageComponent'
import { getFlow } from '@/services/Flow';
import { Empty, Spin, message } from 'antd';

export default (props) => {
  useFlowDraw()
  const [loading, setLoading] = useState(false)
  const {
    flowData,
    setFlowData,
  } = useContext(SystemContext)

  const appId = getUrlParam("id"); //id
  // console.log(appId)
  useEffect(()=>{
    if(appId){
      setLoading(true)
      getFlow(appId).then((res)=>{
        if (res?.code && res.code !== 200) {
          message.error(res.msg || '获取工作流失败')
          setFlowData(null)
          return
        }
        setFlowData(res.data)
      }).catch((error) => {
        message.error(error?.message || '获取工作流失败')
        setFlowData(null)
      }).finally(() => {
        setLoading(false)
      })
    } else {
      setFlowData(null)
    }
    return () => {
      setFlowData(null)
    }
  },[appId])
  




  return (
    <div className='buildDetailPage'>
      {loading ? <Spin /> : flowData?.id ? <Page flow={flowData} /> : <Empty description="未找到工作流" />}
    </div>
  )
}
