import { Card, List } from 'antd-mobile';
import { FC } from 'react';

export const VisitorCard: FC<{
  visitor: { id: string; name: string; mobile: string };
  onDelete: (id: string) => void;
}> = ({ visitor, onDelete }) => {
  const { name, mobile } = visitor;
  return (
    <Card
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      bodyStyle={{
        width: '95%',
      }}
    >
      <List
        style={{
          width: '100%',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <List.Item style={{ backgroundColor: '#e1e2ec' }} prefix="姓名">
          {name}
        </List.Item>
        <List.Item style={{ backgroundColor: '#e1e2ec' }} prefix="手机号">
          {mobile}
        </List.Item>
        <List.Item
          onClick={() => onDelete(visitor.id)}
          style={{
            backgroundColor: '#e1e2ec',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'red',
          }}
        >
          删除
        </List.Item>
      </List>
    </Card>
  );
};
