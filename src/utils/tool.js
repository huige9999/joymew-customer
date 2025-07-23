/* eslint-disable */
// 返回每页条数
export function getActivityMaxShowCount(height) {
  const num = Math.floor(height / 165);
  if (num < 1) {
    return 1;
  }
  return num;
}

//根据url获取参数   /api/getnew?id=1
export function getQuery(url, name) {
  const index = url.indexOf('?');
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split('&');
    for (var i = 0; i < queryStrArr.length; i++) {
      const itemArr = queryStrArr[i].split('=');
      if (itemArr[0] === name) {
        return itemArr[1];
      }
    }
  }
  return null;
}
