import { Button, Card } from 'antd-mobile';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { NewVisitor } from '../components/new-visitor-form';
import { VisitorCard } from '../components/visitor-card';
import { AppointmentContext } from '../context/appointment-context';
import { useAuth } from '../hooks/useAuth';

enum State {
  CREATED,
  EDITING,
}

export class VisitorListItem implements Visitor {
  name: string = '';

  mobile: string = '';

  idCard: string = '';

  id: string;

  state: State;

  constructor() {
    this.id = nanoid();
    this.state = State.EDITING;
  }
}

export const VisitorListPage: FC = () => {
  const { authInfo } = useAuth();

  const { visitData, update } = useContext(AppointmentContext);
  const { visitors } = visitData;
  const [visitorList, setVisitorList] = useState<VisitorListItem[]>(
    visitors.map((_v) => ({ ..._v, id: nanoid(), state: State.CREATED })),
  );

  const isEditing = useMemo(
    () => !!visitorList.find((_v) => _v.state === State.EDITING),
    [visitorList],
  );
  const addNewVisitor = useCallback(() => {
    if (isEditing) {
      return;
    }
    setVisitorList((prev) => [...prev, new VisitorListItem()]);
  }, [isEditing]);
  const removeNewVisitor = useCallback(() => {
    setVisitorList((prev) => [...prev.filter((_v) => _v.state !== State.EDITING)]);
  }, []);
  const confirmNewVisitor = useCallback((newVisitor: Visitor) => {
    setVisitorList((prev) =>
      prev.map((_v) =>
        _v.state === State.EDITING ? { ..._v, ...newVisitor, state: State.CREATED } : _v,
      ),
    );
  }, []);
  const removeCreatedVisitor = useCallback((id: string) => {
    setVisitorList((prev) => [...prev.filter((_v) => _v.id !== id)]);
  }, []);

  const checkDuplicatePhoneNumber = () => {
    // if (visitorList.some((visitor: Visitor) => visitor.mobile === mobile)) {
    //   return Promise.reject(Error('手机号已存在, 请勿重复添加'));
    // }
    return Promise.resolve();
  };

  const nav = useNavigate();
  const confirm = useCallback(() => {
    if (update) {
      update({ ...visitData, visitors: visitorList });
    }
    nav('/visitor/appointment', { state: { visitors: visitorList } });
  }, [nav, update, visitData, visitorList]);

  // Initialize visitor list with logged-in user's data
  useEffect(() => {
    if (authInfo?.mobile) {
      setVisitorList((prev) => {
        const exists = prev.some((v) => v.mobile === authInfo.mobile);
        if (exists) return prev;
        return [
          ...prev,
          { name: '', mobile: authInfo.mobile, idCard: '', id: nanoid(), state: State.EDITING },
        ];
      });
    }
  }, [authInfo]); // Re-run the effect when mobile changes
  return (
    <Card
      style={{ width: '100%', padding: 0, margin: 0 }}
      bodyStyle={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      {visitorList.map((_v) =>
        _v.state === State.EDITING ? (
          <NewVisitor
            onConfirm={confirmNewVisitor}
            onCancel={removeNewVisitor}
            visitor={_v}
            key={_v.id}
            mobileValidator={checkDuplicatePhoneNumber}
          />
        ) : (
          <VisitorCard onDelete={removeCreatedVisitor} visitor={_v} key={_v.id} />
        ),
      )}
      <Button
        style={{
          width: '100%',
          margin: '0.2rem 0',
        }}
        disabled={isEditing}
        color="primary"
        onClick={addNewVisitor}
      >
        添加访客
      </Button>
      <Button
        style={{
          width: '100%',
          margin: '0.2rem 0',
          color: 'white',
        }}
        disabled={isEditing}
        color="success"
        onClick={confirm}
      >
        提交
      </Button>
    </Card>
  );
};
