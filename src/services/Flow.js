import {
  FLOW_LIST,
  NODE_LIST,
  VALIDATE_PROMPT,
  VALIDATE_CODE,
  FLOW_PARAMS,
  FLOW_DEMO,
  DATA_MANAGE_DATASET_LIST_ALL,
  FLOW_PROCESS,
  FOR_FLOW,
  FLOW_ITEM,
  OPERATORS_PARAMS
} from '@/constants/api'
import { request } from 'umi';



//getRunUrl
export async function getTestRunUrl() {
  // return request(FLOW_DEMO, {
  //   method: 'GET'
  // });
}

export async function testRun(id, data) {
  return request(`${FLOW_PROCESS}?id=${id}`, {
    method: 'POST',
    // headers: {
    //   Authorization: `Bearer ${auth}`
    // },
    data
  });
}

//for flow节点列表
export async function getDatasetForFlow() {
  // return request(FOR_FLOW, {
  //   method: 'GET'
  // });
}
//节点列表
export async function getNodeList() {
  return request(NODE_LIST, {
    method: 'GET'
  });
}
//工作流列表
export async function getFlowList() {
  return request(FLOW_LIST, {
    method: 'GET'
  });
}
//创建编辑
export async function createAndEditFlow(data) {
  const postData = { ...data };
  const { id } = postData;
  delete postData.id;
  return request(FLOW_LIST + (id ? `${id}` : ''), {
    method: id ? 'PATCH' : 'POST',
    data: postData,
  });
}
//验证
export async function validatePrompt(data) {
  return request(VALIDATE_PROMPT, {
    method: 'POST',
    data,
  });
}
//验证
export async function validateCode(data) {
  return request(VALIDATE_CODE, {
    method: 'POST',
    data,
  });
}
//删除
export async function getFlow(flow_id) {
  return request(FLOW_LIST + flow_id, {
    method: 'GET',
  });
}
//删除
export async function deleteFlow(flow_id) {
  return request(FLOW_LIST + flow_id, {
    method: 'DELETE',
  });
}

//工作流参数
export async function getFlowParams(flow_id) {
  return request(FLOW_PARAMS.replace('flow_id', flow_id), {
    method: 'GET',
  });
}

//列表
export async function getDatasetList() {
  // return request(DATA_MANAGE_DATASET_LIST_ALL, {
  //   method: 'GET',
  //   // data: data
  // });
}

//算子
export async function getOperatorsList() {
  return request(OPERATORS_PARAMS, {
    method: 'GET',
  });
}
//工作流
export async function operateFlowItem(flow_id,method,data) {
  return request(FLOW_PARAMS.replace('flow_id', flow_id), {
    method: method,
    data: data
  });
}