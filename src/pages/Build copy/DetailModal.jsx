import React, { } from 'react'
import { Button, Checkbox, Form, Input } from 'antd';
import './index.less'
const { TextArea } = Input;
import { createAndEditFlow } from '@/services/Flow';


export default (props) => {

  const { editInfo, onOK, onCancel } = props;

  const { id, name = '', description = '' } = editInfo;
  // console.log(editInfo)

  const onFinish = (values) => {
    // console.log('Success:', values);
    // console.log(editInfo, id)
    createAndEditFlow({
      ...editInfo,
      ...values,
    }).then(res => {
      onOK()
    })

  };

  return (
    <div className='build_detailModal'>
      <Form
        name="表格"
        layout={'vertical'}
        style={{
          maxWidth: 700,
        }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          name,
          description,
        }}
      >
        <Form.Item
          label="工作流名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入工作流名称!',
            },
            {
              validator(_, value) {
                if (/^[0-9a-zA-Z]{1,}$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('只能输入数字和英文!'));
              },
            }
          ]}
        >
          <Input maxLength={20} placeholder='请输入工作流名称' />
        </Form.Item>

        <Form.Item
          label="工作流描述"
          name="description"
        >
          <TextArea rows={4} placeholder='请输入工作流描述' />
        </Form.Item>


        <div className="btns">
          <Button className='cancelBtn' onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
      </Form>
    </div>
  )
}