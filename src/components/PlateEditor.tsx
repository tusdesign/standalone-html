import {
  Button, Card, Popup, Space,
} from 'antd-mobile';
import React, { FC, useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  LicensePlate, LicensePlateItem, LicensePlateProps, MODE, REGION_OPTIONS,
} from './Plate';

const PlateEditor: FC<{
  visible: boolean,
  existingPlates?: LicensePlateItem[],
  onChange: (value: LicensePlateItem[]) => void,
  onClose: (value: string[]) => void }> = ({
  onChange, existingPlates = [], visible, onClose,
}) => {
  const [plates, setPlates] = useState<LicensePlateItem[]>(existingPlates);
  const allowEdit = plates.filter((_p) => _p.mode === MODE.edit).length === 0;
  const allowSubmit = plates.filter((_p) => _p.mode === MODE.display).length > 0;
  const submitPlates = useCallback(() => {
    onChange(plates);
  }, [plates]);
  // 更新
  const updateLicensePlate = useCallback(
    (newLicensePlate: LicensePlateItem) => {
      const { id } = newLicensePlate;
      const final = plates.map((_p) => (_p.id === id
        ? {
          ...newLicensePlate,
          id,
        }
        : _p));
      setPlates(final);
      onChange(plates);
    },
    [plates],
  );
  // 进入编辑状态;
  const editLicensePlate = useCallback(
    (id: string) => {
      const final = plates.map((_p) => (_p.id === id
        ? {
          ..._p,
          id,
          mode: MODE.edit,
        }
        : _p));
      setPlates(final);
    },
    [plates],
  );
  // 新增
  const addPlate = useCallback(() => {
    setPlates([
      ...plates,
      {
        id: nanoid(), region: REGION_OPTIONS[0], code: '', mode: MODE.edit,
      },
    ]);
  }, [plates]);
  // 删除
  const removePlate = useCallback(
    (id: string) => {
      const final = plates.filter((_p) => _p.id !== id);
      setPlates(final);
      onChange(plates);
    },
    [plates],
  );
  return (
      <Popup
        onMaskClick={() => onClose([])}
        visible={visible}
        showCloseButton
        bodyStyle={{ height: '90vh' }}
        onClose={() => onClose([])}
       >
          <Card>
            <Space wrap direction='vertical'>
              {
                plates.map((_p) => (
                  <LicensePlate
                    allowEdit={allowEdit}
                    region={_p.region}
                    code={_p.code}
                    mode={_p.mode}
                    onConfirm={(newLicensePlate: LicensePlateProps) => updateLicensePlate({ ...newLicensePlate, id: _p.id, mode: MODE.display })
                    }
                    onEdit={() => editLicensePlate(_p.id)}
                  ></LicensePlate>
                ))
              }
            </Space>
          </Card>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button onClick={addPlate}>添加车牌</Button>
          </div>
       </Popup>
  );
};
export default PlateEditor;
