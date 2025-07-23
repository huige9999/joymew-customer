import request from '@/utils/request';

// 获取优先展示的教程
export function getTeachVideoPriority() {
  return request.post('/showJc/showJcPriority', {});
}

export function getTeachVideoByType({ type = '', currentPage = 1, showCount = 10 }) {
  return request.post('/showJc/showJcByType', {
    type,
    currentPage,
    showCount,
  });
}

// 记录课程播放时间
export function recordVideoPlayTime({ title, seeTime }) {
  return request.post('/showJc/clickEvent', {
    type: '1',
    title,
    seeTime,
  });
}

export function watchJcUpIncome(jcId) {
  // alert(`jcID${jcId}`);
  return request.get('/showJc/watchJcUpIncome', {
    params: {
      jcId,
    },
  });
}

export function showJcUpincomeJcList() {
  return request.get('/showJc/upIncomeJcList', {});
}
