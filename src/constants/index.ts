declare global {
  // define
  const BASE_URL: string;
}

import { ReactComponent as ChainsIcon } from "@/assets/flowIcon/chains.svg";
import { ReactComponent as MemoriesIcon } from "@/assets/flowIcon/memories.svg";
import { ReactComponent as EmbeddingsIcon } from "@/assets/flowIcon/embeddings.svg";
import { ReactComponent as InputIcon } from "@/assets/flowIcon/input.svg";
import { ReactComponent as PromptsIcon } from "@/assets/flowIcon/prompts.svg";
import { ReactComponent as TextSplittersIcon } from "@/assets/flowIcon/textSplitters.svg";
import { ReactComponent as VectorStoresIcon } from "@/assets/flowIcon/vectorStores.svg";
import { ReactComponent as LlmsIcon } from "@/assets/flowIcon/llms.svg";
import { ReactComponent as LoadersIcon } from "@/assets/flowIcon/loaders.svg";
import { ReactComponent as PluginsIcon } from "@/assets/flowIcon/plugins.svg";
import { ReactComponent as AgentIcon } from "@/assets/flowIcon/agent.svg";
import { ReactComponent as ToolsIcon } from "@/assets/flowIcon/tools.svg";
import { ReactComponent as ToolkitsIcon } from "@/assets/flowIcon/toolkits.svg";
import { ReactComponent as RetrieversIcon } from "@/assets/flowIcon/retrievers.svg";
import { ReactComponent as UtilitiesIcon } from "@/assets/flowIcon/utilities.svg";
import { ReactComponent as OutputIcon } from "@/assets/flowIcon/output.svg";
import { ReactComponent as WrappersIcon } from "@/assets/flowIcon/wrappers.svg";
import { ReactComponent as AutoGenIcon } from "@/assets/flowIcon/autogen_roles.svg";

//flow

export const nodeColors: { [char: string]: string } = {
  agents: "#FAAD14",
  chains: "#722ED1",
  documentloaders: "#13C2C2",
  embeddings: "#52C41A",
  input_output: "#EB2F96",
  llms: "#FA8C16",
  memories: "#2F54EB",
  output_parsers: "#FADB14",
  prompts: "#FA541C",
  retrievers: "#1677FF",
  textsplitters: "#A0D911",
  toolkits: "#AE9158",
  tools: "#7A6C8D",
  utilities: "#6DA2A2",
  vectorstores: "#F5222D",
  wrappers: "#4D5494",
  autogen_roles: "#4D945D",
  unknown: "#A7A7A7",

  // advanced: "#000000",
  // chat: "#198BF6",
  // thought: "#272541",
  // str: "#049524",
  start: "#FAAD14",
  end: "#722ED1",
  plugin: "#FA541C",
  call_link: "#FA541C",
  llm: "#FA8C16",
  call_model: "#FA8C16",
  code: "#13C2C2",
  retrieval: "#52C41A",
  workflow: "#EB2F96",
  condition: "#1677FF",
  intentRecognition: "#A0D911",
  textProcessing: "#AE9158",
  message: "#7A6C8D",
  question: "#6DA2A2",
  variable: "#F5222D",
  database: "#4D5494",
};
export const nodeColors2: { [char: string]: string } = {
  start: "rgba(250, 173, 20,opacity)",
  end: "rgba(114, 46, 209,opacity)",
  plugin: "rgba(250, 84, 28,opacity)",
  call_link: "rgba(250, 84, 28,opacity)",
  llm: "rgba(250, 140, 22,opacity)",
  call_model: "rgba(250, 140, 22,opacity)",
  code: "rgba(19, 194, 194,opacity)",
  retrieval: "rgba(82, 196, 26,opacity)",
  workflow: "rgba(235, 47, 150,opacity)",
  if_condition: "rgba(22, 119, 255,opacity)",
  intentRecognition: "rgba(160, 217, 17,opacity)",
  textProcessing: "rgba(174, 145, 88,opacity)",
  message: "rgba(122, 108, 141,opacity)",
  question: "rgba(109, 162, 162,opacity)",
  variable: "rgba(245, 34, 45,opacity)",
  database: "rgba(77, 84, 148,opacity)",

  unknown: "rgba(167, 167, 167,opacity)",
};

export const nodeNames: { [char: string]: string } = {
  prompts: "提示词/Prompts",
  llms: "语言模型/LLMs",
  chains: "工作链/Chains",
  agents: "代理/Agents",
  tools: "工具/Tools",
  memories: "记忆器/Memories",
  advanced: "Advanced/Advanced",
  chat: "Chat/Chat",
  embeddings: "嵌入器/Embeddings",
  documentloaders: "装载器/Loaders",
  vectorstores: "向量存储/VectorStores",
  toolkits: "工具箱/Toolkits",
  wrappers: "Wrappers",
  textsplitters: "文本分割/TextSplitters",
  retrievers: "检索器/Retrievers",
  input_output: "输入/input",
  utilities: "通用工具/Utilities",
  output_parsers: "输出解析器/OutputParsers",
  autogen_roles: "autogen_roles",
  unknown: "其他/Other",

  start: "开始/Start",
  end: "结束/End",
  call_model: "调用模型/Call Model",
  plugin: "工具/Tools",
  llm: "语言模型/LLM",
  code: "代码/Code",
  retrieval: "知识库/Retrieval",
  workflow: "工作流/Workflow",
  if_condition: "条件/Condition",
  intentRecognition: "意图识别/Intent Recognition",
  textProcessing: "文本处理/Text Processing",
  message: "消息/Message",
  question: "问题/Question",
  variable: "变量/Variable",
  database: "数据库/Database",
};

export const nodeIcons = {
  prompts: PromptsIcon,
  chains: ChainsIcon,
  llms: LlmsIcon,
  agents: AgentIcon,
  tools: ToolsIcon,
  memories: MemoriesIcon,
  embeddings: EmbeddingsIcon,
  documentloaders: LoadersIcon,
  vectorstores: VectorStoresIcon,
  toolkits: ToolkitsIcon,
  wrappers: WrappersIcon,
  textsplitters: TextSplittersIcon,
  retrievers: RetrieversIcon,
  input_output: InputIcon,
  utilities: UtilitiesIcon,
  output_parsers: OutputIcon,
  autogen_roles: AutoGenIcon,
  unknown: PluginsIcon,

  start: PromptsIcon,
  end: ChainsIcon,
  plugin: PluginsIcon,
  call_link: PluginsIcon,
  call_model: LlmsIcon,
  llm: LlmsIcon,
  code: LoadersIcon,
  retrieval: VectorStoresIcon,
  workflow: EmbeddingsIcon,
  if_condition: RetrieversIcon,
  intentRecognition: TextSplittersIcon,
  textProcessing: ToolkitsIcon,
  message: ToolsIcon,
  question: UtilitiesIcon,
  variable: OutputIcon,
  database: WrappersIcon,
};

export const fieldOptions = [
  {
    label:'String',
    value:'str'
  },
  {
    label:'Integer',
    value:'integer'
  },
  {
    label:'Boolean',
    value:'boolean'
  },
  {
    label:'Number',
    value:'number'
  },
  {
    label:'Object',
    value:'object'
  },
  {
    label:'Array<String>',
    value:'array<string>'
  },
  {
    label:'Array<Integer>',
    value:'array<integer>'
  },
  {
    label:'Array<Boolean>',
    value:'array<boolean>'
  },
  {
    label:'Array<Number>',
    value:'array<number>'
  },
  {
    label:'Array<Object>',
    value:'array<object>'
  },
]
export const ConditionOptions = [
  {
    label:'equal',
    value:'equal'
  },
  {
    label:'not equal',
    value:'not equal'
  },
  {
    label:'longer than',
    value:'longer than'
  },
  {
    label:'longer than or equal',
    value:'longer than or equal'
  },
  {
    label:'shorter than',
    value:'shorter than'
  },
  {
    label:'shorter than or equal',
    value:'shorter than or equal'
  },
  {
    label:'contain',
    value:'contain'
  },
  {
    label:'not contain',
    value:'not contain'
  },
  {
    label:'is empty',
    value:'is empty'
  },
  {
    label:'is not empty',
    value:'is not empty'
  },
]

export const menuType = {
  menu: {
    text: "菜单",
    color: "magenta",
  },
  element: {
    text: "页面元素",
    color: "orange",
  },
  dataset: {
    text: "数据集",
    color: "green",
  },
  creativity: {
    text: "创意",
    color: "cyan",
  },
  app: {
    text: "应用",
    color: "geekblue",
  },
};

export const menuOptions = [
  {
    label: "菜单",
    value: "menu",
  },
  {
    label: "数据集",
    value: "dataset",
  },
  {
    label: "创意",
    value: "creativity",
  },
  {
    label: "应用",
    value: "app",
  },
];
export const authOptions = [
  {
    label: "菜单",
    value: "menu",
  },
];

export const operation_type = {
  menu: "菜单",
  element: "页面元素",
  dataset: "数据集",
  creativity: "创意",
  app: "应用",
};

export const auth_type = {
  menu: "菜单",
  element: "页面元素",
};
