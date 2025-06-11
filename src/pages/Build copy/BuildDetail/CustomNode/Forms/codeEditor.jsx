import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import './index.less'
import { Input, Button, notification } from 'antd'
import { validateCode } from '@/services/Flow';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";

export default forwardRef((props, ref) => {
  const { value, onChange } = props;
  const [code, setCode] = useState('')

  useEffect(() => {
    if (value) {
      setCode(value)
    }
  }, [value])

  const checkAndSave = (a) => {
    console.log('checkAndSave code')
    validateCode({ code }).then(res => {
      let importsErrors = res.imports.errors;
      let funcErrors = res.function.errors;
      if (funcErrors.length === 0 && importsErrors.length === 0) {
        notification.success({
          message: '代码准备运行'
        })
        a?.(code);
      } else {
        if (funcErrors.length !== 0) {
          notification.error({
            placement: 'bottomRight',
            description: <>
              {
                funcErrors.map(item => <p key={item}>{item}</p>)
              }
            </>
          })
        }
        if (importsErrors.length !== 0) {
          importsErrors.error({
            placement: 'bottomRight',
            description: <>
              {
                funcErrors.map(item => <p key={item}>{item}</p>)
              }
            </>
          })
        }
      }
    })
  }
  useImperativeHandle(ref, () => {
    return {
      checkAndSave: checkAndSave,
    };
  }, [code])

  return (
    <div className='build_code_editor'>
      <div className="tip"><div className="desc">编辑你的 Python 代码此代码片段接受模块导入和一个函数定义。确保您的函数返回一个字符串。</div></div>
      <AceEditor
        defaultValue={value}
        mode="python"
        theme="github"
        highlightActiveLine={true}
        showPrintMargin={false}
        fontSize={14}
        showGutter
        enableLiveAutocompletion
        onChange={setCode}
        name="CodeEditor"
        style={{
          width: "100%"
        }}
      />
    </div>
  )
})