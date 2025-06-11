import React, { useEffect, useState } from 'react'
import './index.less'
import { CustomIcon } from '@/components/IconMaker'


export default ({ name, showName = true, className = '', isBuildIcon = '' }) => {
  const types = ['doc', 'docx', 'mp3', 'mp4', 'pdf', 'ppt', 'pptx', 'txt', 'xls', 'xlsx', 'zip', 'md', 'csv', 'jpg', 'png']
  let arr = name?.split('.') || [];
  arr.reverse();
  let icon = types.includes(arr[0]?.toLowerCase()) ? arr[0]?.toLowerCase() : 'doc';

  return (
    <div className={`fileNameSpan ${className}`} title={name}>
      {
        isBuildIcon ? <CustomIcon type={isBuildIcon.type} color={isBuildIcon.color} /> :
          icon ? <img
            src={['md', 'png', 'jpg', 'csv'].includes(icon) ? require(`@/assets/dataSet/file_${icon}.svg`) : require(`@/assets/dataSet/file_${icon}.png`)}
            alt=""
          /> : ''
      }

      {/* {icon ? <img
        src={require(`@/assets/dataSet/file_${icon}.png`)}
        alt=""
      /> : ''} */}
      {showName ? <div className='textEllipsis'>{name}</div> : ''}
    </div>
  )
}