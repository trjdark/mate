import {Fetch} from "../../service/fetch";
import {TelephoneApi} from "../../api/telephoneApi";

/**
 * 获取黑名单列表
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
 export const getBlackList = (params) => {
  const param = {
      url: TelephoneApi.获取黑名单列表,
      data: params
  };
  return Fetch.post(param);
};

/**
 * 获取非黑名单列表
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
 export const getNonBlackList = (params) => {
  const param = {
      url: TelephoneApi.获取非黑名单列表,
      data: params
  };
  return Fetch.post(param);
};

/**
 * 黑名单添加
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
 export const addBlackList = (params) => {
  const param = {
      url: TelephoneApi.黑名单添加,
      data: params
  };
  return Fetch.post(param);
};

/**
* 黑名单移除
* @param params
* @returns {{type: ServiceActionEnum; params: }}
*/
export const delBlackList = (params) => {
  const param = {
      url: TelephoneApi.黑名单移除,
      data: params
  };
  return Fetch.post(param);
};

