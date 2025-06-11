import { ReactComponent as LLMIcon } from '@/assets/useCenter/LLM.svg';
import { ReactComponent as EmbeddingIcon } from '@/assets/useCenter/EMBEDDING.svg';
import { ReactComponent as TextIcon } from '@/assets/useCenter/TextToSpeech.svg';
import { ReactComponent as VoiceIcon } from '@/assets/useCenter/SpeechToText.svg';
import { ReactComponent as VisionIcon } from '@/assets/useCenter/VISION.svg';
import { ReactComponent as DocIcon } from '@/assets/useCenter/DOCPARSER.svg';
import {SyncOutlined} from '@ant-design/icons';

//控制台
export const algorithmList = [
    { label: '皮尔逊相关系数', value: 'PEARSON_CORRELATION_COEFFICIENT' },
    { label: '余弦相似度', value: 'COSINE_SIMILARITY' },
    { label: '欧氏距离', value: 'EUCLIDEAN_DISTANCE' },
    { label: '曼哈顿距离', value: 'MANHATTAN_DISTANCE' },
];
export const langurangeList = [
    { label: '中文', value: 'chinese' },
    { label: '英文', value: 'english' },
];
export const timbreList = [
    // { label: '男', value: 'MALE' },
    { label: '女', value: 'FEMALE' },
];

export const markList = {
    0: '0',
    0.5: '0.5X',
    1: '1X',
    1.5: '1.5X',
    2: '2X',
}

export const logList = {
    user_login_frequency: 'LOGIN_USAGE',
    use_interface_frequency: 'MODEL_USAGE',
    model_num: 'MODEL_COUNT',
    memory_use: 'MEMORY_USAGE',
    gpu_use: 'GPU_USAGE',
    cpu_use:'CPU_USAGE'
}
export const logListAdmin = {
    user_login_frequency: 'LOGIN_USAGE',
    use_interface_frequency_all:'MODEL_USAGE_ALL',
    model_num_all: 'MODEL_COUNT_ALL',
    memory_use: 'MEMORY_USAGE',
    gpu_use: 'GPU_USAGE',
    cpu_use:'CPU_USAGE'
}

//固定字段参数
export const logParams=['LOGIN_USAGE','MODEL_USAGE_ALL','MODEL_COUNT_ALL','MEMORY_USAGE','GPU_USAGE','CPU_USAGE']

//模型管理
export const typeList = [
    {
      label: 'string',
      value: 'string'
    },
    {
      label: 'int',
      value: 'int'
    },
    {
      label: 'float',
      value: 'float'
    },
  ]

//提示词
export const originTypeList = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '创意写作',
      value: '1',
      color: 'processing'
    },
    {
      label: '生活助手',
      value: '2',
      color: 'success'
    },
    {
      label: '职场效率',
      value: '3',
      color: 'warning'
    },
    {
      label: '教育培训',
      value: '4',
      color: 'magenta'
    },
    {
      label: '代码编程',
      value: '5',
      color: 'geekblue'
    },
    {
      label: '其他',
      value: '6',
      color: 'volcano'
    },
];

//基础模型
export const modelTypeList = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '大语言模型',
      value: 'LLM',
    //   color: 'processing',
      icon: <LLMIcon/>
    },
    {
      label: '向量化模型',
      value: 'EMBEDDING',
    //   color: 'success',
      icon: <EmbeddingIcon/>
    },
    {
      label: '语音转文本',
      value: 'SpeechToText',
    //   color: 'success',
      icon: <VoiceIcon/>

    },
    {
      label: '文本转语音',
      value: 'TextToSpeech',
    //   color: 'success',
      icon: <TextIcon/>

    },
    {
      label: '视觉大模型',
      value: 'VISION',
    //   color: 'success',
      icon: <VisionIcon/>
    },
    {
      label: '文档解析',
      value: 'DOC_PARSER',
    //   color: 'success',
      icon: <DocIcon/>
    }
];

//基模型类型
export const baseType = {
    0:'base_model',
    1:'check_point'
}

//模型微调
export const modelTuningList = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '大语言模型',
      value: 'LLM',
      color: 'processing'
    },
    {
      label: '向量化模型',
      value: 'Embedding',
      color: 'success'
    }
];

//微调进度
export const tunningStatus = {
    99:{
        label:'待开始',
        color:'default'
    },
    98:{
        label:'已下线',
        color:'rgb(143 152 172)'
    },
    0:{
        label:'排队中',
        color:'blue'
    },
    1:{
        label:'训练中',
        color:'processing'
    } ,
    2:{
        label:'训练失败',
        color:'error'
    },
    3:{
        label:'训练成功',
        color:'success'
    },
    4:{
        label:'发布成功',
        color:'cyan'
    },
    5:{
        label:'训练中止',
        color:'warning'
    },
    6:{
        label:'评估中',
        color:'purple'
    },
    7:{
        label:'评估完成',
        color:'geekblue'
    },
    8:{
        label:'待评估',
        color:'lime'
    },
    9:{
        label:'评估失败',
        color:'red'
    },
    10:{
        label:'发布失败',
        color:'#cd201f'
    },
    11:{
        label:'发布中',
        color:'magenta'
    }
}

//评估--数据集
export const datasetList = [
    {
      label: 'cmmlu',
      value: 'cmmlu',      
    },
    {
      label: 'mmlu',
      value: 'mmlu',
    }
]
//评估--数据集
export const langList = [
    {
      label: 'en',
      value: 'en',      
    },
    {
      label: 'zh',
      value: 'zh',
    }
]

//数据集-状态
export const dataSetStatus = [
    {
        label: '全部状态',
        value: -1,
    },
    {
        label: '未识别',
        value: 0,
        color:'default'
    },
    {
        label: '已入库',
        value: 1,
        color:'processing',
    },
    {
        label: '识别中',
        value: 2,
        color:'success',
    },
    {
        label: '已识别',
        value: 3,
        color: 'success'
    },
    {
        label: '识别失败',
        value: 4,
        color: 'warning'
    },
    {
        label: '入库中',
        value: 5,
        color: 'processing',
    },
    {
        label: '入库失败',
        value: 6,
        color: 'error'
    }
]

export const dataSetStatusObj = {
    0:{
        label: '未识别',
        color:'default'
    },
    1:{ 
        label: '已入库',
        color:'processing'
    },
    2:{ 
        label: '识别中',
        color:'success',
        icon:<SyncOutlined spin/>
    },
    3:{ 
        label: '已识别',
        color:'success'
    },
    4:{
        label: '识别失败',
        color:'warning'
    },
    5:{
        label: '入库中',
        color:'processing',
        icon:<SyncOutlined spin/>
    },
    6:{
        label: '入库失败',
        color:'error'
    },
}
//示例
export const demo = {
    value:`[{
        "id": "1",
        "conversations": [{
            "from": "human",
            "value": "DingoDB（Data In And Go Processing）是一款开源
            的分布式、实时多模态向量数据库。请简述它的主要特点和
            优势。"
        },{
            "from": "gpt",
            "value": "DingoDB是一款开源的分布式、实时多模态向量数
            据库，它融合了数据湖和向量数据库的特点，为存储和分析
            各种类型的数据提供了完美解决方案。DingoDB能够轻松处
            理Key-Value、PDF、音频和视频等数据，并支持结构化和
            非结构化数据的存储、分析、科学计算、 高频Serving和
            OLAP分析。通过测试得出的数据和具体的遗留问题描述，
            DingoDB被评价为业界领先的多模向量数据库。"
        }]
}]`
} 
//工具
export const exampleDic = [
  {
    key: '1',
    label: '大语言模型(JSON)',
    type: 'JSON',
    value: `{
      "openapi": "3.1.0",
      "info": {
        "title": "llm-server",
        "description": "get llm response",
        "version": "v1.0.0"
      },
      "servers": [
        {
          "url": "http://10.220.11.12:9911"
        }
      ],
      "paths": {
          "/v1/chat/completions": {
            "post": {
                "summary": "Create Chat Completion",
                "operationId": "create_chat_completion_v1_chat_completions_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ChatCompletionRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ChatCompletionResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        }
      },
      "components": {
        "schemas": {
            "ChatCompletionRequest": {
                "properties": {
                    "model": {
                        "type": "string",
                        "title": "Model"
                    },
                    "messages": {
                        "items": {
                            "$ref": "#/components/schemas/ChatMessage"
                        },
                        "type": "array",
                        "title": "Messages"
                    },
                    "do_sample": {
                        "type": "boolean",
                        "title": "Do Sample",
                        "default": true
                    },
                    "temperature": {
                        "type": "number",
                        "title": "Temperature"
                    },
                    "top_p": {
                        "type": "number",
                        "title": "Top P"
                    },
                    "n": {
                        "type": "integer",
                        "title": "N",
                        "default": 1
                    },
                    "max_tokens": {
                        "type": "integer",
                        "title": "Max Tokens"
                    },
                    "stream": {
                        "type": "boolean",
                        "title": "Stream",
                        "default": false
                    }
                },
                "type": "object",
                "required": [
                    "model",
                    "messages"
                ],
                "title": "ChatCompletionRequest"
            },
            "ChatCompletionResponse": {
                "properties": {
                    "id": {
                        "type": "string",
                        "title": "Id",
                        "default": "chatcmpl-default"
                    },
                    "object": {
                        "type": "string",
                        "title": "Object",
                        "default": "chat.completion"
                    },
                    "created": {
                        "type": "integer",
                        "title": "Created"
                    },
                    "model": {
                        "type": "string",
                        "title": "Model"
                    },
                    "choices": {
                        "items": {
                            "$ref": "#/components/schemas/ChatCompletionResponseChoice"
                        },
                        "type": "array",
                        "title": "Choices"
                    },
                    "usage": {
                        "$ref": "#/components/schemas/ChatCompletionResponseUsage"
                    }
                },
                "type": "object",
                "required": [
                    "model",
                    "choices",
                    "usage"
                ],
                "title": "ChatCompletionResponse"
            },
            "ChatCompletionResponseChoice": {
                "properties": {
                    "index": {
                        "type": "integer",
                        "title": "Index"
                    },
                    "message": {
                        "$ref": "#/components/schemas/ChatMessage"
                    },
                    "finish_reason": {
                        "$ref": "#/components/schemas/Finish"
                    }
                },
                "type": "object",
                "required": [
                    "index",
                    "message",
                    "finish_reason"
                ],
                "title": "ChatCompletionResponseChoice"
            },
            "ChatCompletionResponseUsage": {
                "properties": {
                    "prompt_tokens": {
                        "type": "integer",
                        "title": "Prompt Tokens"
                    },
                    "completion_tokens": {
                        "type": "integer",
                        "title": "Completion Tokens"
                    },
                    "total_tokens": {
                        "type": "integer",
                        "title": "Total Tokens"
                    }
                },
                "type": "object",
                "required": [
                    "prompt_tokens",
                    "completion_tokens",
                    "total_tokens"
                ],
                "title": "ChatCompletionResponseUsage"
            },
            "ChatMessage": {
                "properties": {
                    "role": {
                        "$ref": "#/components/schemas/Role"
                    },
                    "content": {
                        "type": "string",
                        "title": "Content"
                    }
                },
                "type": "object",
                "required": [
                    "role",
                    "content"
                ],
                "title": "ChatMessage"
            },
            "EMBED": {
                "properties": {
                    "text": {
                        "type": "string",
                        "title": "Text"
                    }
                },
                "type": "object",
                "required": [
                    "text"
                ],
                "title": "EMBED"
            },
            "EMBEDS": {
                "properties": {
                    "texts": {
                        "items": {},
                        "type": "array",
                        "title": "Texts"
                    }
                },
                "type": "object",
                "required": [
                    "texts"
                ],
                "title": "EMBEDS"
            },
            "Finish": {
                "type": "string",
                "enum": [
                    "stop",
                    "length"
                ],
                "title": "Finish",
                "description": "An enumeration."
            },
            "HTTPValidationError": {
                "properties": {
                    "detail": {
                        "items": {
                            "$ref": "#/components/schemas/ValidationError"
                        },
                        "type": "array",
                        "title": "Detail"
                    }
                },
                "type": "object",
                "title": "HTTPValidationError"
            },
            "LLM": {
                "properties": {
                    "prompt": {
                        "type": "string",
                        "title": "Prompt"
                    },
                    "history": {
                        "items": {},
                        "type": "array",
                        "title": "History",
                        "default": []
                    },
                    "max_length": {
                        "type": "integer",
                        "title": "Max Length",
                        "default": 10000
                    },
                    "temperature": {
                        "type": "number",
                        "title": "Temperature",
                        "default": 0.01
                    },
                    "top_p": {
                        "type": "number",
                        "title": "Top P",
                        "default": 0.85
                    },
                    "do_sample": {
                        "type": "boolean",
                        "title": "Do Sample",
                        "default": true
                    },
                    "system": {
                        "type": "string",
                        "title": "System",
                        "default": ""
                    },
                    "n": {
                        "type": "integer",
                        "title": "N",
                        "default": 1
                    }
                },
                "type": "object",
                "required": [
                    "prompt"
                ],
                "title": "LLM"
            },
            "ModelCard": {
                "properties": {
                    "id": {
                        "type": "string",
                        "title": "Id"
                    },
                    "object": {
                        "type": "string",
                        "title": "Object",
                        "default": "model"
                    },
                    "created": {
                        "type": "integer",
                        "title": "Created"
                    },
                    "owned_by": {
                        "type": "string",
                        "title": "Owned By",
                        "default": "owner"
                    }
                },
                "type": "object",
                "required": [
                    "id"
                ],
                "title": "ModelCard"
            },
            "ModelList": {
                "properties": {
                    "object": {
                        "type": "string",
                        "title": "Object",
                        "default": "list"
                    },
                    "data": {
                        "items": {
                            "$ref": "#/components/schemas/ModelCard"
                        },
                        "type": "array",
                        "title": "Data",
                        "default": []
                    }
                },
                "type": "object",
                "title": "ModelList"
            },
            "Reranker": {
                "properties": {
                    "sentence_pairs": {
                        "anyOf": [
                            {
                                "items": {
                                    "items": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ],
                                    "type": "array",
                                    "maxItems": 2,
                                    "minItems": 2
                                },
                                "type": "array"
                            },
                            {
                                "items": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "string"
                                    }
                                ],
                                "type": "array",
                                "maxItems": 2,
                                "minItems": 2
                            }
                        ],
                        "title": "Sentence Pairs"
                    },
                    "batch_size": {
                        "type": "integer",
                        "title": "Batch Size",
                        "default": 256
                    },
                    "max_length": {
                        "type": "integer",
                        "title": "Max Length",
                        "default": 512
                    }
                },
                "type": "object",
                "required": [
                    "sentence_pairs"
                ],
                "title": "Reranker"
            },
            "Role": {
                "type": "string",
                "enum": [
                    "user",
                    "assistant",
                    "system"
                ],
                "title": "Role",
                "description": "An enumeration."
            },
            "ScoreEvaluationRequest": {
                "properties": {
                    "model": {
                        "type": "string",
                        "title": "Model"
                    },
                    "messages": {
                        "items": {
                            "type": "string"
                        },
                        "type": "array",
                        "title": "Messages"
                    },
                    "max_length": {
                        "type": "integer",
                        "title": "Max Length"
                    }
                },
                "type": "object",
                "required": [
                    "model",
                    "messages"
                ],
                "title": "ScoreEvaluationRequest"
            },
            "ScoreEvaluationResponse": {
                "properties": {
                    "id": {
                        "type": "string",
                        "title": "Id",
                        "default": "scoreeval-default"
                    },
                    "object": {
                        "type": "string",
                        "title": "Object",
                        "default": "score.evaluation"
                    },
                    "model": {
                        "type": "string",
                        "title": "Model"
                    },
                    "scores": {
                        "items": {
                            "type": "number"
                        },
                        "type": "array",
                        "title": "Scores"
                    }
                },
                "type": "object",
                "required": [
                    "model",
                    "scores"
                ],
                "title": "ScoreEvaluationResponse"
            },
            "ValidationError": {
                "properties": {
                    "loc": {
                        "items": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "type": "array",
                        "title": "Location"
                    },
                    "msg": {
                        "type": "string",
                        "title": "Message"
                    },
                    "type": {
                        "type": "string",
                        "title": "Error Type"
                    }
                },
                "type": "object",
                "required": [
                    "loc",
                    "msg",
                    "type"
                ],
                "title": "ValidationError"
            }
        }
      }
    } 
`
  },
  {
    key: '2',
    label: '空白模板',
    type: 'blank',
    value: `{
      "openapi": "3.1.0",
      "info": {
        "title": "Untitled",
        "description": "Your OpenAPI specification",
        "version": "v1.0.0"
      },
      "servers": [
        {
          "url": ""
        }
      ],
      "paths": {},
      "components": {
        "schemas": {}
      }
    }`
  }
];

