import { Popup } from "antd-mobile";
import React, {FC} from 'react';

const PlateEditor: FC<{visible: boolean, value?: string[], onChange?: (value: string[]) => void, onClose?: (value: string[]) => void}>  = ({
  visible, value, onChange, onClose
}) =>{
  return (
    <Popup
      visible={visible}
      showCloseButton
      bodyStyle={{ height: '95vh' }}
      onClose={() => onClose && onClose([])}

      
    >
      xxx
    </Popup>
  )
}
export default PlateEditor