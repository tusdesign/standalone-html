import { Outlet } from 'react-router-dom';
import { Card } from 'antd-mobile';
import mapImg from '../assets/map.png';

export const PassportLayout = () => (
  <div style={{
    display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem', paddingBottom: '2rem',
  }}>
    <div
      style={{
        fontSize: '1.5rem',
        padding: '1rem 0',
        paddingTop: '3rem',
      }}
    >
      启迪设计大厦欢迎您
    </div>
    <Outlet/>
    <Card
      style={{ width: '100%' }}
      bodyStyle={{
        width: '100%', boxSizing: 'border-box', backgroundColor: '#edeef8', borderRadius: '0.5rem',
      }}
    >
        <div style={{ paddingLeft: '1rem', paddingBottom: '0.5rem' }}>地址</div>
        <div style={{ width: '100%' }}>
          <img style={{ width: '100%' }} src={mapImg} alt="" />
        </div>
        <div style={{
          paddingTop: '0.3rem', paddingBottom: '0.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.5rem',
        }}>江苏省苏州市工业园区旺墩路北, 南施街东</div>
    </Card>
    <div style={{ paddingTop: '1rem' }}>©2023 启迪设计集团股份有限公司 版权所有</div>
  </div>
);
