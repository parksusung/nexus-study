export const tokens = {
  access: {
    expiry: '6h',
    refreshExpiry: '1d',
  },
}

export const APP_SECRET = process.env.APP_SECRET!;
export const APP_REFRESH_SECRET = process.env.APP_REFRESH_SECRET!;
export const AWS_BUCKET = process.env.AWS_BUCKET!;
export const REDIS_SECRET = process.env.REDIS_SECRET!;
export const REDIS_PORT = process.env.REDIS_PORT!;
export const REDIS_HOST = process.env.REDIS_HOST!;

// export const EXTERNAL_ADDRESS = process.env.EXTERNAL_ADDRESS ?? "https://api.sellforyou.itez.io"
// export const TRANSLATE_ITEM_SERVER = "http://59.21.95.219:5010/getitem"

export const isDev = () => process.env.NODE_ENV === 'development'


export const regexPattern = {
  phone: /^(?:\+?82-?|0)(1(?:0|1|[6-9]))[.-]?(\d{3,4})[.-]?(\d{4})$/,
  tel: /^(01[016789]{1}|02|0[3-8]{1}[0-9]{1})[.-]?([0-9]{3,4})[.-]?([0-9]{4})$/,
  fileNameAndExtension: /^(.*)\.(.*)$/,
  httpUrl: /https?:\/\/[-\w.]+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?/,
  address: /((([가-힣]+(\d{1,5}|\d{1,5}(,|.)\d{1,5}|)+(읍|면|동|가|리))(^구|)((\d{1,5}(~|-)\d{1,5}|\d{1,5})(가|리|)|))([ ](산(\d{1,5}(~|-)\d{1,5}|\d{1,5}))|)|(([가-힣]|(\d{1,5}(~|-)\d{1,5})|\d{1,5})+(로|길)))/,
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  personalId: /^(\d{6})-?(\d{6})(\d)$/,
  companyId: /^(\d{3})-?(\d{2})-?(\d{5})$/,
};