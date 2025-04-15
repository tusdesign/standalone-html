import { Form, Button, Input, Card } from 'antd-mobile';
import { FC, useCallback, useEffect } from 'react';
import { VisitorListItem } from '../pages/visitor-list';

type NewUser = {
  name: string;
  mobile: string;
  idCard: string;
};

type customValidator = (_: unknown, value: string) => void;

export const NewVisitor: FC<{
  visitor: VisitorListItem;
  onConfirm: (newUser: NewUser) => void;
  onCancel: () => void;
  mobileValidator: customValidator;
}> = ({ onConfirm, onCancel, mobileValidator, visitor }) => {
  const [form] = Form.useForm<NewUser>();

  useEffect(() => {
    if (visitor?.mobile) {
      form.setFieldsValue({ mobile: visitor.mobile });
    }
  }, [form, visitor]);

  const onError = useCallback(() => {}, []);
  const submit = useCallback(
    (value: NewUser) => {
      onConfirm(value);
    },
    [onConfirm],
  );

  return (
    <Card>
      <Form
        layout="horizontal"
        mode="card"
        form={form}
        onFinish={submit}
        onFinishFailed={onError}
        footer={
          <>
            <Button block type="submit" color="primary" style={{ color: 'white' }} size="large">
              确认
            </Button>
            <Button
              onClick={onCancel}
              block
              style={{ backgroundColor: 'darkgray', color: 'white' }}
              size="large"
            >
              取消
            </Button>
          </>
        }
      >
        <Form.Header>访客信息</Form.Header>
        <Form.Item
          style={{ backgroundColor: '#e1e2ec' }}
          label="姓名"
          name="name"
          rules={[{ required: true }]}
        >
          <Input autoComplete="new-password" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          style={{ backgroundColor: '#e1e2ec' }}
          label="手机号"
          name="mobile"
          rules={[
            { required: true, pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号无效' },
            { validator: mobileValidator },
          ]}
        >
          <Input autoComplete="new-password" type={'tel'} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          style={{ backgroundColor: '#e1e2ec' }}
          label="身份证号"
          name="idCard"
          rules={[
            {
              required: true,
              pattern:
                /^[1-9]\d{5}(18|19|20|21)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
              message: '身份证号无效',
            },
            // { validator: mobileValidator },
          ]}
        >
          <Input autoComplete="new-password" type={'id'} placeholder="请输入" />
        </Form.Item>
      </Form>
    </Card>
  );
};
