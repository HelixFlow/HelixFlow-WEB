const server = {
  api: "/helixflow",
};
const ModuleKey = {
  auth: server.api + "/user",
  flow: server.api + "/flows",
  operators: server.api + "/operators",
};

//账号
export const LOGIN = `${ModuleKey.auth}/login`; // 登录
// export const LOGOUT = `${ModuleKey.auth}/user/logout`; // 登出
export const LOGOUT = `${ModuleKey.auth}/logout`; // 登出对接
export const REGISTER = `${ModuleKey.auth}/register`; // 注册
export const USER_GET = `${ModuleKey.auth}/info`; // 获取我的

//流程
export const FLOW_PROCESS = `${ModuleKey.flow}/process`; // 节点列表
export const NODE_LIST = `${ModuleKey.flow}/all`; // 节点列表
export const FLOW_LIST = `${ModuleKey.flow}/`; // flow列表 创建 编辑 删除 详情
export const FLOW_ITEM = `${ModuleKey.flow}/flow_id`; // flow列表 创建 编辑 删除 详情
export const VALIDATE_PROMPT = `${ModuleKey.flow}/validate/prompt`; // 提示词
export const VALIDATE_CODE = `${ModuleKey.flow}/validate/code`; //  code
export const FLOW_PARAMS = `${ModuleKey.flow}/flow_id/params`; //  获取flow参数
export const OPERATORS_PARAMS = `${ModuleKey.operators}/all`; //  算子列表


export const FLOW_DEMO = `${ModuleKey.flow}/manage/flow_demo`; //LLM模型对话