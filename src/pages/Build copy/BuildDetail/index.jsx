import React, { useEffect, useState, useContext, useMemo } from 'react'
import { history } from 'umi';
import { SystemContext } from '@/components/CusProvider';
import useFlowDraw from '@/utils/useFlow'
import Page from './PageComponent'

export default (props) => {
  useFlowDraw();
  const [menu, setMenu] = useState(['1'])
  const {
    flows,
  } = useContext(SystemContext)


  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id
  // console.log(appId)

  const flow = useMemo(() => {
    const _flow = { ...flows[appId] }
    return _flow.id ? _flow : ''
  }, [flows, appId])


  return (
    <div className='buildDetailPage'>
      {flow ? <Page flow={flow} /> : ''}
    </div>
  )
}