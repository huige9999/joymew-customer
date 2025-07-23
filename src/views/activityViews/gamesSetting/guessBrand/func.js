import store from '@/store';
/**
 * 根据参数得到服务端需要的数据格式
 */
export const getDataOfServerNeed = ({ img, answer, begin, firstTip, secondTip, id }) => {
  const getStarImg = () => {
    const tmpObj = {
      begin,
      one: firstTip,
      two: secondTip,
    };
    return JSON.stringify(tmpObj);
  };
  const result = {
    star_option: img,
    star_img: getStarImg(),
    star_answer: answer,
    star_type: '20',
    splid: store.state.liveId,
  };
  if (id) {
    result.star_id = id;
  }
  return result;
};

/**
   * 根据参数得到前端需要的数据格式
   */
export const getDataOfClientNeed = (serverData) => {
  return serverData.map((item) => {
    const { begin, one, two } = JSON.parse(item.star_img);
    return {
      id: item.star_id,
      img: item.star_option,
      answer: item.star_answer,
      begin: begin.join(','),
      firstTip: one.join(','),
      secondTip: two.join(','),
    };
  });
};
