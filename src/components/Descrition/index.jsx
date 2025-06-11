import './index.less';

const DesCrition = ({
  icon,
  title,
  descrition,
  showDec
}) => {
  return <div className="desc-wrapper">
    {
      showDec === 'h1' &&
      <div>
        <h1>{title}</h1>
        <h4>{descrition}</h4>
      </div>
    }
    {
      showDec === 'h2' &&
      <>
        <div className='hasIcon'>
          {icon && <span className='icon-box'>{icon}</span>}
          <h2 className="title">{title}</h2>
        </div>
        {descrition && <h4>{descrition}</h4>}
      </>
    }
    {
      showDec === 'h3' &&
      <h3 className="title">{title}</h3>
    }
  </div>
}
export default DesCrition;