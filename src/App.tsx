import {
  Form, Input, DatePicker, Button, Picker, DatePickerRef, PickerRef, Dialog,
} from 'antd-mobile';
import React, { RefObject, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import axios, { AxiosError } from 'axios';
import PlateEditor from './components/PlateEditor';
import { LicensePlateItem } from './components/Plate';
import { ERROR_MAP } from './lib/error';

interface RequestData {
  visitor: string;
  visitor_mobile: string;
  visitee: string;
  visitee_mobile: string;
  startTime: string;
  duration: string[],
  plates: string[]
}

function App() {
  const [form] = Form.useForm<RequestData>();
  form.setFieldValue('duration', ['4']);
  const startOfDate = dayjs().diff(dayjs().startOf('hour')) >= 30 ? dayjs().startOf('hour').add(1, 'hour') : dayjs().startOf('hour').add(30, 'minute');
  const [isShowPlateEditor, setIsShowPlateEditor] = useState(false);
  const [plates, setPlates] = useState<LicensePlateItem[]>();
  const updatePlates = useCallback((newPlates: LicensePlateItem[]) => {
    setPlates(newPlates);
    form.setFieldValue('plates', newPlates.map((_p) => `${_p.region}${_p.code}`));
  }, []);
  const submit = useCallback((values:RequestData) => {
    const {
      startTime, duration, visitor, visitee, visitor_mobile, visitee_mobile, plates: _p = [],
    } = values;
    axios.post(process.env.REACT_APP_CREATE_URL!, {
      name: visitor,
      mobile: visitor_mobile,
      license_plates: _p,
      visitee_name: visitee,
      visitee_mobile,
      from: startTime,
      duration_in_hours: parseInt(duration[0], 10),
    }).then(() => {
      Dialog.alert({
        content: '预约成功',
        onClose: form.resetFields,
      });
    }).catch((err: AxiosError) => {
      const { response } = err;
      const { data: { code, message } } = response as { data: { code: number, message: string } };
      Dialog.alert({
        content: ERROR_MAP[String(code)] || message || 'Unknown error',
      });
    });
  }, []);
  const onError = useCallback(() => {}, []);
  const showPlateEditor = useCallback(() => {
    setIsShowPlateEditor(true);
  }, []);
  const closePlateEditor = useCallback(() => {
    setIsShowPlateEditor(false);
  }, []);
  return (
    <>
      <div style={{
        fontSize: '2.5em', fontWeight: 'bold', paddingLeft: '.5rem', paddingTop: '.5rem',
      }}>
        访客预约
      </div>
      <PlateEditor visible={isShowPlateEditor} onClose={closePlateEditor} onChange={updatePlates}/>
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
        <Form.Item label="访客姓名" name="visitor" rules={[{ required: true }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item label="访客手机号" name="visitor_mobile" rules={[{ required: true }, { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]}>
          <Input placeholder='请输入' maxLength={11} type="tel"/>
        </Form.Item>
        <Form.Item label="来访车牌号" name="plates">
          <Button onClick={showPlateEditor}>
            {
              plates?.length ? '编辑车牌号' : '添加车牌'
            }
          </Button>
        </Form.Item>
        <Form.Header>被访人信息</Form.Header>
        <Form.Item label="被访人姓名" name="visitee" rules={[{ required: true }]}>
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item label="被访人手机号" name="visitee_mobile" rules={[{ required: true }, { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]}>
          <Input placeholder='请输入' maxLength={11} type="tel"/>
        </Form.Item>
        <Form.Header>来访时间信息</Form.Header>
        <Form.Item label="到访时间"
          name='startTime'
          trigger='onConfirm'
          rules={[{ required: true }]}
          onClick={
            (e, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open();
            }
          }
        >
        <DatePicker
          min={startOfDate.toDate()}
          filter={{
            minute: (val) => (val === 0 || val === 30),
          }}
          precision='minute'
        >
          {
            (value) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '请选择')
          }
        </DatePicker>
        </Form.Item>
        <Form.Item
          label="访问时长"
          name='duration'
          trigger='onConfirm'
          rules={[{ required: true }]}
          onClick={
            (e, pickerRef: RefObject<PickerRef>) => {
              pickerRef.current?.open();
            }
          }
        >
          <Picker columns={[Array.from({ length: 24 }, (k, v) => ({ label: `${v + 1}小时`, value: `${v + 1}` }))]} >
            {
              (value) => (value && value.length ? `${value[0]?.value}小时` : '请选择')
            }
          </Picker>
        </Form.Item>
      </Form>
    </>

  );
}

export default App;
