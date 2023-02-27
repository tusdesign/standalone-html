import {
  Form, Input, DatePicker, Button, Picker, DatePickerRef, PickerRef, Dialog, Card,
} from 'antd-mobile';
import {
  FC,
  RefObject, useCallback, useContext, useEffect, useState,
} from 'react';
import dayjs from 'dayjs';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import PlateEditor from '../components/PlateEditor';
import { LicensePlateItem } from '../components/Plate';
import { ERROR_MAP } from '../lib/error';
import { VisitorChip } from '../components/visitor-chip';
import { AppointmentContext, RequestData } from '../context/appointment-context';
import { useMinTime } from '../hooks/visitorHooks';

const VisitorList: FC<{ value?: Visitor[] }> = ({ value }) => (
    <>
    {
      value && value.length ? (
        <Card bodyStyle={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.1rem', padding: 0, margin: 0,
        }}>
          {
            value.map((_v: Visitor) => <VisitorChip name={_v.name} key={`${_v.name}-${_v.mobile}`}/>)
          }
        </Card>
      ) : (<Button >添加访客</Button>)
    }
    </>
);

export function VisitorAppointment() {
  const { visitData, update, reset } = useContext(AppointmentContext);
  const minTime = useMinTime();
  const [form] = Form.useForm<RequestData>();
  useEffect(() => {
    form.setFieldsValue(visitData);
  }, [visitData]);

  const [isShowPlateEditor, setIsShowPlateEditor] = useState(false);
  const [plates, setPlates] = useState<LicensePlateItem[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updatePlates = useCallback((newPlates: LicensePlateItem[]) => {
    setPlates(newPlates);
    form.setFieldValue('plates', newPlates.map((_p) => `${_p.region}${_p.code}`));
  }, []);
  const submit = useCallback((values:RequestData) => {
    const {
      startTime, duration, visitors, company, visitee, visitee_mobile, plates: _p = [],
    } = values;
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_URL}/visits`, {
      visitors,
      company,
      license_plates: _p,
      name: visitee,
      mobile: visitee_mobile,
      visitee_name: visitee,
      visitee_mobile,
      from: dayjs(startTime).toISOString(),
      duration_in_hours: parseInt(duration[0], 10),
    }).then(() => {
      Dialog.alert({
        content: '预约成功',
        onClose: () => {
          if (reset) {
            reset();
          }
        },
      });
    }).catch((err: AxiosError) => {
      const { response } = err;
      const { data: { code, message } } = response as { data: { code: number, message: string } };
      Dialog.alert({
        content: ERROR_MAP[String(code)] || message || 'Unknown error',
      });
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  const onError = useCallback(() => {}, []);
  const showPlateEditor = useCallback(() => {
    setIsShowPlateEditor(true);
  }, []);
  const closePlateEditor = useCallback(() => {
    setIsShowPlateEditor(false);
  }, []);
  const nav = useNavigate();
  const toVisitorFormPage = useCallback(() => {
    if (update) {
      update(form.getFieldsValue());
    }
    nav('list');
  }, [visitData]);

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
          <Button block type='submit' color='primary' size='large' loading={isLoading}>
            提交
          </Button>
        }
      >
        <Form.Header>访客信息</Form.Header>
        <Form.Item disabled={isLoading} label="来访者公司" name="company" rules={[{ required: true }]}>
          <Input autoComplete='new-password' placeholder='请输入' />
        </Form.Item>
        <Form.Item disabled={isLoading} label="来访车牌号" name="plates">
          <Button onClick={showPlateEditor}>
            {
              plates?.length ? '编辑车牌号' : '添加车牌'
            }
          </Button>
        </Form.Item>
        <Form.Item disabled={isLoading} label="访客" name="visitors" rules={[{ required: true, message: '请添加至少一个访客' }]} onClick={toVisitorFormPage}>
          <VisitorList />
        </Form.Item>
        <Form.Header>被访人信息</Form.Header>
        <Form.Item disabled={isLoading} label="被访人姓名" name="visitee" rules={[{ required: true }]}>
          <Input autoComplete='new-password' placeholder='请输入' />
        </Form.Item>
        <Form.Item disabled={isLoading} label="被访人手机号" name="visitee_mobile" rules={[{ required: true }, { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确' }]}>
          <Input autoComplete='new-password' placeholder='请输入' maxLength={11} type="tel"/>
        </Form.Item>
        <Form.Header>来访时间信息</Form.Header>
        <Form.Item disabled={isLoading} label="到访时间"
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
            min={minTime}
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
          disabled={isLoading}
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
