// 格式化数字
export const formatNumber = (num) => {
  const resault = [];
  num = [...num.toString()];
  // eslint-disable-next-line no-plusplus
  for (let i = num.length - 1, j = 1; i >= 0; i--, j++) {
    resault.push(num[i]);
    console.log(resault);
    if (j === 3 && i !== 0) {
      resault.push(',');
      j = 0;
    }
  }
  return resault.reverse().join('');
};

export const formatTableDate = (row, column, cellValue) => cellValue;

// 补0至两位数
const padTwoZero = (num) => num.toString().padStart(2, '0');

// 时间戳转换为 xxxx-xx-xx
// export const formatDate = (timestamp) => {
//   timestamp = parseInt(timestamp, 10);
//   const date = new Date(timestamp);
//   return `${date.getFullYear()}-${padTwoZero(date.getMonth() + 1)}-${padTwoZero(date.getDate())}`;
// };

// 时间戳转换为 xxxx.xx.xx xx:xx:xx
export const formatFullDate = (timestamp) => {
  timestamp = parseInt(timestamp, 10);
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${padTwoZero(d.getMonth() + 1)}.${padTwoZero(d.getDate())} ${padTwoZero(d.getHours())}:${padTwoZero(d.getMinutes())}:${padTwoZero(d.getSeconds())}`;
};

// 0.12 -> 12
export const formatRate = (rate) => {
  if (!rate) {
    return 0;
  }
  const a = rate.toString().split('.');
  return a.length > 1 ? a[1] : rate;
};
function padLeftZero(str) {
  return (`00${str}`).substr(str.length);
}

// 日期格式化 传入参数：Date对象   时间格式模板
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  Object.keys(o).forEach((item) => {
    if (new RegExp(`(${item})`).test(fmt)) {
      const str = `${o[item]}`;
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  });
  return fmt;
}
