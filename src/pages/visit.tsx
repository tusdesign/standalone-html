import { useParams, useNavigate } from 'react-router-dom';
import {
  Input, Button, Card, Toast,
} from 'antd-mobile';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';

export const VisitPage: FC = () => {
  const params = useParams();
  const [cellphone, setCellphone] = useState<string>();
  const [visit, setVisit] = useState<Visit>({} as Visit);
  const inputCellphone = useCallback((value: string) => {
    setCellphone(value);
  }, []);
  const navigate = useNavigate();
  const validate = useCallback(() => {
    if (!cellphone) {
      Toast.show('请输入手机号以生成访客证');
      return false;
    }
    if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(cellphone)) {
      Toast.show('手机号无效,请确认后重试');
      return false;
    }
    return true;
  }, [cellphone]);
  const generatePassport = useCallback(() => {
    if (!validate()) {
      return;
    }
    axios
      .get<Passport>(
      `${process.env.REACT_APP_BASE_URL}/visits/${params.id}/pass/${cellphone?.trim()}`,
      {
        headers: {
          'X-API-KEY': process.env.X_API_KEY,
        },
      },
    )
      .then((res) => {
        const {
          name, from, to, token, company,
        } = res.data;
        navigate('passport', {
          state: {
            name, from, to, token, company,
          },
        });
      })
      .catch((err: AxiosError) => {
        const errMap: Record<string, string> = {
          404: '手机号无效,请确认后重试',
          9999: '位置错误',
        };
        Toast.show(errMap[(err.response?.status ?? 9999).toString()]);
      });
  }, [params.id, cellphone]);

  useEffect(() => {
    axios
      .get<Visit>(
      `${process.env.REACT_APP_BASE_URL}/visits/${params.id}`,
      {
        headers: {
          'X-API-KEY': process.env.X_API_KEY,
        },
      },
    )
      .then((res) => {
        setVisit(res.data);
      })
      .catch(() => {
        Toast.show('参数无效, 请确认后重试');
      });
  }, [params.id]);
  return (
    <>
      <Card
        style={{ width: '100%' }}
        bodyStyle={{
          backgroundColor: '#edeef8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>您已预约于</div>
        <div style={{ fontSize: '1.5rem', color: 'var(--adm-color-primary)' }}>{dayjs(visit.from).format('YYYY年MM月DD日') ?? '2023年3月23日'}</div>
        <div style={{ fontWeight: 'bold' }}>访问启迪设计大厦</div>
      </Card>
      <Card style={{ width: '100%' }} bodyStyle={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        borderRadius: '0.5rem',
      }}>
        <div style={{
          width: '100%', display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold',
        }}>请输入您的手机号以获取专属于您的访客证</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.8rem',
          backgroundColor: '#e1e2ec',
          borderRadius: '0.7rem',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          <Input style={{
            '--font-size': '0.8rem',
          }}
          inputMode="tel"
          maxLength={11}
          onChange={inputCellphone}
          placeholder='手机号' />
        </div>
        {/* confirm button */}
        <Button
          onClick={generatePassport}
          style={{
            backgroundColor: 'var(--adm-color-primary)',
            width: '100%',
            padding: '1rem',
            borderRadius: '0.8rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            fontSize: '0.8rem',
          }}
        >
          提交
        </Button>
      </Card>
    </>
  );
};
