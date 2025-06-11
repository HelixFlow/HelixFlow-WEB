import { Navigate, Outlet } from 'umi'

export default (props) => {
  let menuList = localStorage.getItem('helixflowTabData');
  let hash = window.location.hash;
  console.log('wrapper',hash)
  try {
    return <Outlet />;
    // let menu = JSON.parse(menuList) || [];
    // if (menu.includes('/home')) {
    //   return <Outlet />;
    // } else {
    //   return <Navigate to="/404" />;
    // }
  } catch (error) {
    debugger;
    return <Navigate to="/404" />;
  }
}