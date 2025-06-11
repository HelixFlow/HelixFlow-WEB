import {
  GET_ALL_MODEL,
  GET_ALL_MODEL_FOR_FLOW,
  FINE_TUNING,
  START_TRAIN,
  STOP_TRAIN,
  START_EVAL,
  FINE_TUNING_PUBLISH,
  FINE_TUNING_TASK_LOG,
  FINE_TUNING_MANAGE_LIST,
  FINE_TUNING_DEMO,
  START_FIRST_TRAIN,
  FINE_TUNING_PUBLISH_DOWN
} from '@/constants/api'
import { request } from 'umi';

// export async function getModelList(params) {
//   return request(GET_ALL_MODEL, {
//     method: 'GET',
//     params
//   });
// };
export async function getModelListForFlow(params) {
  // return request(GET_ALL_MODEL_FOR_FLOW, {
  //   method: 'POST',
  //   params
  // });
};


export async function getSchemaByUrl(data) {
  return request(GET_SCHEMA, {
    method: 'GET',
    params: data
  });
};
