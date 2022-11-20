import { Form, Input, DatePicker, Button, Picker, DatePickerRef, PickerRef } from 'antd-mobile';
import React, { RefObject, useCallback} from 'react';
import dayjs from "dayjs";
import PlateEditor from './components/PlateEditor';

type RequestData = {
  visitor: string;
  visitor_mobile: string;
  visitee: string;
  visitee_mobile: string;
  visitee_company: string;
  startTime: string;
  duration: string[]
}

function App() {
  const [form] = Form.useForm()
  const submit = useCallback((values:RequestData ) => {
    console.log("🚀 ~ file: App.tsx ~ line 8 ~ submit ~ e", values)
  }, [])
  const onError = useCallback(() => {}, [])
  return (
    <>
      <PlateEditor visible={true}></PlateEditor>
      <Form layout='horizontal' mode='card' form={form}
        onFinish={submit}
        onFinishFailed = {onError}
        footer={
          <Button block type='submit' color='primary' size='large'>
            提交
          </Button>
        }
      >
        <Form.Header>访客信息</Form.Header>
        <Form.Item label="访客姓名" name="visitor" rules={[{required: true}]}>
          <Input placeholder='请输入'></Input>
        </Form.Item>
        <Form.Item label="访客手机号" name="visitor_mobile" rules={[{required: true}]}>
          <Input placeholder='请输入'></Input>
        </Form.Item>
        <Form.Item label="来访车牌号" name="plates">
          <Button>添加车牌</Button>
        </Form.Item>
        <Form.Header>被访人信息</Form.Header>
        <Form.Item label="被访人姓名" name="visitee" rules={[{required: true}]}>
          <Input placeholder='请输入'></Input>
        </Form.Item>
        <Form.Item label="被访人公司" name="visitee_company" rules={[{required: true}]}>
          <Input placeholder='请输入'></Input>
        </Form.Item>
        <Form.Item label="被访人手机号" name="visitee_mobile" rules={[{required: true}]}>
          <Input placeholder='请输入'></Input>
        </Form.Item>
        <Form.Header>来访时间信息</Form.Header>
        <Form.Item label="到访时间"
          name='startTime'
          trigger='onConfirm'
          rules={[{required: true}]}
          onClick={
            (e, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open()
            }
          }
        >
        <DatePicker
          filter={{
            minute: val => (val === 0 || val === 30)
          }}
          precision='minute'
        >
          {
            value => value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '请选择'
          }
        </DatePicker>
        </Form.Item>
        <Form.Item
          label="访问时长"
          name='duration'
          trigger='onConfirm'
          rules={[{required: true}]}
          onClick={
            (e, pickerRef: RefObject<PickerRef>) => {
              pickerRef.current?.open()
            }
          }
        >
          <Picker columns={[Array.from({length: 24}, (k, v)=> ({label: `${v+1}小时`, value: `${v+1}`}))]} >
            {
              value => value && value.length ? `${value[0]?.value}小时` : '请选择'
            }
          </Picker>
        </Form.Item>
      </Form>
    </>

  );
}

export default App;
