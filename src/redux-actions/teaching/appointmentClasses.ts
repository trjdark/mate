/**
 * desc: viewlogin logout(action)
 * User: colin.lu
 * Date: 2018/8/15
 * Time: 下午20:10
 */
import {TeachingApi} from '@/api/teachingApi'
import {Fetch} from "../../service/fetch";

 /**
 * 获取可约课等位中心列表
 * @param  params
 * @returns {Promise}
 */
export const getClassesAlleleList = (params) => {
  const param = {
    url: TeachingApi.约课等位中心列表,
    data: params
  };
  return Fetch.post(param)
};

 /**
 * 某一个中心是否能约课等位
 * @param  params
 * @returns {Promise}
 */
export const whetherClassesAlleleList = (params) => {
  const param = {
    url: TeachingApi.中心是否能约课等位,
    data: params
  };
  return Fetch.post(param)
};


 /**
 * 修改中心是否能约课等位
 * @param  params
 * @returns {Promise}
 */
export const updateClassesAlleleList = (params) => {
  const param = {
    url: TeachingApi.修改中心约课等位,
    data: params
  };
  return Fetch.post(param)
};