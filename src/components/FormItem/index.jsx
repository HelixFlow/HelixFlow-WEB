import React, { } from 'react'
import { Form, Input, InputNumber, Select, Slider, Button, Radio } from 'antd'
import './index.less';

export default (props) => {
  const { data } = props
  const {
    type,
    description,
    param_name,
    placeholder,
    // require,
    // RequireText,
    multiple,
    options,
    max,
    min,
    step,
    default_value,
  } = data;

  return (
    type == 'input' ? <Form.Item
      label={description}
      name={param_name}
      rules={[
        // {
        //   required: require,
        //   message: RequireText,
        // },
      ]}>
      <Input placeholder={`请输入${description}`} />
    </Form.Item> : type == 'select' ? <Form.Item
      label={description}
      name={param_name}
      rules={[]}>
      <Select placeholder={`请选择${description}`} mode={multiple ? 'multiple' : ''}>
        {
          options.map((item) => (
            <Select.Option value={item} key={item}>{item}</Select.Option>
          ))
        }
      </Select>
    </Form.Item> : type == 'textarea' ? <Form.Item
      label={description}
      name={param_name}
      rules={[]}>
      <Input.TextArea placeholder={`请输入${description}`} />
    </Form.Item> : <div className='fieldsLine'>
      <Form.Item
        label={description}
        name={param_name}
        rules={[]}
      >
        <Slider
          min={min}
          max={max}
          step={step}
          marks={{
            [min]: min,
            [max]: max
          }}
        />
      </Form.Item>
      <Form.Item
        label={description}
        name={param_name}
      >
        <InputNumber
          min={min}
          max={max}
          step={step}
          controls={true}
        />
      </Form.Item>
    </div>
  )
}