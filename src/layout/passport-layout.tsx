import { Outlet } from 'react-router-dom';
import { Card } from 'antd-mobile';

export const PassportLayout = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 0.5rem',
      paddingBottom: '2rem',
    }}
  >
    <div
      style={{
        fontSize: '1.5rem',
        padding: '1rem 0',
        paddingTop: '3rem',
      }}
    >
      启迪设计大厦欢迎您
    </div>
    <Outlet />
    <Card
      style={{ width: '100%' }}
      bodyStyle={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#edeef8',
        borderRadius: '0.5rem',
      }}
      onClick={() =>
        window.open(
          'https://ditu.amap.com/search?query=%E5%90%AF%E8%BF%AA%E8%AE%BE%E8%AE%A1%E5%A4%A7%E5%8E%A6&city=320500&geoobj=120.664455%7C31.265526%7C120.819969%7C31.388767&zoom=13.03',
        )
      }
    >
      <div style={{ paddingLeft: '1rem', paddingBottom: '0.5rem' }}>地址</div>
      <div style={{ width: '100%' }}>
        <img style={{ width: '100%' }} src="/assets/map.png" alt="" />
      </div>
      <div
        style={{
          paddingTop: '0.3rem',
          paddingBottom: '0.3rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        江苏省苏州市工业园区旺茂街9号
        <br />
        点击地图以获取路线引导
      </div>
    </Card>
    <div style={{ paddingTop: '1rem' }}>©2023 启迪设计集团股份有限公司 版权所有</div>
  </div>
);
