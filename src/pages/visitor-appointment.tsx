import {
  Button,
  Card,
  DatePicker,
  DatePickerRef,
  Dialog,
  Form, Input,
  Picker,
  PickerRef,
} from 'antd-mobile';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { filter } from 'lodash';
import {
  FC,
  RefObject, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { LicensePlateItem } from '../components/Plate';
import PlateEditor from '../components/PlateEditor';
import { VisitorChip } from '../components/visitor-chip';
import { AppointmentContext, RequestData } from '../context/appointment-context';
import { useMinTime } from '../hooks/visitorHooks';
import { ERROR_MAP } from '../lib/error';

const DURATION_OPTIONS = [
  { label: '1小时', value: '1' },
  { label: '2小时', value: '2' },
  { label: '3小时', value: '3' },
  { label: '4小时', value: '4' },
  { label: '10小时', value: '10' },
];

const getValidOptions = (newDateTime: string, maxTimeInMinute: number) => {
  const maxTimeAtChosenDate = dayjs(newDateTime).startOf('day').add(maxTimeInMinute, 'minute');
  const validOptions: { label: string, value: string }[] = filter(
    DURATION_OPTIONS,
    (_o) => !dayjs(newDateTime).add(Number(_o.value), 'hour').isAfter(maxTimeAtChosenDate),
  );
  return validOptions;
};

const VisitorList: FC<{ value?: Visitor[] }> = ({ value }) => (
  <>
    {
      value && value.length ? (
        <Card bodyStyle={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.1rem', padding: 0, margin: 0,
        }}>
          {
            value.map((_v: Visitor) => <VisitorChip name={_v.name} key={`${_v.name}-${_v.mobile}`} />)
          }
        </Card>
      ) : (<Button >添加访客</Button>)
    }
  </>
);

export function VisitorAppointment() {
  const { visitData, update, reset } = useContext(AppointmentContext);
  // 最多预约至(结束时间)每晚9点
  const MAX_TIME_IN_MINUTE = useMemo(
    () => dayjs().startOf('day').add(21, 'hour').diff(dayjs().startOf('day'), 'minute'),
    [],
  );
  const minTime = useMinTime();
  const [form] = Form.useForm<RequestData>();
  useEffect(() => {
    form.setFieldsValue(visitData);
  }, [visitData]);

  const [isShowPlateEditor, setIsShowPlateEditor] = useState(false);
  const [plates, setPlates] = useState<LicensePlateItem[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [durationOptions, setDurationOptions] = useState(
    getValidOptions(dayjs().startOf('day').toISOString(), MAX_TIME_IN_MINUTE),
  );

  // 根据选择时间调整持续时间选项, 确保不超过最大结束时间
  const updateDurationOptions = useCallback(
    (newDateTime: Date) => {
      const validOptions = getValidOptions(dayjs(newDateTime).toISOString(), MAX_TIME_IN_MINUTE);
      setDurationOptions(validOptions);
    },
    [MAX_TIME_IN_MINUTE],
  );

  const updatePlates = useCallback((newPlates: LicensePlateItem[]) => {
    setPlates(newPlates);
    form.setFieldValue('plates', newPlates.map((_p) => `${_p.region}${_p.code}`));
  }, []);
  const submit = useCallback((values: RequestData) => {
    const {
      startTime, duration, visitors, company, visitee, visitee_mobile, plates: _p = [],
    } = values;
    setIsLoading(true);
    axios.post(`${import.meta.env.VITE_BASE_URL}/visits`, {
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
  const onError = useCallback(() => { }, []);
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
      <PlateEditor visible={isShowPlateEditor} onClose={closePlateEditor} onChange={updatePlates} />
      <Form layout='horizontal' mode='card' form={form}
        onFinish={submit}
        onFinishFailed={onError}
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
          <Input autoComplete='new-password' placeholder='请输入' maxLength={11} type="tel" />
        </Form.Item>
        <Form.Header>来访时间信息</Form.Header>
        <Form.Item disabled={isLoading} label="到访时间"
          name='startTime'
          trigger='onConfirm'
          rules={[{ required: true }]}
          onClick={
            (_, datePickerRef: RefObject<DatePickerRef>) => {
              datePickerRef.current?.open();
            }
          }
        >
          <DatePicker
            min={minTime}
            filter={{
              hour: (val) => (val <= 20 && val >= 8),
              minute: (val) => (val === 0 || val === 30),
            }}
            precision='minute'
            onConfirm={(val) => {
              updateDurationOptions(val);
            }}
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
            (_, pickerRef: RefObject<PickerRef>) => {
              pickerRef.current?.open();
            }
          }
        >
          <Picker columns={[durationOptions]} >
            {
              (value) => (value && value.length && value[0]?.value ? `${value[0]?.value}小时` : '请选择')
            }
          </Picker>
        </Form.Item>
      </Form>
    </>

  );
}
