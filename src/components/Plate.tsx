import { Button, Grid, Input, Picker, Toast } from 'antd-mobile';
import { EditSOutline, DeleteOutline, CheckOutline } from 'antd-mobile-icons';
import { PickerValue } from 'antd-mobile/es/components/picker-view';
import { FC, useCallback, useState } from 'react';

export const LICENSE_PLATE_PATTERN =
  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-HJ-NP-Z]{1}(([A-HJ-NP-Z0-9]{5})|([0-9]{6}|[A-HJ-NP-Z]{1}[0-9]{5}|[0-9]{5}[A-HJ-NP-Z]{1}|[A-HJ-NP-Z]{2}[0-9]{4}))$/;

export const REGION_OPTIONS =
  '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领'.split('');

export enum MODE {
  display = 'display',
  edit = 'edit',
}

export type LicensePlateProps = {
  region: string;
  code: string;
};

export type LicensePlateItem = LicensePlateProps & {
  id: string;
  mode: MODE;
};

function checkPlateNumberFormat(plateNo: string) {
  if (!plateNo) {
    return false;
  }
  const len = plateNo.length;
  // 位数校验
  if (len !== 7 && len !== 8) {
    return false;
  }
  // 车牌号规则校验
  if (LICENSE_PLATE_PATTERN.test(plateNo)) {
    // 新能源车
    if (len === 8) {
      return true;
    }
    // 7位时,后5位最多包含2位字母校验
    const arr = plateNo.match(/[A-HJ-NP-Z]/g);
    if (arr && arr.length <= 3) {
      return true;
    }
  }
  return false;
}

// 编辑
const EditingPlate: FC<
  LicensePlateProps & {
    onConfirm: (newPlate: LicensePlateProps) => void;
    onDelete: () => void;
  }
> = ({ code, region, onConfirm, onDelete }) => {
  const [localRegion, setLocalRegion] = useState(region || REGION_OPTIONS[0]);
  const [localCode, setLocalCode] = useState(code || '');
  const confirmPlate = useCallback(() => {
    if (checkPlateNumberFormat(`${localRegion}${localCode}`)) {
      onConfirm({ region: localRegion, code: localCode });
    } else {
      Toast.show({
        content: '车牌号格式不正确',
      });
    }
  }, [localCode, localRegion, onConfirm]);
  const [isShowPicker, setIsShowPicker] = useState(false);
  const showPicker = useCallback(() => {
    setIsShowPicker(true);
  }, []);
  const hidePicker = useCallback(() => {
    setIsShowPicker(false);
  }, []);
  const updateRegion = useCallback((newRegion: PickerValue[]) => {
    setLocalRegion(newRegion[0]!);
    hidePicker();
  }, []);
  const updateCode = useCallback((newCode: string) => {
    setLocalCode(newCode.replace('s', '').trim().toUpperCase());
  }, []);
  return (
    <Grid columns={12} gap={2}>
      <Grid.Item span={1}></Grid.Item>
      <Grid.Item span={2}>
        <Button onClick={showPicker}>{localRegion}</Button>
        <Picker
          visible={isShowPicker}
          columns={[REGION_OPTIONS]}
          value={[localRegion]}
          onConfirm={updateRegion}
          onClose={hidePicker}
        />
      </Grid.Item>
      <Grid.Item span={4} style={{ display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="请输入"
          value={localCode}
          pattern="[A-Z0-9]{6,7}"
          onChange={updateCode}
          maxLength={7}
        />
      </Grid.Item>
      <Grid.Item span={2}>
        <Button onClick={confirmPlate}>
          <CheckOutline />
        </Button>
      </Grid.Item>
      <Grid.Item span={2}>
        <Button onClick={onDelete}>
          <DeleteOutline />
        </Button>
      </Grid.Item>
      <Grid.Item span={1}></Grid.Item>
    </Grid>
  );
};

// 展示状态
const DisplayLicensePlate: FC<
  LicensePlateProps & {
    onPressEdit: () => void;
    allowEdit: boolean;
    onDelete: () => void;
  }
> = ({ allowEdit = true, onPressEdit, onDelete, code, region }) => {
  const charList = [region, code.toUpperCase()?.split('')].flat(Infinity);
  return (
    <Grid columns={charList.length + 2} gap={2}>
      {charList.map((_c, index) => (
        <Button key={`${_c}${index}`}>{_c}</Button>
      ))}
      <Button disabled={!allowEdit} onClick={onPressEdit}>
        <EditSOutline />
      </Button>
      <Button onClick={onDelete}>
        <DeleteOutline />
      </Button>
    </Grid>
  );
};

export const LicensePlate: FC<
  LicensePlateProps & {
    onConfirm: (newPlate: LicensePlateProps) => void;
    onEdit: () => void;
    onDelete: () => void;
    mode: MODE;
    allowEdit: boolean;
  }
> = ({ mode = MODE.display, code, region, allowEdit, onEdit, onConfirm, onDelete }) =>
  mode === MODE.edit ? (
    <EditingPlate code={code} region={region} onConfirm={onConfirm} onDelete={onDelete} />
  ) : (
    <DisplayLicensePlate
      onPressEdit={onEdit}
      code={code}
      region={region}
      allowEdit={allowEdit}
      onDelete={onDelete}
    />
  );
