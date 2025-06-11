import React, { useEffect, useContext } from 'react'
import './index.less';
import { useModel, history } from 'umi';
import { LockOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Avatar } from 'antd';
import { SystemContext } from '@/components/CusProvider';
// import Spline from '@splinetool/react-spline';
import { ReactComponent as Dec1Icon } from '@/assets/login/llmIcon.svg';
import { ReactComponent as Dec2Icon } from '@/assets/login/textIcon.svg';
import { ReactComponent as Dec3Icon } from '@/assets/login/promptIcon.svg';
import { login,register } from '@/services/User';
import { CookieUse } from '@/utils';
const { setCookie } = CookieUse();


export default (props) => {
  const { data, changeTheme } = useContext(SystemContext)

  useEffect(() => {
    changeTheme('light')
  }, [])

  const onLogin = (data) => {
    // setCookie('login_token_cookie', '');
    const { username, password } = data;
    register(username.trim(), password).finally(res => {
      login(username.trim(), password).then(res => {
        history.push('/');
        location.reload();
      })
    })
  }

  return (
    <div className='loginPage'>
      <div className='leftTip'>
        <div className='leftDec'>
          <h1>HelixFlow开发平台</h1>
          <div className='sub-dec'>
            <div>HelixFlow开发平台</div>
          </div>
        </div>
      </div>
      <div className="rightCard">
        <div>
          <div className="title">
            <img src={require('@/favicon.png')} alt="" />
            <h1>HelixFlow</h1>
            <div className='dec'>开发者平台</div>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            onFinish={onLogin}
          >
            <div className="label">用户名</div>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                }
              ]}
            >
              <Input
                size='large'
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
              />
            </Form.Item>
            <div className="label">密码</div>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                // type="password"
                placeholder="请输入密码"
                size='large'
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" size='large' htmlType="submit" className="login-form-button modernButton">
                登录 / 注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div >
  )
}