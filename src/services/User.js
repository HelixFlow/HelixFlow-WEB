import { 
  LOGIN, 
  LOGOUT, 
  USER_GET, 
  REGISTER,
  USER_RESOURCE_GET,
  USER_ROOT_GET,
  UPDATE_USER,
  USER_GROUP,
  USER_SIGN_IN,
  PERMISSIONS_STATUS
} from '@/constants/api'
import { request, history} from 'umi';



export const login = async (name, password) => {
  return request(LOGIN, {
    method: 'POST',
    data: { name, password},
  }).then((res) => {
    if (res.result?.user_id) {
      return res;
    } else {
      return new Error('登录失败');
    }
  });
};

export async function register(name, password) {
  return request(REGISTER, {
    method: 'POST',
    data: { name, password },
  })
}

export async function logout() {
  return request(LOGOUT, {
    method: 'POST'
  });
}


export async function getUser() {
  try {
    const data = await request(USER_GET);
    if (data) {
      if(data.code === 500){
        history.push('/404');
      }else{
        return data;
      }
      return data;
    } else {
      return null;
    }
  } catch (e) {
    // console.error(e.message);
    history.push('/404');
    return null;
  }
}