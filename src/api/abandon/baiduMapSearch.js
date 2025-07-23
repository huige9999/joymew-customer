/* eslint-disable */
import request from '@/utils/request';

// 获取地点信息
// api: http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-placeapi
export function baiduMapLocalSearch(keyWord) {
  return request.post('/live_api/getBaiDuPlace', {
    query: keyWord,
    region: '全国',
    scope: '1',
  }).then((response) => {
    if (response.status === 0) {
      console.log(response);
      return response.results;
    }
    // 默认值
    return [{ value: '无推荐结果' }];
  });
}
