import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.less'
import {
  ApiOutlined,
  BugOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  FieldTimeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Alert, Button, Drawer, Empty, message, Space, Tabs, Tag, Tooltip, Typography } from 'antd'
import { ProForm, ProFormTextArea } from '@ant-design/pro-components'
import {
  createFlowRun,
  getFlowRun,
  pauseFlowRun,
  resumeFlowRun,
  stopFlowRun,
} from '@/services/Flow';
import { getUrlParam } from '@/utils';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-xcode';
import ReactJson from 'react-json-view'

const { Paragraph, Text } = Typography;
const RUNNING = 'running';
const PAUSED = 'paused';
const COMPLETED = 'completed';
const STOPPED = 'stopped';
const FAILED = 'failed';
const TERMINAL_STATUS = [COMPLETED, STOPPED, FAILED];
const MASKED_SECRET = '********';
const SECRET_KEYWORDS = [
  'api_key',
  'apikey',
  'access_key',
  'secret',
  'token',
  'password',
  'authorization',
];

const isSecretKey = (key) => {
  if (!key) return false;
  const normalized = String(key).toLowerCase().replace(/-/g, '_');
  return SECRET_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

const maskSecretValue = (value) => {
  if (value === null || value === undefined || value === '') return value;
  return MASKED_SECRET;
}

const maskSecrets = (data, keyPath = '') => {
  if (isSecretKey(keyPath)) {
    return maskSecretValue(data);
  }
  if (Array.isArray(data)) {
    return data.map((item) => maskSecrets(item, keyPath));
  }
  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => {
      const nextPath = keyPath ? `${keyPath}.${key}` : key;
      result[key] = maskSecrets(data[key], nextPath);
      return result;
    }, {});
  }
  return data;
}

const maskJsonString = (value) => {
  try {
    return JSON.stringify(maskSecrets(JSON.parse(value || '{}')), null, 2);
  } catch (err) {
    return value || '{}';
  }
}

const STATUS_META = {
  [RUNNING]: { color: 'processing', label: '运行中' },
  [PAUSED]: { color: 'warning', label: '已暂停' },
  [COMPLETED]: { color: 'success', label: '已完成' },
  [STOPPED]: { color: 'default', label: '已终止' },
  [FAILED]: { color: 'error', label: '失败' },
}

const stringify = (data) => JSON.stringify(maskSecrets(data ?? {}), null, 2)

const formatTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const getFieldValues = (state) => {
  const fields = state?.fields || {};
  return Object.keys(fields).reduce((data, key) => {
    data[key] = fields[key]?.field_value ?? fields[key];
    return data;
  }, {})
}

export default ({ checkFlow, onSave, disabled }) => {
  const initValues = {
    // Authorization: '',
    data: '{"inputs": {"query":"你好"} }'
  }
  const [showDrawer, setShowDrawer] = useState(false);
  const formRef = useRef()
  const appId = getUrlParam("id"); //id
  const [values, setValues] = useState(initValues)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [runInfo, setRunInfo] = useState(null)
  const [patchText, setPatchText] = useState('{}')
  const [activeTab, setActiveTab] = useState('snapshot')
  const url = `${window.location.origin}/helixflow/process?id=`; //默认url
  const pollTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      clearPollTimer()
    }
  }, [])

  const text = useMemo(() => {
    const maskedData = maskJsonString(values.data);
    return `curl -X 'POST'  \\\n'${url}${appId}' \\\n-H 'accept: application/json'  \\\n-H 'Content-Type: application/json' \\\n-d '${maskedData}'`
  }, [url, appId, values])

  const onOpen = () => {
    checkFlow(() => {
      setShowDrawer(true);
    })
  }

  const onTest = () => {
    formRef.current?.submit()
  }

  const clearPollTimer = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  const normalizeRunResponse = (res) => {
    const payload = res?.data && (Object.prototype.hasOwnProperty.call(res.data, 'code') || Object.prototype.hasOwnProperty.call(res.data, 'data'))
      ? res.data
      : res;
    if (payload?.code && payload.code !== 200) {
      throw new Error(payload.msg || '运行失败')
    }
    return payload?.data ?? payload
  }

  const buildPatchTemplate = (run) => {
    return stringify(run?.editable_patch?.template || run?.editable_patch?.editable || {
      inputs: run?.inputs || {},
      fields: getFieldValues(run?.state),
      configurable: run?.configurable || {},
    })
  }

  const refreshRun = (runId, options = {}) => {
    return getFlowRun(runId).then(res => {
      const nextRun = normalizeRunResponse(res)
      setRunInfo(nextRun)
      if (nextRun?.status === PAUSED) {
        setLoading(false)
        if (!nextRun.worker_alive) {
          clearPollTimer()
        }
      }
      if (nextRun?.status === PAUSED && options.updatePatch !== false) {
        setPatchText(buildPatchTemplate(nextRun))
        setActiveTab('patch')
      }
      if (TERMINAL_STATUS.includes(nextRun?.status)) {
        clearPollTimer()
        setLoading(false)
        if (nextRun.status === COMPLETED) {
          setResult(nextRun.result || nextRun)
        } else {
          setResult(nextRun)
        }
      }
      return nextRun
    }).catch((err) => {
      clearPollTimer()
      setLoading(false)
      message.error(err.message || '获取运行状态失败')
    })
  }

  const startPolling = (runId) => {
    clearPollTimer()
    pollTimerRef.current = setInterval(() => {
      refreshRun(runId, { updatePatch: false })
    }, 1000)
  }

  const onFinish = (values) => {
    setLoading(true)
    setResult('')
    setRunInfo(null)
    setPatchText('{}')
    setActiveTab('snapshot')
    onSave(() => {
      createFlowRun(appId, JSON.parse(values.data)).then(res => {
        const run = normalizeRunResponse(res)
        setRunInfo(run)
        if (TERMINAL_STATUS.includes(run.status)) {
          setLoading(false)
          setResult(run.result || run)
        } else {
          startPolling(run.run_id)
        }
      }).catch((err) => {
        setLoading(false)
        message.error(err.message || '试运行启动失败')
      })
    })
  }

  const onPause = () => {
    if (!runInfo?.run_id) return
    pauseFlowRun(runInfo.run_id).then(res => {
      const run = normalizeRunResponse(res)
      setRunInfo(run)
      if (run.status === PAUSED) {
        setLoading(false)
        setPatchText(buildPatchTemplate(run))
        setActiveTab('patch')
        if (run.worker_alive) {
          startPolling(run.run_id)
        } else {
          clearPollTimer()
        }
      } else {
        message.info('已请求暂停，后台调用返回后会丢弃结果并回到当前节点前')
      }
    }).catch((err) => {
      message.error(err.message || '暂停失败')
    })
  }

  const onResume = () => {
    if (!runInfo?.run_id) return
    if (runInfo?.worker_alive) {
      message.info('后台调用还在返回中，暂停结果会被丢弃；请稍后再继续运行')
      return
    }
    let patch = {}
    try {
      patch = JSON.parse(patchText || '{}')
    } catch (err) {
      message.error('修正内容必须是 json 格式')
      return
    }
    setLoading(true)
    resumeFlowRun(runInfo.run_id, patch).then(res => {
      const run = normalizeRunResponse(res)
      setRunInfo(run)
      if (TERMINAL_STATUS.includes(run.status)) {
        setLoading(false)
        setResult(run.result || run)
      } else {
        startPolling(run.run_id)
      }
    }).catch((err) => {
      setLoading(false)
      message.error(err.message || '继续运行失败')
    })
  }

  const onStop = () => {
    if (!runInfo?.run_id) return
    stopFlowRun(runInfo.run_id).then(res => {
      const run = normalizeRunResponse(res)
      clearPollTimer()
      setLoading(false)
      setRunInfo(run)
      setResult(run)
    }).catch((err) => {
      message.error(err.message || '终止失败')
    })
  }

  const statusColor = useMemo(() => {
    const status = runInfo?.status
    return STATUS_META[status]?.color || 'default'
  }, [runInfo])

  const isRunning = runInfo?.status === RUNNING
  const isPaused = runInfo?.status === PAUSED
  const currentStatusLabel = STATUS_META[runInfo?.status]?.label || '未启动'
  const nextNodesText = runInfo?.next_nodes?.length ? runInfo.next_nodes.join(', ') : '无待执行节点'
  const currentState = runInfo?.state || {}
  const fieldValues = useMemo(() => getFieldValues(currentState), [currentState])
  const rawResponse = runInfo || result || {}
  const latestFailedEvent = useMemo(() => {
    const events = runInfo?.events || []
    return events.slice().reverse().find(event => event.type === 'failed')
  }, [runInfo])
  const failedNodeText = runInfo?.failed_node
    || latestFailedEvent?.data?.node
    || runInfo?.active_nodes?.[0]
    || runInfo?.next_nodes?.[0]
    || ''
  const errorTypeText = runInfo?.error_type || latestFailedEvent?.data?.error_type || ''
  const activeNodesText = runInfo?.active_nodes?.length ? runInfo.active_nodes.join(', ') : '-'
  const focusNodeLabel = runInfo?.status === FAILED ? '失败节点' : '正在执行'
  const focusNodeText = runInfo?.status === FAILED ? (failedNodeText || '未识别') : activeNodesText
  const editablePatch = runInfo?.editable_patch || {}
  const lockedPatch = editablePatch?.locked || {}
  const editableNote = editablePatch?.note || '只有暂停状态可以应用修正。'
  const editableNodesText = editablePatch?.editable_nodes?.length ? editablePatch.editable_nodes.join(', ') : '-'
  const hasLockedPatch = !!(
    Object.keys(lockedPatch?.inputs || {}).length
    || Object.keys(lockedPatch?.fields || {}).length
    || Object.keys(lockedPatch?.configurable || {}).length
  )

  const onDrawerClose = () => {
    if (isRunning && runInfo?.run_id) {
      stopFlowRun(runInfo.run_id)
        .catch(() => {})
        .finally(() => {
          clearPollTimer()
          setLoading(false)
        })
    } else {
      clearPollTimer()
    }
    setShowDrawer(false)
  }

  const renderJsonBlock = (name, value, height = '320px', theme = 'xcode') => (
    <AceEditor
      mode="json"
      theme={theme}
      name={name}
      readOnly
      wrapEnabled
      value={stringify(value)}
      width="100%"
      height={height}
      fontSize={13}
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
      }}
    />
  )

  const tabItems = [
    {
      key: 'snapshot',
      label: '状态快照',
      children: (
        <div className="debugTabPane">
          <div className="debugSectionHeader">
            <div>
              <div className="debugSectionTitle">State Fields</div>
              <div className="debugSectionHint">当前 checkpoint 中可读写的运行字段。</div>
            </div>
            <Paragraph className="copyAction" copyable={{ text: stringify(fieldValues) }}>复制</Paragraph>
          </div>
          {Object.keys(fieldValues).length ? (
            <ReactJson
              src={fieldValues}
              name={false}
              collapsed={1}
              displayDataTypes={false}
              enableClipboard={false}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无 state 字段" />
          )}
          <div className="debugSectionHeader compact">
            <div>
              <div className="debugSectionTitle">Configurable</div>
              <div className="debugSectionHint">节点参数、prompt 和条件配置会出现在这里。</div>
            </div>
            <Paragraph className="copyAction" copyable={{ text: stringify(runInfo?.configurable) }}>复制</Paragraph>
          </div>
          {renderJsonBlock('workflow-configurable-snapshot', runInfo?.configurable || {}, '260px')}
        </div>
      ),
    },
    {
      key: 'patch',
      label: '修正',
      children: (
        <div className="debugTabPane">
          {!isPaused && (
            <Alert
              className="debugAlert"
              type="info"
              showIcon
              message="只有暂停后才会应用修正"
              description={editableNote}
            />
          )}
          {isPaused && (
            <Alert
              className="debugAlert"
              type="warning"
              showIcon
              message={`当前可修改节点：${editableNodesText}`}
              description={editableNote}
            />
          )}
          <div className="debugSectionHeader">
            <div>
              <div className="debugSectionTitle">Patch JSON</div>
              <div className="debugSectionHint">这里只显示当前暂停点之后仍会生效的字段；已执行节点请重新 Test Run。</div>
            </div>
            <Space size={8}>
              {runInfo && <Button size="small" onClick={() => setPatchText(buildPatchTemplate(runInfo))}>重置模板</Button>}
              <Paragraph className="copyAction" copyable={{ text: maskJsonString(patchText) }}>复制</Paragraph>
            </Space>
          </div>
          <AceEditor
            mode="json"
            theme='xcode'
            name="workflow-patch"
            wrapEnabled
            value={patchText}
            onChange={setPatchText}
            width="100%"
            height="380px"
            fontSize={13}
            showPrintMargin={false}
            readOnly={!isPaused}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
            }}
          />
          {hasLockedPatch ? (
            <>
              <div className="debugSectionHeader compact">
                <div>
                  <div className="debugSectionTitle">不可修改</div>
                  <div className="debugSectionHint">这些内容属于已执行节点或当前暂停点之后不会读取的字段，修改不会生效。</div>
                </div>
              </div>
              {renderJsonBlock('workflow-locked-patch', lockedPatch, '240px')}
            </>
          ) : null}
        </div>
      ),
    },
    {
      key: 'events',
      label: '事件',
      children: (
        <div className="debugTabPane">
          {runInfo?.events?.length ? (
            <div className="runEventList">
              {runInfo.events.slice().reverse().map((event, index) => (
                <div className="runEvent" key={`${event.time}-${event.type}-${index}`}>
                  <div className="runEventLine">
                    <Tag>{event.type}</Tag>
                    <Text className="runEventTime">{formatTime(event.time)}</Text>
                  </div>
                  <div className="runEventMessage">{event.message}</div>
                  {event.data && Object.keys(event.data).length ? (
                    <pre className="runEventData">{stringify(event.data)}</pre>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无事件" />
          )}
        </div>
      ),
    },
    {
      key: 'raw',
      label: 'Raw Response',
      children: (
        <div className="debugTabPane">
          <div className="debugSectionHeader">
            <div>
              <div className="debugSectionTitle">Backend Payload</div>
              <div className="debugSectionHint">完整 run 响应，便于排查前后端字段映射。</div>
            </div>
            <Paragraph className="copyAction" copyable={{ text: stringify(rawResponse) }}>复制</Paragraph>
          </div>
          {renderJsonBlock('workflow-run-raw-response', rawResponse, '520px')}
        </div>
      ),
    },
    {
      key: 'curl',
      label: 'cURL',
      children: (
        <div className="debugTabPane">
          <div className="debugSectionHeader">
            <div>
              <div className="debugSectionTitle">Compatibility Request</div>
              <div className="debugSectionHint">兼容入口 `/flows/process` 的请求示例。</div>
            </div>
            <Paragraph className="copyAction" copyable={{ text }}>复制</Paragraph>
          </div>
          <AceEditor
            mode="sh"
            theme='terminal'
            name="workflow-curl"
            readOnly
            wrapEnabled
            value={text}
            width="100%"
            height="260px"
            fontSize={13}
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
            }}
          />
        </div>
      ),
    },
  ]



  return (
    <>
      <Button type='primary' disabled={disabled} onClick={onOpen} icon={<ApiOutlined />}>试运行</Button>

      <Drawer
        className="workflowRunDrawer"
        title={
          <Space size={10}>
            <BugOutlined />
            <span>Run Debug Console</span>
            {runInfo?.status && <Tag color={statusColor}>{currentStatusLabel}</Tag>}
          </Space>
        }
        onClose={onDrawerClose}
        open={showDrawer}
        width={'72vw'}
        extra={
          <Space>
            {runInfo?.run_id && (
              <Tooltip title="刷新当前 run 状态">
                <Button onClick={() => refreshRun(runInfo.run_id)} icon={<ReloadOutlined />}>刷新</Button>
              </Tooltip>
            )}
            {isRunning && <Button onClick={onPause} icon={<PauseCircleOutlined />}>暂停</Button>}
            {isPaused && (
              <Tooltip title={runInfo?.worker_alive ? '后台调用还在返回中，稍后才能继续' : '继续运行'}>
                <Button type="primary" onClick={onResume} disabled={runInfo?.worker_alive} icon={<PlayCircleOutlined />}>继续运行</Button>
              </Tooltip>
            )}
            {(isRunning || isPaused) && <Button danger onClick={onStop} icon={<StopOutlined />}>终止</Button>}
            <Button type="primary" onClick={onTest} loading={loading && !isPaused} disabled={loading || isRunning}>
              Test Run
            </Button>
          </Space>
        }
      >
        <div className="workflowDebugger">
          <div className="debugLaunchPanel">
            <div className="debugSectionHeader">
              <div>
                <div className="debugSectionTitle">Request Payload</div>
                <div className="debugSectionHint">试运行会先保存当前画布，再用这段 JSON 创建 run。</div>
              </div>
              <Tag color={loading || isRunning ? 'processing' : 'default'}>{loading || isRunning ? '请求锁定' : '可编辑'}</Tag>
            </div>
            <ProForm
              onFinish={onFinish}
              omitNil={false}
              submitter={false}
              layout={'vertical'}
              title='参数设置'
              formRef={formRef}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 24 }}
              grid={true}
              initialValues={initValues}
              onValuesChange={(e, values) => {
                setValues(values)
              }}
              disabled={loading || isRunning}
            >
              <ProFormTextArea
                label="data"
                name={'data'}
                fieldProps={{ autoSize: { minRows: 4, maxRows: 8 } }}
                placeholder="请输入data"
                rules={[
                  () => ({
                    validator(_, value) {
                      try {
                        JSON.parse(value);
                      } catch (e) {
                        return Promise.reject(new Error('必须是 json 格式'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              />
            </ProForm>
          </div>

          <div className="runStatusConsole">
            <div className="statusRail">
              <div className={`statusDot ${runInfo?.status || 'idle'}`} />
              <div>
                <div className="statusTitle">{currentStatusLabel}</div>
                <div className="statusSubTitle">{runInfo?.run_id ? `thread_id = ${runInfo.thread_id}` : '等待启动 run'}</div>
              </div>
            </div>
            <div className="statusGrid">
              <div className="statusCell">
                <span>run_id</span>
                {runInfo?.run_id ? <Text copyable={{ text: runInfo.run_id }}>{runInfo.run_id}</Text> : <Text>-</Text>}
              </div>
              <div className="statusCell">
                <span>下一节点</span>
                <Text>{nextNodesText}</Text>
              </div>
              <div className={`statusCell ${runInfo?.status === FAILED ? 'danger' : ''}`}>
                <span>{focusNodeLabel}</span>
                <Text>{focusNodeText}</Text>
              </div>
              <div className="statusCell">
                <span><ClockCircleOutlined /> Started</span>
                <Text>{formatTime(runInfo?.started_at)}</Text>
              </div>
              <div className="statusCell">
                <span><FieldTimeOutlined /> Updated</span>
                <Text>{formatTime(runInfo?.updated_at)}</Text>
              </div>
              <div className="statusCell">
                <span><CodeOutlined /> Events</span>
                <Text>{runInfo?.events?.length || 0}</Text>
              </div>
              <div className="statusCell">
                <span>输出字段</span>
                <Text>{result ? Object.keys(result || {}).length : Object.keys(runInfo?.result || {}).length}</Text>
              </div>
            </div>
            {runInfo?.error ? (
              <Alert
                className="debugAlert"
                type="error"
                showIcon
                message="运行失败"
                description={(
                  <div className="errorDetails">
                    <div><Text strong>节点：</Text><Text>{failedNodeText || '未识别'}</Text></div>
                    <div><Text strong>类型：</Text><Text>{errorTypeText || '-'}</Text></div>
                    <div className="errorMessage">{runInfo.error}</div>
                  </div>
                )}
              />
            ) : null}
            {isPaused ? <Alert className="debugAlert" type="warning" showIcon message="Run 已暂停" description={editableNote} /> : null}
          </div>

          <Tabs
            className="debugTabs"
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />

          {result && (
            <div className="debugResultPanel">
              <div className="debugSectionHeader">
                <div>
                  <div className="debugSectionTitle">Result</div>
                  <div className="debugSectionHint">终态输出，来自 end 节点字段。</div>
                </div>
                <Paragraph className="copyAction" copyable={{ text: stringify(result) }}>复制结果</Paragraph>
              </div>
              <ReactJson
                src={result}
                name={false}
                collapsed={1}
                displayDataTypes={false}
                enableClipboard={false}
              />
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}
