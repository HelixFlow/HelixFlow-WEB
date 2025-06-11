import { Result } from 'antd';
export default () => {
  return <Result
    style={{ height: '100vh' }}
    status="403"
    title="没有权限进入该页面"
    subTitle="无该页面访问权限，请与管理员联系"
  />
}