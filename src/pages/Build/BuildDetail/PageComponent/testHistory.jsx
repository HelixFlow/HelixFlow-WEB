import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.less'
import { ApiOutlined } from '@ant-design/icons'
import { Button, Typography, message, Drawer } from 'antd'
import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { getTestRunUrl, testRun } from '@/services/Flow';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-xcode';
const { Paragraph, Text } = Typography;
import ReactJson from 'react-json-view'


export default ({ checkFlow, onSave, disabled }) => {

  const initValues = {
    // Authorization: '',
    data: '{"inputs": {"query":"你好"} }'
  }
  const [showDrawer, setShowDrawer] = useState(false);
  const formRef = useRef()
  const appId = new URLSearchParams(window.location.hash.split('?')[1]).get("id"); //id
  const [values, setValues] = useState(initValues)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [url, setUrl] = useState(`${window.location.origin}/helixflow/process?id=`); //默认url

  // useEffect(() => {
  //   getTestRunUrl().then(res => {
  //     setUrl(res)
  //   })
  // }, [])

  const text = useMemo(() => {
    return `curl -X 'POST'  \\\n'${url}${appId}' \\\n-H 'accept: application/json'  \\\n-H 'Content-Type: application/json' \\\n-d '${values.data}'`
  }, [url, appId, values])

  const onOpen = () => {
    checkFlow(() => {
      setShowDrawer(true);
    })
  }

  const onTest = () => {
    formRef.current?.submit()
  }

  const onFinish = (values) => {
    setLoading(true)
    setResult('')
    onSave(() => {
      testRun(appId, JSON.parse(values.data)).then(res => {
        setLoading(false)
        // setResult(JSON.stringify(res));
        setResult(res);
      }).catch(() => {
        setLoading(false)
      })
    })
  }



  return (
    <>
      <Button type='primary' disabled={disabled} onClick={onOpen} icon={<ApiOutlined />}>试运行</Button>

      <Drawer
        title="试运行"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        width={'40%'}
        extra={
          <Button type="primary" onClick={onTest} loading={loading}>
            Test Run
          </Button>
        }
      >
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
          disabled={loading}
        >
          {/* <ProFormText
            label="apiKey"
            name={'Authorization'}
            rules={[
              {
                required: true,
                message: '请输入ApiKey!',
              },
            ]}
            placeholder="请输入ApiKey"
          /> */}
          <ProFormTextArea
            label="data"
            name={'data'}
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
        <div className="workflowTestResult">
          <div className="title">实例</div>
          <div className="content">
            <Paragraph className='btn' copyable={{ text: text }}>复制代码</Paragraph>
            <div className="line"></div>
            <AceEditor
              mode="sh"
              // theme={theme === 'dark' ? "terminal" : 'xcode'}
              theme='terminal'
              name="ss"
              readOnly
              wrapEnabled
              value={text}
              width="100%"
              height="300px"
              fontSize={14}
              showPrintMargin={false}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
              }}
            />
          </div>
          <div className="title">运行结果</div>
          {result && <div className="content content2">
            <Paragraph className='btn' copyable={{ text: JSON.stringify(result) }}>复制结果</Paragraph>
            <div className="line"></div>
            <ReactJson src={result} />
          </div>}
        </div>
      </Drawer>
    </>
  )
}