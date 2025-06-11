import { GET_ALL_PROMPT ,OPTIMIZE_PROMPT,OPTIMIZE_PROMPT_LOG,DEL_OPTIMIZE_PROMPT_LOG} from '@/constants/api'
import { request } from 'umi';

export async function getPromptList(params) {
  return request(`${GET_ALL_PROMPT}`, {
    method: 'GET',
    params
  });
};

export async function preOptimizePrompt(data) {
  return request(OPTIMIZE_PROMPT, {
    method: 'POST',
    data
  });
};

export async function getOptimizeLog(data) {
  return request(OPTIMIZE_PROMPT_LOG, {
    method: 'POST',
  });
};

export async function delOptimizeLog(id) {
  return request(`${DEL_OPTIMIZE_PROMPT_LOG}/${id}`, {
    method: 'DELETE',
  });
};

// export async function updateModel(data) {
//   return request(`${GET_ALL_MODEL}/${data.id}`, {
//     method: 'PUT',
//     data
//   });
// };

// export async function getSchemaByUrl(data) {
//   return request(GET_SCHEMA, {
//     method: 'GET',
//     params:data
//   });
// };

// export async function testModel(data) {
//   return request(TEST_MODEL, {
//     method: 'POST',
//     data
//   });
// };