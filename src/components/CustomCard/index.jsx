import { Card, Avatar, Space } from 'antd';
import classNames from 'classnames';
import { ArrowUpOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './index.less';

const { Meta } = Card;
const CustomCard = ({
  item,
  linkDoc
}) => {
  const handleLink = () => {
    history.push(item.linkpath)
  };
  const handleLinkDoc = () => {
    if (item.type === 'VISION') {
      linkDoc('LLM');
    } else {
      linkDoc(item.type);
    }
  };

  return <div style={{ position: 'relative' }}>
    <div className={`cardBox ${item.cardName}`}>
      <div>
        {item.iconWrapper && item.iconWrapper}
        {item.title && <h2>{item.title}</h2>}
        {item.tag &&
          <div>
            <Space>
              {
                item.tag.map(item => (
                  <div className='tagBox' key={item}>{item}</div>
                ))
              }
            </Space>
          </div>
        }
        {item.descrition && <label>{item.descrition}</label>}
      </div>
      <ul>
        {item.linkpath && <li><span onClick={handleLink}>立即体验</span><ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} /></li>}
        {item.hasDoc && <li><span onClick={handleLinkDoc}>接口文档</span><ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} /></li>}
      </ul>
    </div>
    {
      item.cardName === 'chatCard' && <div className='chat-cardBg'></div>
    }
  </div>

}
export default CustomCard;