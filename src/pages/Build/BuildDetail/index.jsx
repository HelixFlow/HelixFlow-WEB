import React, { useEffect, useState, useContext, useMemo } from 'react'
import { history } from 'umi';
import { SystemContext } from '@/components/CusProvider';
import useFlowDraw from '@/utils/useFlow'
import Page from './PageComponent'
import { getFlow } from '@/services/Flow';

export default (props) => {
  useFlowDraw()
  const {
    flowData,
    setFlowData,
  } = useContext(SystemContext)

  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id
  // console.log(appId)
  useEffect(()=>{
    if(appId){
      getFlow(appId).then((res)=>{
        setFlowData(res.data)
      })
    }
    return () => {
      setFlowData(null)
    }
  },[appId])
  




  return (
    <div className='buildDetailPage'>
      {flowData?.id ? <Page flow={flowData} /> : ''}
    </div>
  )
}