import React, { } from 'react'
import './index.less'



const IconColor = {
  blueIcon: 'linear-gradient(180deg, #4A96FF 0%, #1677FF 100%)',
  redIcon: 'linear-gradient(180deg, rgba(255,78,152,0.6) 0%, #FF4E98 100%, #FF227F 100%)',
  yellowIcon: 'linear-gradient(180deg, rgba(255,191,53,0.6) 0%, #FFA900 100%)',
  greenIcon: 'linear-gradient(180deg, rgba(0,188,229,0.6) 0%, #02AACF 100%)',
  purpleIcon: 'linear-gradient(180deg, rgba(70,111,255,0.6) 0%, #3462FF 100%)',
  deepGreenIcon: 'linear-gradient( 180deg, #40D862 0%, #28D07F 100%)',
  // defaultIcon: 'rgba(0,0,0,0.06);'
}

export const CustomIcon = (props) => {
  const { type, color, className, onClick = () => { } } = props;
  let _type = type && ['datasetIcon1', 'datasetIcon2', 'datasetIcon3', 'datasetIcon4', 'datasetIcon5', 'datasetIcon6', 'datasetIcon7', 'datasetIcon8', 'datasetIcon9', 'datasetIcon10', 'datasetIcon11', 'datasetIcon12'].includes(type || 'datasetIcon1') ? type : 'datasetIcon1';
  let _color = color && ['blueIcon', 'redIcon', 'yellowIcon', 'greenIcon', 'purpleIcon', 'deepGreenIcon'].includes(color || 'blueIcon') ? color : 'defaultIcon';

  return <div
    className={"customIcon " + className}
    style={{ backgroundImage: IconColor[_color] }}
    onClick={onClick}>
    <img src={require(`./icons/${_type || 'datasetIcon1'}.png`)} alt="" />
  </div>
}

export default (props) => {
  const { value, onChange } = props;

  const changeOptions = (key, data) => {
    onChange({
      ...value,
      [key]: data,
    })
  }

  return (
    <div className='iconMaker'>
      <CustomIcon type={value?.type} color={value?.color} />
      <div className="options">
        <div className="name">背景色</div>
        <div className="list">
          {
            Object.keys(IconColor).map(item => (
              <div
                key={item}
                className={`colorBox`}
                style={{
                  backgroundImage: IconColor[item]
                }}
                onClick={() => changeOptions('color', item)}
              ></div>
            ))
          }
        </div>
        <div className="name">图标</div>
        <div className='list'>{
          new Array(12).fill(0).map((item, index) => (
            <CustomIcon
              type={'datasetIcon' + (index + 1)}
              key={index}
              color={''}
              onClick={() => changeOptions('type', 'datasetIcon' + (index + 1))}
            />
          ))
        }</div>
      </div>
    </div>
  )
}