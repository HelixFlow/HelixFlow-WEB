import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Empty,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import {
  ApartmentOutlined,
  ApiOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  LinkOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RobotOutlined,
  SaveOutlined,
  UploadOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import './index.less';
import {
  createBusinessAnalysisRun,
  createTableAsset,
  deleteTableAsset,
  getTableAssets,
  ingestKnowledge,
  parseDDL,
  updateTableAsset,
} from '@/services/BusinessAnalysis';
import { createAndEditFlow, getFlowList } from '@/services/Flow';

const { TextArea } = Input;
const { Text } = Typography;

const DIALECT_OPTIONS = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Oracle', value: 'oracle' },
  { label: '达梦', value: 'dameng' },
  { label: 'TDSQL', value: 'tdsql' },
];

const CONNECTOR_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Kafka', value: 'kafka' },
  { label: 'Upsert Kafka', value: 'upsert-kafka' },
  { label: 'Hudi', value: 'hudi' },
  { label: 'Hive', value: 'hive' },
];

const DEFAULT_DDL = `CREATE TABLE order_info (
  order_id BIGINT NOT NULL COMMENT '订单ID',
  user_id BIGINT COMMENT '用户ID',
  pay_amount DECIMAL(18,2) COMMENT '支付金额',
  event_time DATETIME NOT NULL COMMENT '事件时间',
  PRIMARY KEY (order_id)
) COMMENT='订单表';`;

const TEMPLATE_EXAMPLES = {
  kafka: `CREATE TABLE ${'${table_name}'} (
  ${'${fields}'},
  WATERMARK FOR ${'${event_time_field}'} AS ${'${event_time_field}'} - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  'properties.bootstrap.servers' = '${'${bootstrap_servers}'}',
  'topic' = '${'${topic}'}',
  'properties.group.id' = '${'${group_id}'}',
  'scan.startup.mode' = 'latest-offset',
  'format' = 'json',
  'json.ignore-parse-errors' = 'true'
);`,
  'upsert-kafka': `CREATE TABLE ${'${table_name}'} (
  ${'${fields}'},
  PRIMARY KEY (${'${primary_key}'}) NOT ENFORCED
) WITH (
  'connector' = 'upsert-kafka',
  'properties.bootstrap.servers' = '${'${bootstrap_servers}'}',
  'topic' = '${'${topic}'}',
  'key.format' = 'json',
  'value.format' = 'json'
);`,
  hudi: `CREATE TABLE ${'${table_name}'} (
  ${'${fields}'}
) WITH (
  'connector' = 'hudi',
  'path' = '${'${path}'}',
  'table.type' = 'COPY_ON_WRITE'
);`,
  hive: `CREATE TABLE ${'${table_name}'} (
  ${'${fields}'}
) WITH (
  'connector' = 'filesystem',
  'path' = '${'${path}'}',
  'format' = 'parquet'
);`,
};

const unwrap = (res) => {
  const payload = res?.data && Object.prototype.hasOwnProperty.call(res.data, 'code') ? res.data : res;
  if (payload?.code && payload.code !== 200) {
    throw new Error(payload.msg || '请求失败');
  }
  return payload?.data ?? payload;
};

const sqlBlock = (value, className = '') => (
  <pre className={`baCodeBlock ${className}`}>
    <code>{value || '-- 暂无内容'}</code>
  </pre>
);

const toAssetPayload = (asset) => {
  const {
    id,
    create_time,
    update_time,
    risks,
    ...payload
  } = asset || {};
  return payload;
};

const isAgentFlowCandidate = (flow) => {
  const text = `${flow?.name || ''} ${flow?.description || ''}`.toLowerCase();
  return ['agent', 'rag', 'knowledge', 'call_model', '业务', '知识', '分析'].some((keyword) => text.includes(keyword));
};

const field = (name, displayName, value, options = {}) => ({
  name,
  display_name: displayName,
  field_type: options.fieldType || (options.type === 'number' ? 'number' : 'str'),
  display_type: options.displayType || (options.type === 'textarea' || options.type === 'number' ? options.type : 'text'),
  required: options.required ?? true,
  show: options.show ?? true,
  value,
  reference: options.reference || false,
  editable: options.editable ?? true,
  description: options.description || '',
});

const buildAgentTemplateData = ({ milvusUri, collectionName, knowledgeBaseUrl, embeddingModel, llmModel, ragTopK }) => ({
  nodes: [
    {
      id: 'start',
      type: 'genericNode',
      position: { x: 80, y: 180 },
      data: {
        name: 'start',
        display_name: 'start',
        description: '开始节点，输入业务需求',
        input: [field('output', '业务问题', '统计每分钟各城市支付成功 GMV 和支付订单数')],
        output: null,
        params: null,
      },
    },
    {
      id: 'knowledge_1',
      type: 'genericNode',
      position: { x: 360, y: 180 },
      data: {
        name: 'knowledge',
        display_name: 'knowledge_1',
        description: '从 Milvus 召回表语义、字段说明、业务规则和 Flink 模板',
        input: [field('question', 'question', 'start/output', { reference: true })],
        output: [field('answer', 'answer', '', { editable: false })],
        params: [
          field('prompts', 'prompts', '请根据以下业务问题召回表资产、字段说明、业务规则和 Flink 模板：{{question}}', { type: 'textarea' }),
          field('model_name', 'model', embeddingModel),
          field('openai_api_key', 'api_key', ''),
          field('openai_api_base', 'api_base', knowledgeBaseUrl),
          field('vector_url', 'milvus_uri', milvusUri),
          field('collection_name', 'collection', collectionName),
          field('top_k', 'top_k', ragTopK, { type: 'number' }),
        ],
      },
    },
    {
      id: 'call_model_1',
      type: 'genericNode',
      position: { x: 660, y: 180 },
      data: {
        name: 'call_model',
        display_name: 'call_model_1',
        description: '根据召回上下文生成 FlinkSQL 与风险建议',
        input: [field('question', 'question', 'knowledge_1/answer', { reference: true })],
        output: [field('answer', 'answer', '', { editable: false })],
        params: [
          field('prompts', 'prompts', '你是实时数仓架构师，请根据以下召回内容生成 FlinkSQL、字段映射、TTL/维表/资源建议和风险：\n{question}', { type: 'textarea' }),
          field('model_name', 'model', llmModel),
          field('openai_api_key', 'api_key', ''),
          field('openai_api_base', 'api_base', knowledgeBaseUrl),
        ],
      },
    },
    {
      id: 'end',
      type: 'genericNode',
      position: { x: 960, y: 180 },
      data: {
        name: 'end',
        display_name: 'end',
        description: '输出最终报告',
        input: null,
        output: [field('input', '最终结果', 'call_model_1/answer', { reference: true, editable: false })],
        params: null,
      },
    },
  ],
  edges: [
    { id: 'start-knowledge_1', source: 'start', target: 'knowledge_1', sourceHandle: 'output', targetHandle: 'question' },
    { id: 'knowledge_1-call_model_1', source: 'knowledge_1', target: 'call_model_1', sourceHandle: 'answer', targetHandle: 'question' },
    { id: 'call_model_1-end', source: 'call_model_1', target: 'end', sourceHandle: 'answer', targetHandle: 'input' },
  ],
});

const buildImageTemplateData = ({ knowledgeBaseUrl }) => ({
  nodes: [
    {
      id: 'start',
      type: 'genericNode',
      position: { x: 80, y: 180 },
      data: {
        name: 'start',
        display_name: 'start',
        description: '开始节点，输入画图需求',
        input: [field('output', '画图需求', '画一张极简实时数仓架构图，包含 Kafka、Flink、Redis 维表和结果主题')],
        output: null,
        params: null,
      },
    },
    {
      id: 'draw_image_1',
      type: 'genericNode',
      position: { x: 380, y: 180 },
      data: {
        name: 'draw_image',
        display_name: 'draw_image_1',
        description: '根据前置提示词生成图片',
        input: [field('prompt', 'prompt', 'start/output', { reference: true })],
        output: [field('answer', 'image', '', { editable: false })],
        params: [
          field('prompts', 'prompts', '请生成一张干净、极简、适合汇报的技术架构图：{prompt}', { type: 'textarea' }),
          field('model_name', 'model', 'gpt-image-1'),
          field('openai_api_key', 'api_key', ''),
          field('openai_api_base', 'api_base', knowledgeBaseUrl),
          field('size', 'size', '1024x1024'),
          field('quality', 'quality', 'auto'),
          field('output_format', 'format', 'png'),
          field('response_format', 'response', 'b64_json'),
        ],
      },
    },
    {
      id: 'end',
      type: 'genericNode',
      position: { x: 680, y: 180 },
      data: {
        name: 'end',
        display_name: 'end',
        description: '输出图片 URL 或 data URL',
        input: null,
        output: [field('input', '图片结果', 'draw_image_1/answer', { reference: true, editable: false })],
        params: null,
      },
    },
  ],
  edges: [
    { id: 'start-draw_image_1', source: 'start', target: 'draw_image_1', sourceHandle: 'output', targetHandle: 'prompt' },
    { id: 'draw_image_1-end', source: 'draw_image_1', target: 'end', sourceHandle: 'answer', targetHandle: 'input' },
  ],
});

export default () => {
  const [dialect, setDialect] = useState('mysql');
  const [ddlText, setDdlText] = useState(DEFAULT_DDL);
  const [requirement, setRequirement] = useState('统计每分钟订单支付金额，并按用户维度关联分析。');
  const [connectorPreference, setConnectorPreference] = useState('auto');
  const [bootstrapServers, setBootstrapServers] = useState('localhost:9092');
  const [topicPrefix, setTopicPrefix] = useState('ods');
  const [parsedTable, setParsedTable] = useState(null);
  const [tableAssets, setTableAssets] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [savedTableId, setSavedTableId] = useState(null);
  const [analysisRun, setAnalysisRun] = useState(null);
  const [knowledgeKey, setKnowledgeKey] = useState('');
  const [knowledgeBaseUrl, setKnowledgeBaseUrl] = useState('https://api.openai.com/v1');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [useAgentRag, setUseAgentRag] = useState(true);
  const [milvusUri, setMilvusUri] = useState('http://127.0.0.1:19530');
  const [collectionName, setCollectionName] = useState('business_assets');
  const [templateConnector, setTemplateConnector] = useState('kafka');
  const [templateContent, setTemplateContent] = useState(TEMPLATE_EXAMPLES.kafka);
  const [ragTopK, setRagTopK] = useState(6);
  const [agentFlows, setAgentFlows] = useState([]);
  const [selectedAgentFlowId, setSelectedAgentFlowId] = useState();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepsCollapsed, setStepsCollapsed] = useState(false);
  const [pipelineCollapsed, setPipelineCollapsed] = useState(false);
  const resultCanvasRef = useRef(null);

  const result = analysisRun?.result || {};
  const sourceTables = result?.source_tables || [];
  const risks = result?.risks || [];
  const connectorTemplate = result?.selected_connector_templates?.[0];
  const agentTrace = result?.agent_trace || {};
  const resultReady = Boolean(analysisRun);

  useEffect(() => {
    refreshAssets();
    refreshAgentFlows();
  }, []);

  const refreshAssets = () => {
    getTableAssets()
      .then((res) => setTableAssets(unwrap(res) || []))
      .catch((err) => message.error(err.message || '获取表资产失败'));
  };

  const refreshAgentFlows = () => {
    getFlowList()
      .then((res) => {
        const data = unwrap(res);
        const flows = data?.flows || data || [];
        const sortedFlows = [...flows].sort((left, right) => Number(isAgentFlowCandidate(right)) - Number(isAgentFlowCandidate(left)));
        setAgentFlows(sortedFlows);
        setSelectedAgentFlowId((current) => current || sortedFlows.find(isAgentFlowCandidate)?.id || sortedFlows[0]?.id);
      })
      .catch(() => {
        setAgentFlows([]);
      });
  };

  const openAgentBuilder = () => {
    history.push('/buildApp');
  };

  const openSelectedAgentFlow = () => {
    if (!selectedAgentFlowId) {
      openAgentBuilder();
      return;
    }
    history.push(`/buildApp/buildDetail?id=${selectedAgentFlowId}`);
  };

  const createAgentTemplateFlow = (templateType = 'rag') => {
    const isImageTemplate = templateType === 'image';
    const flowName = `${isImageTemplate ? 'imageFlow' : 'bizAgent'}${String(Date.now()).slice(-6)}`;
    setLoading(true);
    createAndEditFlow({
      name: flowName,
      description: isImageTemplate
        ? 'Image generation template: draw_image'
        : 'Business Analyzer Agent RAG template: knowledge -> call_model',
      status: 1,
      data: isImageTemplate ? buildImageTemplateData({
        knowledgeBaseUrl,
      }) : buildAgentTemplateData({
        milvusUri,
        collectionName,
        knowledgeBaseUrl,
        embeddingModel,
        llmModel,
        ragTopK,
      }),
    })
      .then((res) => {
        const flow = unwrap(res);
        message.success(isImageTemplate ? '已创建画图模板工作流' : '已创建并选中 RAG 模板工作流');
        setAgentFlows((flows) => [flow, ...flows]);
        if (!isImageTemplate) {
          setSelectedAgentFlowId(flow?.id);
        }
      })
      .catch((err) => message.error(err.message || '创建模板失败'))
      .finally(() => setLoading(false));
  };

  const useExistingAsset = (asset) => {
    if (!asset) return;
    setSavedTableId(asset.id);
    setParsedTable(asset);
    setDialect(asset.dialect || 'mysql');
    if (asset.raw_ddl) {
      setDdlText(asset.raw_ddl);
    }
  };

  const onDeleteAsset = (asset) => {
    setLoading(true);
    deleteTableAsset(asset.id)
      .then(() => {
        message.success('表资产已删除');
        setTableAssets((items) => items.filter((item) => item.id !== asset.id));
        setSelectedTableIds((ids) => ids.filter((id) => id !== asset.id));
        if (savedTableId === asset.id) {
          setSavedTableId(null);
          setParsedTable(null);
        }
      })
      .catch((err) => message.error(err.message || '删除表资产失败'))
      .finally(() => setLoading(false));
  };

  const onParseDDL = () => {
    setLoading(true);
    parseDDL({ dialect, raw_ddl: ddlText })
      .then((res) => {
        const data = unwrap(res);
        setParsedTable(data);
        setSavedTableId(null);
        message.success('DDL 解析完成');
        setCurrentStep(1);
      })
      .catch((err) => message.error(err.message || 'DDL 解析失败'))
      .finally(() => setLoading(false));
  };

  const onSaveAsset = () => {
    if (!parsedTable) {
      message.info('请先解析 DDL');
      return;
    }
    setLoading(true);
    const sameNameAsset = tableAssets.find((asset) => asset.table_name === parsedTable.table_name);
    const activeAsset = tableAssets.find((asset) => asset.id === savedTableId);
    const targetAssetId = activeAsset?.table_name === parsedTable.table_name
      ? activeAsset.id
      : sameNameAsset?.id;
    const request = targetAssetId
      ? updateTableAsset(targetAssetId, toAssetPayload(parsedTable))
      : createTableAsset(toAssetPayload(parsedTable));
    request
      .then((res) => {
        const asset = unwrap(res);
        setSavedTableId(asset.id);
        setParsedTable(asset);
        setSelectedTableIds((ids) => Array.from(new Set([...ids, asset.id])));
        refreshAssets();
        message.success(targetAssetId ? '表资产已更新' : '表资产已保存');
        setCurrentStep(2);
      })
      .catch((err) => message.error(err.message || '保存表资产失败'))
      .finally(() => setLoading(false));
  };

  const onIngestKnowledge = () => {
    const targetTableId = selectedTableIds.includes(savedTableId) ? savedTableId : selectedTableIds[0];
    if (!targetTableId && !parsedTable) {
      message.info('请先保存表资产，或至少解析一份 DDL');
      return;
    }
    const payload = targetTableId
      ? {
        doc_type: 'table_asset',
        table_id: targetTableId,
        milvus_uri: milvusUri,
        collection_name: collectionName,
        openai_api_key: knowledgeKey || undefined,
        openai_api_base: knowledgeBaseUrl,
        embedding_model: embeddingModel,
      }
      : {
        doc_type: 'table_asset',
        content: JSON.stringify(parsedTable, null, 2),
        milvus_uri: milvusUri,
        collection_name: collectionName,
        openai_api_key: knowledgeKey || undefined,
        openai_api_base: knowledgeBaseUrl,
        embedding_model: embeddingModel,
      };

    setLoading(true);
    ingestKnowledge(payload)
      .then((res) => {
        const data = unwrap(res);
        if (data?.stored) {
          message.success('已写入 Milvus 知识库');
          setCurrentStep(3);
        } else {
          message.warning(data?.reason || '未写入 Milvus，请检查 embedding key');
        }
      })
      .catch((err) => message.error(err.message || '知识库写入失败'))
      .finally(() => setLoading(false));
  };

  const onTemplateConnectorChange = (value) => {
    setTemplateConnector(value);
    setTemplateContent(TEMPLATE_EXAMPLES[value] || TEMPLATE_EXAMPLES.kafka);
  };

  const onIngestTemplateKnowledge = () => {
    setLoading(true);
    ingestKnowledge({
      doc_type: 'flink_template',
      connector_type: templateConnector,
      content: templateContent,
      milvus_uri: milvusUri,
      collection_name: collectionName,
      openai_api_key: knowledgeKey || undefined,
      openai_api_base: knowledgeBaseUrl,
      embedding_model: embeddingModel,
    })
      .then((res) => {
        const data = unwrap(res);
        if (data?.stored) {
          message.success('已写入 Flink 模板知识库');
          setCurrentStep(4);
        } else {
          message.warning(data?.reason || '未写入 Milvus，请检查 embedding key');
        }
      })
      .catch((err) => message.error(err.message || '模板写入失败'))
      .finally(() => setLoading(false));
  };

  const onAnalyze = () => {
    const startedAt = Date.now();
    setCurrentStep(4);
    setIsAnalyzing(true);
    setStepsCollapsed(false);
    setPipelineCollapsed(false);
    setLoading(true);
    createBusinessAnalysisRun({
      requirement,
      raw_ddl: selectedTableIds.length ? undefined : ddlText,
      dialect,
      table_ids: selectedTableIds,
      connector_preference: connectorPreference,
      bootstrap_servers: bootstrapServers,
      topic_prefix: topicPrefix,
      use_agent_rag: useAgentRag,
      agent_flow_id: selectedAgentFlowId,
      milvus_uri: milvusUri,
      collection_name: collectionName,
      openai_api_key: knowledgeKey || undefined,
      openai_api_base: knowledgeBaseUrl,
      embedding_model: embeddingModel,
      llm_model_name: llmModel,
      rag_top_k: ragTopK,
    })
      .then((res) => {
        setAnalysisRun(unwrap(res));
        setStepsCollapsed(true);
        setPipelineCollapsed(true);
        window.setTimeout(() => {
          resultCanvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        message.success('业务分析完成');
      })
      .catch((err) => message.error(err.message || '业务分析失败'))
      .finally(() => {
        const remaining = Math.max(0, 700 - (Date.now() - startedAt));
        window.setTimeout(() => {
          setLoading(false);
          setIsAnalyzing(false);
        }, remaining);
      });
  };

  const fieldColumns = [
    { title: '字段', dataIndex: 'name', width: 150 },
    { title: '业务类型', dataIndex: 'raw_type', width: 140 },
    { title: 'Flink 类型', dataIndex: 'flink_type', width: 140 },
    { title: '主键', dataIndex: 'primary_key', width: 80, render: (value) => value ? <Tag color="blue">PK</Tag> : '-' },
    { title: '注释', dataIndex: 'comment', ellipsis: true },
  ];

  const assetColumns = [
    { title: '表名', dataIndex: 'table_name', width: 160 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    {
      title: '事件时间',
      dataIndex: 'event_time_field',
      width: 120,
      render: (value) => value || <Text type="secondary">未识别</Text>,
    },
    {
      title: '维表',
      dataIndex: 'is_dimension',
      width: 70,
      render: (value) => value ? <Tag color="green">是</Tag> : '-',
    },
    {
      title: '',
      dataIndex: 'id',
      width: 46,
      render: (_, record) => (
        <Popconfirm
          title="删除表资产"
          description={record.table_name}
          okText="删除"
          cancelText="取消"
          onConfirm={(event) => {
            event?.stopPropagation?.();
            onDeleteAsset(record);
          }}
        >
          <Button
            danger
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={(event) => event.stopPropagation()}
          />
        </Popconfirm>
      ),
    },
  ];

  const candidateColumns = [
    { title: '候选表', dataIndex: 'table_name' },
    { title: '分数', dataIndex: 'score', width: 90 },
    { title: '事件时间', dataIndex: 'event_time_field', width: 140 },
    {
      title: '主键',
      dataIndex: 'primary_keys',
      width: 180,
      render: (value) => value?.length ? value.join(', ') : '-',
    },
  ];

  const selectedTableText = useMemo(() => {
    if (!sourceTables.length) return '暂无';
    return sourceTables.map((table) => table.table_name).join(', ');
  }, [sourceTables]);

  const agentFlowOptions = useMemo(() => agentFlows.map((flow) => ({
    label: (
      <span className="baFlowOption">
        <span>{flow.name}</span>
        {isAgentFlowCandidate(flow) ? <Tag color="cyan">推荐</Tag> : <Tag>普通</Tag>}
      </span>
    ),
    value: flow.id,
  })), [agentFlows]);

  const guideSteps = useMemo(() => [
    {
      key: 'input',
      step: '01',
      icon: <ApiOutlined />,
      title: '业务输入',
      action: '写需求，粘贴业务库 DDL',
      done: Boolean(parsedTable),
      meta: parsedTable?.table_name || '等待解析',
    },
    {
      key: 'asset',
      step: '02',
      icon: <DatabaseOutlined />,
      title: '表资产',
      action: '检查字段映射并保存',
      done: Boolean(savedTableId || selectedTableIds.length),
      meta: selectedTableIds.length ? `${selectedTableIds.length} 张表已选` : '未选择',
    },
    {
      key: 'agent',
      step: '03',
      icon: <RobotOutlined />,
      title: '知识库 / Agent',
      action: '配置 Milvus、模型和工作流',
      done: Boolean(useAgentRag ? knowledgeKey || selectedAgentFlowId : true),
      meta: useAgentRag ? (selectedAgentFlowId ? '工作流优先' : '内置链路') : '规则草稿',
    },
    {
      key: 'template',
      step: '04',
      icon: <CodeOutlined />,
      title: 'Flink 模板',
      action: '维护 connector 示例格式',
      done: Boolean(templateContent),
      meta: templateConnector,
    },
    {
      key: 'result',
      step: '05',
      icon: <PlayCircleOutlined />,
      title: '运行分析',
      action: '生成 SQL，检查风险',
      done: Boolean(analysisRun),
      meta: analysisRun?.run_id ? analysisRun.run_id.slice(0, 8) : '待运行',
    },
  ], [analysisRun, knowledgeKey, parsedTable, savedTableId, selectedAgentFlowId, selectedTableIds.length, templateConnector, templateContent, useAgentRag]);

  const tabItems = [
    {
      key: 'summary',
      label: '业务拆解',
      children: (
        <div className="baTabPane">
          <Alert
            type={risks.some((risk) => risk.level === 'error') ? 'error' : 'info'}
            showIcon
            message={result?.requirement_summary || '等待分析'}
            description={`已选表：${selectedTableText}`}
          />
          <div className="baMetricGrid">
            <div className="baMetric">
              <span>Connector</span>
              <strong>{connectorTemplate?.connector_type || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>模板来源</span>
              <strong>{connectorTemplate?.source || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>并行度</span>
              <strong>{result?.resource_plan?.parallelism || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>状态后端</span>
              <strong>{result?.resource_plan?.state_backend || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>生成模式</span>
              <strong>{result?.generation_mode || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>Agent</span>
              <strong>{agentTrace?.used ? 'knowledge → call_model' : '-'}</strong>
            </div>
          </div>
          <Table
            size="small"
            rowKey="table_name"
            columns={candidateColumns}
            dataSource={result?.candidate_tables || []}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: 'create',
      label: 'Flink 建表',
      children: (
        <div className="baTabPane">
          <div className="baTemplateLine">
            <Tag color="blue">{connectorTemplate?.connector_type || 'connector'}</Tag>
            <Text type="secondary">{connectorTemplate?.description || '模板会在分析后显示'}</Text>
          </div>
          {(result?.flink_create_tables || []).map((sql, index) => (
            <div key={index} className="baSqlUnit">
              {sqlBlock(sql)}
            </div>
          ))}
          {!result?.flink_create_tables?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无建表 SQL" />}
        </div>
      ),
    },
    {
      key: 'insert',
      label: 'INSERT SQL',
      children: <div className="baTabPane">{sqlBlock(result?.flink_insert_sql, 'large')}</div>,
    },
    {
      key: 'ops',
      label: '维表 / TTL / 资源',
      children: (
        <div className="baTabPane split">
          <div>
            <div className="baSectionTitle">维表建议</div>
            <Table
              size="small"
              rowKey="table_name"
              columns={[
                { title: '表', dataIndex: 'table_name' },
                { title: 'Key', dataIndex: 'dimension_key' },
                { title: '存储', dataIndex: 'storage' },
                { title: 'TTL(s)', dataIndex: 'ttl_seconds' },
              ]}
              dataSource={result?.dimension_table_plan || []}
              pagination={false}
            />
          </div>
          <div>
            <div className="baSectionTitle">资源建议</div>
            <pre className="baJsonBlock">{JSON.stringify(result?.resource_plan || {}, null, 2)}</pre>
          </div>
        </div>
      ),
    },
    {
      key: 'risks',
      label: `风险检查${risks.length ? `(${risks.length})` : ''}`,
      children: (
        <div className="baTabPane">
          {risks.length ? risks.map((risk, index) => (
            <Alert
              key={`${risk.message}-${index}`}
              className="baRisk"
              type={risk.level === 'error' ? 'error' : 'warning'}
              showIcon
              message={risk.message}
            />
          )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无风险" />}
          <div className="baSectionTitle">假设</div>
          {(result?.assumptions || []).map((item, index) => <Tag className="baAssumption" key={index}>{item}</Tag>)}
        </div>
      ),
    },
    {
      key: 'agent',
      label: 'Agent 召回',
      children: (
        <div className="baTabPane">
          <Alert
            type={agentTrace?.used ? 'success' : 'warning'}
            showIcon
            message={agentTrace?.message || '等待 Agent RAG'}
          />
          <div className="baMetricGrid compact">
            <div className="baMetric">
              <span>Milvus</span>
              <strong>{agentTrace?.collection_name || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>Embedding</span>
              <strong>{agentTrace?.embedding_model || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>LLM</span>
              <strong>{agentTrace?.llm_model_name || '-'}</strong>
            </div>
            <div className="baMetric">
              <span>Nodes</span>
              <strong>{agentTrace?.used ? '2' : '-'}</strong>
            </div>
          </div>
          <div className="baSectionTitle">Milvus 召回内容</div>
          {sqlBlock(agentTrace?.retrieval_context || '', 'large')}
          <div className="baSectionTitle">模型原始输出</div>
          {sqlBlock(agentTrace?.raw_output || '', 'large')}
        </div>
      ),
    },
  ];

  const activeStep = guideSteps[currentStep] || guideSteps[0];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === guideSteps.length - 1;
  const compactGuideText = analysisRun?.run_id
    ? `Run ${analysisRun.run_id.slice(0, 8)} · ${selectedTableText}`
    : `${activeStep.step} ${activeStep.title}`;

  const goPrevStep = () => setCurrentStep((step) => Math.max(0, step - 1));
  const goNextStep = () => setCurrentStep((step) => Math.min(guideSteps.length - 1, step + 1));

  const renderStepActions = () => (
    <Space wrap>
      <Button icon={<ArrowLeftOutlined />} disabled={isFirstStep || loading} onClick={goPrevStep}>
        上一步
      </Button>
      {isLastStep ? (
        <Button type="primary" icon={<PlayCircleOutlined />} onClick={onAnalyze} loading={loading}>
          运行分析
        </Button>
      ) : (
        <Button type="primary" icon={<ArrowRightOutlined />} disabled={loading} onClick={goNextStep}>
          下一步
        </Button>
      )}
    </Space>
  );

  const renderRunAnimation = () => {
    if (analysisRun && pipelineCollapsed && !isAnalyzing) {
      return (
        <div className="baPipelineCompact">
          <span className="baPipelineStatus" />
          <div>
            <strong>执行链路已完成</strong>
            <span>Run {analysisRun.run_id?.slice(0, 8)} · 已生成 SQL、维表、TTL、资源和风险检查结果</span>
          </div>
          <Button size="small" icon={<DownOutlined />} onClick={() => setPipelineCollapsed(false)}>
            展开链路
          </Button>
        </div>
      );
    }

    return (
    <div className={`baRunAnimation ${isAnalyzing ? 'active' : ''} ${analysisRun ? 'completed' : ''}`}>
      {analysisRun && !isAnalyzing ? (
        <Button className="baRunCollapseBtn" size="small" icon={<UpOutlined />} onClick={() => setPipelineCollapsed(true)}>
          收起链路
        </Button>
      ) : null}
      <div className="baRunOrb">
        {isAnalyzing ? <LoadingOutlined /> : <PlayCircleOutlined />}
      </div>
      <div className="baRunTrack">
        <span>业务需求</span>
        <i />
        <span>Milvus 召回</span>
        <i />
        <span>Agent 生成</span>
        <i />
        <span>风险检查</span>
      </div>
      <Text type="secondary">
        {isAnalyzing ? '正在解析表资产、召回知识库并生成 FlinkSQL...' : '点击运行后会按这条链路执行。'}
      </Text>
    </div>
    );
  };

  const renderStepContent = () => {
    switch (activeStep.key) {
      case 'input':
        return (
          <div className="baStepBody">
            <div className="baSectionLead">
              <div>
                <strong>先把业务问题和业务库 DDL 放进来</strong>
                <span>这里不要求写 FlinkSQL，业务库建表语句会先解析成统一表资产。</span>
              </div>
              <Button type="primary" icon={<FileSearchOutlined />} onClick={onParseDDL} loading={loading}>
                解析 DDL
              </Button>
            </div>
            <div className="baContentGrid two">
              <div className="baInputStack">
                <label>
                  <span>业务需求 / 指标口径</span>
                  <TextArea
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    autoSize={{ minRows: 6, maxRows: 10 }}
                  />
                </label>
                <div className="baInlineControls">
                  <label>
                    <span>业务库方言</span>
                    <Select value={dialect} options={DIALECT_OPTIONS} onChange={setDialect} />
                  </label>
                  <label>
                    <span>Connector 偏好</span>
                    <Select value={connectorPreference} options={CONNECTOR_OPTIONS} onChange={setConnectorPreference} />
                  </label>
                  <label>
                    <span>候选表数量</span>
                    <InputNumber value={5} disabled />
                  </label>
                </div>
                <div className="baInlineControls compact">
                  <label>
                    <span>Kafka bootstrap.servers</span>
                    <Input value={bootstrapServers} onChange={(e) => setBootstrapServers(e.target.value)} />
                  </label>
                  <label>
                    <span>Topic 前缀</span>
                    <Input value={topicPrefix} onChange={(e) => setTopicPrefix(e.target.value)} />
                  </label>
                </div>
              </div>
              <div className="baInputStack">
                <label>
                  <span>业务库建表语句</span>
                  <TextArea
                    className="baDdlInput"
                    value={ddlText}
                    onChange={(e) => setDdlText(e.target.value)}
                    autoSize={{ minRows: 16, maxRows: 24 }}
                  />
                </label>
              </div>
            </div>
          </div>
        );
      case 'asset':
        return (
          <div className="baStepBody">
            <div className="baSectionLead">
              <div>
                <strong>确认字段映射，复用已有表资产</strong>
                <span>解析结果可以保存为表资产；已保存的表也可以直接选择复用。</span>
              </div>
              <Space wrap>
                <Button icon={<DatabaseOutlined />} onClick={refreshAssets} disabled={loading}>刷新资产</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={onSaveAsset} disabled={!parsedTable} loading={loading}>
                  保存表资产
                </Button>
              </Space>
            </div>
            <div className="baContentGrid two">
              <div className="baQuietPanel">
                <div className="baSectionHeader">
                  <span>DDL 解析预览</span>
                  <Space wrap>
                    {parsedTable?.table_name ? <Tag color="processing">{parsedTable.table_name}</Tag> : <Tag>未解析</Tag>}
                    {parsedTable?.event_time_field ? <Tag color="success">事件时间：{parsedTable.event_time_field}</Tag> : <Tag>事件时间待确认</Tag>}
                  </Space>
                </div>
                {parsedTable ? (
                  <>
                    <Space wrap className="baTableMeta">
                      <Tag>{parsedTable.dialect}</Tag>
                      {(parsedTable.primary_keys || []).map((key) => <Tag color="purple" key={key}>PK {key}</Tag>)}
                      {(parsedTable.risks || []).map((risk, index) => <Tag color="warning" key={index}>{risk}</Tag>)}
                    </Space>
                    <Table
                      size="small"
                      rowKey="name"
                      columns={fieldColumns}
                      dataSource={parsedTable.columns || []}
                      pagination={false}
                      scroll={{ y: 360 }}
                    />
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="回到第一步解析 DDL" />
                )}
              </div>
              <div className="baQuietPanel">
                <div className="baSectionHeader">
                  <span>已保存表资产</span>
                  <Text type="secondary">点击行可带回预览并作为候选表</Text>
                </div>
                <Table
                  size="small"
                  rowKey="id"
                  columns={assetColumns}
                  dataSource={tableAssets}
                  pagination={{ pageSize: 7, size: 'small' }}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedTableIds([record.id]);
                      useExistingAsset(record);
                    },
                  })}
                  rowSelection={{
                    selectedRowKeys: selectedTableIds,
                    onChange: (keys, rows) => {
                      setSelectedTableIds(keys);
                      if (rows.length === 1) {
                        useExistingAsset(rows[0]);
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      case 'agent':
        return (
          <div className="baStepBody">
            <div className="baSectionLead">
              <div>
                <strong>连接 Milvus 和 Agent 工作流</strong>
                <span>没有可视化工作流时，也会使用后端内置 knowledge → call_model 链路。</span>
              </div>
              <Button icon={<CloudUploadOutlined />} onClick={onIngestKnowledge} loading={loading}>
                写入当前表资产
              </Button>
            </div>
            <Alert
              className="baSoftAlert"
              type={useAgentRag ? 'info' : 'warning'}
              showIcon
              message={selectedAgentFlowId ? '生成时会优先执行所选 Agent 工作流' : '未选择工作流时使用内置节点链'}
              description="业务分析推荐选择或创建 RAG 模板；画图模板会出现在 Agent 开发板里，用于单独生成图片，不会自动参与本次 SQL 分析。"
            />
            <div className="baAgentTools">
              <Checkbox checked={useAgentRag} onChange={(event) => setUseAgentRag(event.target.checked)}>
                生成时复用 knowledge → call_model
              </Checkbox>
              <div className="baAgentFlowRow">
                <Select
                  value={selectedAgentFlowId}
                  placeholder={agentFlows.length ? '选择已有 RAG 工作流' : '暂无工作流，请创建 RAG 模板'}
                  options={agentFlowOptions}
                  onChange={setSelectedAgentFlowId}
                  allowClear
                />
                <Button icon={<LinkOutlined />} onClick={openSelectedAgentFlow} disabled={!selectedAgentFlowId}>打开</Button>
                <Button icon={<PlusOutlined />} onClick={() => createAgentTemplateFlow('rag')} loading={loading}>创建 RAG 模板</Button>
                <Button icon={<PlusOutlined />} onClick={() => createAgentTemplateFlow('image')} loading={loading}>创建画图模板</Button>
                <Button icon={<BranchesOutlined />} onClick={openAgentBuilder}>开发板</Button>
              </div>
            </div>
            <div className="baKnowledgeGrid spacious">
              <label><span>Milvus URI</span><Input value={milvusUri} onChange={(e) => setMilvusUri(e.target.value)} /></label>
              <label><span>Collection</span><Input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} /></label>
              <label><span>Base URL</span><Input value={knowledgeBaseUrl} onChange={(e) => setKnowledgeBaseUrl(e.target.value)} /></label>
              <label><span>Embedding Model</span><Input value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} /></label>
              <label><span>LLM Model</span><Input value={llmModel} onChange={(e) => setLlmModel(e.target.value)} /></label>
              <label><span>Top K</span><InputNumber className="baFullWidth" min={1} max={20} value={ragTopK} onChange={(value) => setRagTopK(value || 6)} /></label>
              <label className="baKnowledgeKey"><span>API Key</span><Input.Password value={knowledgeKey} onChange={(e) => setKnowledgeKey(e.target.value)} visibilityToggle={false} /></label>
            </div>
          </div>
        );
      case 'template':
        return (
          <div className="baStepBody">
            <div className="baSectionLead">
              <div>
                <strong>单独维护 Flink connector 模板</strong>
                <span>模板区域不再挤在表资产下面；生成 SQL 时会按这里写入 Milvus 的示例格式填充。</span>
              </div>
              <Button type="primary" icon={<UploadOutlined />} onClick={onIngestTemplateKnowledge} loading={loading}>
                写入模板
              </Button>
            </div>
            <div className="baContentGrid template">
              <div className="baTemplateEditor">
                <label>
                  <span>模板类型</span>
                  <Select
                    value={templateConnector}
                    options={CONNECTOR_OPTIONS.filter((item) => item.value !== 'auto')}
                    onChange={onTemplateConnectorChange}
                  />
                </label>
                <label>
                  <span>Flink 模板内容</span>
                  <TextArea
                    className="baTemplateTextarea"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    autoSize={{ minRows: 20, maxRows: 32 }}
                  />
                </label>
              </div>
              <div className="baTemplateAside">
                <div className="baMiniRule"><strong>默认</strong><span>普通实时链路优先 Kafka。</span></div>
                <div className="baMiniRule"><strong>更新语义</strong><span>主键、撤回流、聚合更新会优先建议 upsert-kafka。</span></div>
                <div className="baMiniRule"><strong>不硬编码</strong><span>LLM 只能按召回模板填字段、topic、format 和 watermark。</span></div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="baStepBody">
            <div className="baSectionLead">
              <div>
                <strong>运行分析并查看结果</strong>
                <span>运行时会展示执行链路；完成后在 Tabs 中检查 SQL、维表、TTL、资源和风险。</span>
              </div>
              <Space wrap>
                {analysisRun?.run_id ? <Tag color="processing">{analysisRun.run_id.slice(0, 8)}</Tag> : null}
                <Tag>可反复运行</Tag>
              </Space>
            </div>
            {!pipelineCollapsed ? renderRunAnimation() : null}
            <div className="baResultCanvas" ref={resultCanvasRef}>
              <div className="baResultToolbar">
                <div className="baResultHeadline">
                  <span className={resultReady ? 'ready' : ''}>{resultReady ? <CheckCircleOutlined /> : <PlayCircleOutlined />}</span>
                  <div>
                    <strong>{resultReady ? '分析结果已生成' : '等待运行分析'}</strong>
                    <small>{resultReady ? 'SQL、模板来源、资源建议和风险检查集中在下方 Tabs。' : '点击运行分析后，这里会优先展示结果。'}</small>
                  </div>
                </div>
                <div className="baResultStats">
                  <div>
                    <span>建表 SQL</span>
                    <strong>{result?.flink_create_tables?.length || 0}</strong>
                  </div>
                  <div>
                    <span>候选表</span>
                    <strong>{result?.candidate_tables?.length || sourceTables.length || 0}</strong>
                  </div>
                  <div>
                    <span>风险</span>
                    <strong className={risks.length ? 'danger' : ''}>{risks.length}</strong>
                  </div>
                  <div>
                    <span>Connector</span>
                    <strong>{connectorTemplate?.connector_type || connectorPreference}</strong>
                  </div>
                </div>
              </div>
              <Tabs items={tabItems} />
              <div className="baFooterFlags">
                <Checkbox checked disabled>Kafka 默认</Checkbox>
                <Checkbox checked disabled>按模板生成</Checkbox>
                <Checkbox disabled>Yarn/S3 自动验证</Checkbox>
              </div>
            </div>
            {pipelineCollapsed ? renderRunAnimation() : null}
          </div>
        );
    }
  };

  return (
    <div className={`businessAnalyzerPage ${resultReady ? 'resultReady' : ''} ${stepsCollapsed ? 'stepsCompact' : ''}`}>
      <div className="baHeader">
        <div>
          <div className="baTitle"><ApartmentOutlined />业务分析器</div>
          <div className="baSubtitle">按步骤完成业务输入、表资产、知识库、模板和 FlinkSQL 生成。</div>
        </div>
        <Space wrap>
          <Tag className="baHeaderTag">Kafka first</Tag>
          <Tag className="baHeaderTag">Milvus RAG</Tag>
          <Tag className="baHeaderTag">Agent reusable</Tag>
          <Button
            className="baHeaderToggle"
            size="small"
            icon={stepsCollapsed ? <DownOutlined /> : <UpOutlined />}
            onClick={() => setStepsCollapsed((value) => !value)}
          >
            {stepsCollapsed ? '展开流程' : '收起流程'}
          </Button>
        </Space>
      </div>

      {stepsCollapsed && !resultReady ? (
        <button type="button" className="baCompactGuide" onClick={() => setStepsCollapsed(false)}>
          <span className="baCompactPulse" />
          <strong>流程已收起</strong>
          <span>{compactGuideText}</span>
          <DownOutlined />
        </button>
      ) : !stepsCollapsed ? (
        <div className="baStepRail">
          {guideSteps.map((item, index) => (
            <button
              type="button"
              key={item.key}
              className={`baStepCard ${index === currentStep ? 'active' : ''} ${item.done ? 'done' : ''}`}
              onClick={() => setCurrentStep(index)}
            >
              <span className="baStepIcon">{item.done ? <CheckCircleOutlined /> : item.icon}</span>
              <span className="baStepCopy">
                <em>{item.step}</em>
                <strong>{item.title}</strong>
                <span>{item.action}</span>
              </span>
              <span className="baStepMeta">{index === currentStep && isAnalyzing ? '执行中' : item.meta}</span>
            </button>
          ))}
        </div>
      ) : null}

      <main className={`baStageCard ${activeStep.key === 'result' ? 'resultMode' : ''}`}>
        <div className="baStageHeader">
          <div className="baStageTitle">
            <span>{activeStep.icon}</span>
            <div>
              <em>{activeStep.step}</em>
              <strong>{activeStep.title}</strong>
              <small>{activeStep.action}</small>
            </div>
          </div>
          {renderStepActions()}
        </div>
        {renderStepContent()}
      </main>
    </div>
  );
};
