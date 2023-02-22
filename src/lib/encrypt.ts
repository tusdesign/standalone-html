import JSEncrypt from 'jsencrypt';

/**
 * https://github.com/amitaymolko/react-native-rsa-native/issues/62#issuecomment-1141884771
 */
const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs+eSxOfqy22IScnkjXj1
gm20qoYhR+xFcRiUGzr7rU9yNDd0zE9Xp4wRqX/nw8PDbhaLmXhJMV8W4QXIc8Cu
zn1cGS5wLV7bstKcOHQQ1cEOCT410rtgMYNZpUcHvFtle6cVJawU00u62DIYcPDS
2g/28AGBxlaqD5wCRCbmX2eZlYOQ033N1WW1YQQ2giQAVEBNt8etXGDTYlMPijEa
2djFcHsiI0KzAiOdoKpSZQt7695PDC9BiR4w2UxK/j+u4X+ah+baYldTlXur26Bd
NFln/jboQayIpQWR1MOyDWpOpAiKCXsSxZ1tCE3SqDgRwyyPG7nHrcAyoJ9sIzg2
owIDAQAB`;

const platformPubKey = `-----BEGIN RSA PUBLIC KEY-----
${publicKey}
-----END RSA PUBLIC KEY-----
  `;

const encryption = new JSEncrypt();
encryption.setPublicKey(platformPubKey);

const encrypt = async (message: string): Promise<string> => encryption.encrypt(message) as string;

const getQRCodeString = (
  uuid: number,
  timestamp: number | undefined,
  len = 10,
  unit = 's',
): string => uuid.toString().padStart(8, '0') + (timestamp || Date.now()) + len.toString() + unit;

export const encryptQrString = async (id: number, timestamp?: number): Promise<string> => `${await encrypt(getQRCodeString(id, timestamp))}BS=qdsjy`;
