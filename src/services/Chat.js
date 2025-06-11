import { 
  LLM_CODE,
  LLM_ASK,
  EMBEDDING_CODE,
  EMB_ASK,
  VOICE_ASK,
  TEXT_ASK,
  VISION_ASK
} from '@/constants/api'
import { request } from 'umi';

export async function getLLMCode(data) {
  return request(LLM_CODE, {
    method: 'POST',
    data
  });
};
export async function getEmbeddingCode(data) {
  return request(EMBEDDING_CODE, {
    method: 'POST',
    data
  });
}

export async function getChatAsk(data) {
  return request(LLM_ASK, {
    // headers:{
    //   'Authorization': `Bearer ${key}`
    // },
    method: 'POST',
    data
  });
}

export async function getEmbAsk(data) {
  return request(EMB_ASK, {
    // headers:{
    //   'Authorization': `Bearer ${key}`
    // },
    method: 'POST',
    data
  });
}

//语音转文本
export async function voiceToText(data) {
  const {model,language,file} = data;
  // ?model=${model}&lan
  let formData = new FormData();
  formData.append('file', file);
  return request(`${VOICE_ASK}`, {
    // headers:{
    //   'Authorization': `Bearer ${key}`
    // },
    method: 'POST',
    data:formData,
    params:{model,language}
  });
}

//文本转语音
export async function textToVoice(tdata) {
  const {model,voice,speed,text} = tdata; 
  return request(TEXT_ASK, {
    // headers:{
    //   'Authorization': `Bearer ${key}`
    // },
    method: 'POST',
    data:{model,voice,speed,text},
    responseType:'blob',
    credentials: 'include',
    getResponse: true
  });
}

//多模态
export async function getVisionAsk(data) {
  // const {postObj,imageFile} = data;
  // let formData = new FormData();
  // formData.append('openAIChatTextRequest ', {});
  // formData.append('image', imageFile);
  return request(VISION_ASK, {
    method: 'POST',
    data,
    // params:formData
  });
}