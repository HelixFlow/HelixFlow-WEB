import { request } from 'umi';
import {
  DATA_MANAGE_DATASET_LIST_ALL,
  DATA_MANAGE_DATASET_LIST,
  DATA_MANAGE_DATASET,
  DATA_MANAGE_DATASET_FILE_UPLOAD,
  DATA_MANAGE_DATASET_FILE_LIST,
  DATA_MANAGE_DATASET_FILE_SPLIT,
  DATA_MANAGE_FILE_PROGRESS,
  DATA_MANAGE_FILE_APPROVE_MULTIPLE,
  DATA_MANAGE_SPLIT_RESULT,

  DATA_MANAGE_RECALL_HISTORY, //召回
  DATA_MANAGE_RECALL_TEST_LIST,
  DATA_MANAGE_FILE_UPLOAD_MULTIPLE,
} from '@/constants/api'


//数据集
//列表
export async function getDatasetList() {
  // return request(DATA_MANAGE_DATASET_LIST_ALL, {
  //   method: 'GET',
  //   // data: data
  // });
}
//列表分页
export async function getPageDatasetList(data) {
  return request(DATA_MANAGE_DATASET_LIST, {
    method: 'POST',
    data
  });
}

//查询单个数据集
export async function getDatasetDetail(id) {
  return request(DATA_MANAGE_DATASET, {
    method: 'GET',
    params: {
      dataset_id:id
    }
  });
}

//新建
export async function addDataset(data) {
  return request(DATA_MANAGE_DATASET, {
    method: 'POST',
    data: data,
  });
}
//更新
export async function updateDataset(data) {
  return request(DATA_MANAGE_DATASET, {
    method: 'PUT',
    data: data
  });
}
//删除
export async function deleteDataset(id) {
  return request(DATA_MANAGE_DATASET, {
    method: 'DELETE',
    params: {
      dataset_id:id
    }
  });
}

//上传file
export async function uploadDataFile(dataset_id, data) {
  return request(DATA_MANAGE_DATASET_FILE_UPLOAD, {
    method: 'POST',
    params: {
      dataset_id
    },
    data: data
  });
}

//文件数据列表
export async function getDataList(data) {
  return request(DATA_MANAGE_DATASET_FILE_LIST, {
    method: 'POST',
    data
  });
}

//文件拆分
export async function splitDataFile(data) {
  return request(DATA_MANAGE_DATASET_FILE_SPLIT, {
    method: 'POST',
    data: data
  });
}

export async function getFileProgress(data) {
  return request(DATA_MANAGE_FILE_PROGRESS, {
    method: 'POST',
    params: data
  });
}

//文件入库
export async function approveFileMultiple(data) {
  return request(DATA_MANAGE_FILE_APPROVE_MULTIPLE, {
    method: 'POST',
    data
  });
}

//删除文件
export async function deleteDataFile(file_id) {
  return request(DATA_MANAGE_DATASET_FILE_UPLOAD, {
    method: 'DELETE',
    params: {
      file_id
    }
  });
}

//拆分结果 ---- 查看
export async function splitResult(file_id) {
  return request(DATA_MANAGE_SPLIT_RESULT, {
    method: 'GET',
    params: {
      file_id
    }
  });
}


//批量导入
export async function uploadFileMultiple(data) {
  return request(DATA_MANAGE_FILE_UPLOAD_MULTIPLE, {
    method: 'POST',
    data
  });
}

//召回测试

//测试
export async function hitTest(data){
  return request(DATA_MANAGE_RECALL_TEST_LIST, {
    method: 'POST',
    data
  });
}
//历史记录
export async function hitTestHistory(dataset_id){
  return request(DATA_MANAGE_RECALL_HISTORY, {
    method: 'GET',
    params: {
      dataset_id
    },
  });
}











