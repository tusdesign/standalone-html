import { Card } from 'antd-mobile';
import {
  FC, useState, useEffect, createRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import QrCode from 'qrcode';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import bgImage from '../assets/visitor-pass-bg.png';

export const Passport:FC = () => {
  const location = useLocation();
  const {
    state: {
      name, to, token, company, from,
    },
  } = location as { state: { to: string; name: string; token: string; from: string; company: string; } };
  const [qrcode, setQrCode] = useState<string>('');
  const imgContainer = createRef<HTMLDivElement>();
  useEffect(() => {
    QrCode.toDataURL(token, { margin: 0, errorCorrectionLevel: 'H' }, (err, url) => {
      setQrCode(url);
    });
  }, [token]);

  const [finalImageUrl, setFinalImageUrl] = useState<string>();
  useEffect(() => {
    if (!(qrcode && imgContainer.current)) {
      return;
    }
    html2canvas(imgContainer.current, { backgroundColor: null }).then(
      (canvas: HTMLCanvasElement) => {
        setFinalImageUrl(canvas.toDataURL());
      },
    );
  }, [qrcode]);

  return (
    <>
      <div ref={imgContainer} style={{ width: '100%' }}>
        {finalImageUrl && (<img style={{ width: '100%' }} src={finalImageUrl} />)}
        {
          !finalImageUrl && (
            <Card
              style={{
                width: '100%',
                padding: 0,
                borderRadius: '1.5rem',
                overflow: 'hidden',
              }}
              bodyStyle={{
                width: '100%',
                backgroundColor: '#c0c5db',
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '85%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: 'black',
                fontSize: '0.5rem',
                fontWeight: '550',
              }}
            >
              <div style={{ fontSize: '1.5rem', padding: '0.5rem 0 0 0' }}>访客证</div>
              <div style={{
                width: '100%', padding: '1rem 0 0.2rem 0', display: 'flex', justifyContent: 'center',
              }}>{company}</div>
              <div style={{
                width: '100%', display: 'flex', justifyContent: 'center', fontSize: '1.5rem',
              }}>{name}</div>
              <div style={{
                width: '65%', padding: '0.8rem', backgroundColor: 'white', borderRadius: '1rem', marginTop: '1rem',
              }}>
                {
                  qrcode && (<img style={{ width: '100%' }} src={qrcode} alt="qr code" />)
                }
              </div>
              <div style={{
                width: '100%', padding: '1rem 0 0 0', display: 'flex', justifyContent: 'center',
              }}>有效时间</div>
              <div style={{
                width: '100%', padding: '0.2rem 0 0 0', display: 'flex', justifyContent: 'center',
              }}>{dayjs(from).format('YYYY/MM/DD/ HH:mm')} - {dayjs(to).format('HH:mm')}</div>
              <div style={{ fontSize: '0.8rem', padding: '1rem 0' }}>启迪设计大厦</div>
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
