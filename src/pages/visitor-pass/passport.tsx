import { Card } from 'antd-mobile';
import {
  FC, useState, useEffect, createRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import QrCode from 'qrcode';
import html2canvas from 'html2canvas';
import bgImage from '../../assets/visitor-pass-bg.png';

export const Passport:FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  // const { state: { cellphone } } = location;
  const [qrcode, setQrCode] = useState<string>('');
  const imgContainer = createRef<HTMLDivElement>();
  useEffect(() => {
    QrCode.toDataURL('this is a qrcode contain visitor info', { margin: 0, errorCorrectionLevel: 'H' }, (err, url) => {
      setQrCode(url);
    });
  }, []);
  const [finalImageUrl, setFinalImageUrl] = useState<string>();
  useEffect(() => {
    if (!(qrcode && imgContainer.current)) {
      return;
    }
    html2canvas(imgContainer.current).then(
      (canvas: HTMLCanvasElement) => {
        setFinalImageUrl(canvas.toDataURL());
      },
    );
  }, [qrcode, imgContainer]);
  return (
    <>
      <div ref={imgContainer} style={{ width: '100%' }}>
        {finalImageUrl && (<img style={{ width: '100%' }} src={finalImageUrl} />)}
        {
          !finalImageUrl && (
            <Card
              bodyStyle={{
                width: '100%',
                backgroundColor: '#565e71',
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '85%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: 'white',
                fontSize: '0.6rem',
                borderRadius: '2rem',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>访客证</div>
              <div style={{ width: '75%', padding: '0.2rem 0' }}>姓名</div>
              <div style={{ width: '75%', padding: '0.2rem 0' }}>法外狂徒张三</div>
              <div style={{ width: '75%', padding: '0.2rem 0' }}>有效时间</div>
              <div style={{ width: '75%', padding: '0.2rem 0' }}>2023/01/01 00:00~23:59</div>
              <div style={{
                width: '75%', minHeight: '70vw', padding: '1rem', backgroundColor: 'white', borderRadius: '1rem', marginTop: '1rem',
              }}>
                {
                  qrcode && (<img style={{ width: '100%' }} src={qrcode} alt="qr code" />)
                }
              </div>
              <div style={{ padding: '1rem 0' }}>启迪设计大厦</div>
            </Card>
          )
        }
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.8rem 0',
      }}>
        <div style={{ paddingBottom: '0.8rem', fontSize: '1rem' }}>长按访客证以保存至相册</div>
        <div style={{ fontSize: '0.8rem' }}>请即使保存您的访客证, 以便在访问时快捷出示.</div>
        <div style={{ fontSize: '0.8rem' }}>如果不慎遗失,可以返回此页面再次保存.</div>
      </div>
    </>
  );
};
