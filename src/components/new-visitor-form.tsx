import {
  Form, Button, Input, Card,
} from 'antd-mobile';
import { FC, useCallback } from 'react';

type NewUser = {
  name:string;
  mobile: string;
};

export const NewVisitor: FC<{ onConfirm: (newUser: NewUser) => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [form] = Form.useForm<NewUser>();
  const onError = useCallback(() => {}, []);
  const submit = useCallback((value:NewUser) => {
    onConfirm(value);
  }, [form]);

  return (
    <Card>
      <Form layout='horizontal' mode='card' form={form}
        onFinish={submit}
        onFinishFailed = {onError}
        footer={
          <>
            <Button block type='submit' color='primary' style={{ color: 'white' }} size='large'>
              确认
            </Button>
            <Button onClick={onCancel} block style={{ backgroundColor: 'darkgray', color: 'white' }} size='large'>
              取消
            </Button>
          </>
        }
      >
        <Form.Header>访客信息</Form.Header>
        <Form.Item style={{ backgroundColor: '#e1e2ec' }} label="姓名" name="name" rules={[{ required: true }]}>
          <Input autoComplete='new-password' placeholder='请输入' />
        </Form.Item>
        <Form.Item style={{ backgroundColor: '#e1e2ec' }} label="手机号" name="mobile" rules={[{ required: true, pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号无效' }]}>
          <Input autoComplete='new-password' type={'tel'} placeholder='请输入' />
        </Form.Item>
      </Form>
    </Card>
  );
};
