import { Link, Outlet, useModel } from 'umi';
import styles from './index.less';
import { Spin, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { getUser } from '@/services/User';
import { ExclamationCircleFilled } from '@ant-design/icons'


export default function Layout() {
  const { initialState = { user: null }, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(true);
  const [alertTip, setAlertTip] = useState<any>(null);


  useEffect(() => {
    // getUser().then((res) => {
    //   const result = res?.result || {}
    //   //注入
    //   setInitialState({ user: result })
    //   localStorage.setItem('helixflowUserData', JSON.stringify(result));
    //   setLoading(false);
    // });
  }, []);


  return (
    <div className={styles.navs}>
      {/* <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <a href="https://github.com/umijs/umi">Github</a>
        </li>
      </ul> */}
      <Outlet />
    </div>
  );
}
