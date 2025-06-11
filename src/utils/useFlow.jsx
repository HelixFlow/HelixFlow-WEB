import React, { useEffect, useState, useContext } from 'react'
import { SystemContext } from '@/components/CusProvider';
import { getFlowList, getNodeList,getOperatorsList } from '@/services/Flow';

export default function useFlowDraw() {
  const {
    setAllNodes,
  } = useContext(SystemContext)

  useEffect(() => {

    getOperatorsList().then(res=>{
      setAllNodes(res.data)

    })
    return () => {
      setAllNodes([])
    }
  }, [])



}