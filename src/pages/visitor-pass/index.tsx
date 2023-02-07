import { useParams } from 'react-router-dom';
import { Input, Button, Card } from 'antd-mobile';
import { Visit } from './interfaces';

export const VisitorPass = () => {
  // TODO: implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  const visit: Visit = {
    // TODO
  } as Visit;
  return (
      <div style={{
        display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontSize: '2rem',
        }}>启迪设计大厦欢迎您</div>
        <Card>
          <div>您已预约于</div>
          <div>{visit.from}</div>
          <div>访问启迪设计大厦</div>
        </Card>
        <Card>
          <div>请输入您的手机号以获取专属于您的访客证</div>
          <div>
            <Input placeholder='手机号'></Input>
          </div>
          <div>
            <Button>提交</Button>
          </div>
        </Card>
        <Card>
          <div>地址</div>
          <div></div>
          <div>地址信息</div>
        </Card>
        <div></div>
      </div>
  );
};
