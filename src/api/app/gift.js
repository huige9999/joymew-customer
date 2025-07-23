import request from '@/utils/request';

export const getCustomGiftList = ({ scenario }) => request.post('/gift/getCustomizGiftList', {
  scenario,
});

export const eidtCustomGift = ({ id, giftprice, giftname, order_by }) => request.post('/gift/editCustomizGift', {
  id,
  giftprice,
  giftname,
  order_by,
});
