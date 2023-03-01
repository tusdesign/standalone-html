import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Card } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Visit } from './interfaces';

export const Visitor = () => {
  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  const [cellphone, setCellphone] = useState<string>();
  const [visit, setVisit] = useState<Visit>({} as Visit);
  const inputCellphone = useCallback((value: string) => {
    setCellphone(value);
  }, []);
  const navigate = useNavigate();
  const generatePassport = useCallback(() => {
    navigate('passport', { state: { cellphone } });
  }, [cellphone]);

  useEffect(() => {
    axios.get<Visit>(
      `${process.env.REACT_APP_BASE_URL}/visits/${params.id}`,
      {
        headers: {
          'X-API-KEY': process.env.X_API_KEY,
        },
      },
    ).then((res) => {
      setVisit(res.data);
    });
  });
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
          <div style={{ fontSize: '1.5rem', color: '#315da8' }}>{visit.from ?? '2023年3月23日'}</div>
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
          {/* <div style={{ fontSize: '0.8rem' }}>手机号</div> */}
          <Input style={{
            '--font-size': '0.8rem',
          }}
          onChange={inputCellphone}
          placeholder='手机号' />
        </div>
        {/* confirm button */}
        <Button
        onClick={generatePassport}
        style={{
          backgroundColor: '#315da8',
          width: '100%',
          padding: '1rem',
          borderRadius: '0.8rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          fontSize: '0.8rem',
        }}>提交</Button>
      </Card>
    </>
  );
};
