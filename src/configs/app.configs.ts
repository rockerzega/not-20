export const DEVELOPMENT_ENV =
  process.env.NOTIFICACIONESENV !== 'production' || !!__DEV__;
export const secret = 'en7It1Auth0r1z4T10N';
export const entidadToken = process.env.TOKEN_NAME || 'test_mjct';
export const masterKey = process.env.MASTERKEY || 'M71gj34rYW38';
export const origenes = [
  process.env.APP_CONTINUIDAD || 'http://localhost:3000',
  process.env.APP_FIRMAS || 'http://localhost:3005',
  process.env.APP_UPCONTAMX || 'http://localhost:4000',
  process.env.APP_UPCONTAEC || 'http://localhost:4000',
  process.env.APP_LOCALHOST || undefined, // http://localhost:4000
];
export const PUBLIC_VAPID_KEY =
  process.env.PUBLIC_VAPID_KEY ||
  'BEQ328X_S3MhQXwC5xw34eozhRYq--tkJfhWXkmicRk04dF4gj6PI_g3AENN0R4RHRqYIRYtbL4BwGPW-hK6ieY';
export const PRIVATE_VAPID_KEY =
  process.env.PRIVATE_VAPID_KEY ||
  'u35m5SPXoMUofC6D7oOJIiKPSYqev96HPdhc-JgCzsE';
