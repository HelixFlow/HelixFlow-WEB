import { Button, Dropdown, message, Popover, Modal, Tooltip, Input, Upload, Image } from 'antd';
import { DownloadOutlined, QuestionCircleOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './index.less';
import { useState, useContext } from 'react';
import { SystemContext } from '@/components/CusProvider';
import { ReactComponent as Dark } from '@/assets/dark.svg'
import { ReactComponent as Light } from '@/assets/light.svg'
import { ReactComponent as Suggestion } from '@/assets/suggestion.svg'
import { useModel, history } from 'umi'
import { CookieUse } from '@/utils';

const { getCookie, setCookie } = CookieUse();

export default (props) => {
  const { data, changeTheme } = useContext(SystemContext)
  const { theme } = data;
  const { initialState } = props;
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('')
  const [picture_list, setPictureList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const Logout = () => {
    window.location.href = `${window.location.origin}/doLogout`;
    // logout().then(res => {
    //   // console.log(res)
    //   // setCookie('login_token_cookie', '');
    //   setCookie('XAccessToken', '');
    //   window.location.href = `${window.location.origin}/doLogout`;
    // })
  };

  const onChangeTheme = () => {
    changeTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const submit = () => {
    let formData = new FormData();
    let filesName = [];
    picture_list.forEach(fileItem => {
      if (!filesName.includes(fileItem.name)) {
        filesName.push(fileItem.name)
        formData.append('picture_list', new Blob([fileItem], {
          type: fileItem.type
        }), fileItem.name);
      }
    })
    // createComment(text, formData).then(res => {
    //   message.success('提交成功');
    //   setText('')
    //   setShowModal(false)
    // })
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };


  const editFileDataList = (type, data) => {
    console.log(data)
    if (type === 'add') {
      setPictureList([...picture_list, data])
    } else {
      setPictureList(picture_list.filter(item => item.uid !== data.uid))
    }
  }

  return (
    <div className="loginContent">
      {/* <Tooltip title="意见反馈">
        <Suggestion className='hoverIcon' onClick={() => setShowModal(true)} />
      </Tooltip> */}
      {/* {
        theme === 'dark' ? <Light className='hoverIcon' onClick={onChangeTheme} /> : <Dark className='hoverIcon' onClick={onChangeTheme} />
      } */}
      <img src={initialState?.user?.icon || require(`@/assets/user_default.png`)} alt="" className='avator' />


      <Dropdown
        menu={{
          items: [
            // {
            //   key: '1',
            //   label: <div onClick={handleEditPassword}>修改密码</div>,
            // },
            {
              key: '2',
              label: <div onClick={Logout}>退出登录</div>,
            },
          ],
        }}
      >
        <span>{initialState.user?.name}</span>
      </Dropdown>

      <Modal destroyOnClose={true} className='suggestionUploadModal' title="意见反馈" open={showModal} onCancel={() => setShowModal(false)} footer={null}>
        <Upload
          listType="picture-card"
          accept=".png, .jpg, .jpeg"
          beforeUpload={async (file) => {
            editFileDataList('add', file)
            return false;
          }}
          onRemove={(file) => editFileDataList('delete', file)}
          onPreview={handlePreview}
        >
          {picture_list.length >= 5 ? null :
            <div>
              <PlusCircleOutlined />
              <div className="ant-upload-text">上传问题图片</div>
            </div>}
        </Upload>
        <Input.TextArea maxLength={500} placeholder="感谢您的反馈,请输入您的问题或建议" value={text} rows={5} onChange={e => setText(e.target.value)} />
        <div className="btn">
          <Button type="primary" size='large' onClick={submit}>提交反馈</Button>
        </div>
        <Modal open={previewOpen} title={'预览图片'} footer={null} onCancel={() => setPreviewOpen(false)}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
      </Modal>
    </div>
  );
};
