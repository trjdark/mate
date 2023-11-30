/**
 * Desc:
 * User: dave.zhang
 * Date: 2018/10/8,
 * Time: 下午1:31
 */
import {Fetch} from '@/service/fetch'
import {SetApi} from '@/api/settingApi';
import {CustomerApi} from "@/api/customerApi";

export const getCodeInfoByType = ({currentCenterId,type})=>{
    const data={
        url: SetApi.根据类型获取字典数据,
        data: {currentCenterId,type}
    };
    return Fetch.post(data);
};

export const createleads = (params)=>{
    const data={
        url: CustomerApi.创建Leads信息,
        data: params
    };
    return Fetch.post(data);
};

export const getMonthValue = (params)=>{
    const data={
        url: CustomerApi.获取月龄,
        data: params
    };
    return Fetch.post(data);
};

export const checkPrimaryContactTel = ({currentCenterId,primaryContactTel,contactId})=>{
  const data={
    url:CustomerApi.检测联系人手机号是否已被占用,
    data:{currentCenterId,primaryContactTel,contactId}
  };
  return Fetch.post(data)
};

export const getLeadsInOtherCenterByTel = (params)=>{
  const data={
    url:CustomerApi.根据手机号码查询跨中心信息,
    data:params
  };
  return Fetch.post(data)
};

export const findRecommendList = (params)=>{
  const data={
    url:CustomerApi.查询推荐人列表信息,
    data:params
  };
  return Fetch.post(data)
};

export const getAllGaList = ({currentCenterId})=>{
  const data={
    url:CustomerApi.查询GAHGA在职离职,
    data:{currentCenterId}
  };
  return Fetch.post(data)
};

export const getAllGbList = ({currentCenterId})=>{
  const data={
    url:CustomerApi.查询GBHGB在职离职,
    data:{currentCenterId}
  };
  return Fetch.post(data)
};

export const getCodeInfoByParentCode = ({currentCenterId,parentCode})=>{
  const data={
    url:SetApi.根据上一级地区查找下一级地区列表,
    data:{currentCenterId,parentCode}
  };
  return Fetch.post(data)
};
/**
 * 批量建任务
 * @param params
 */
export const mulitCreateTask = (params) => {
    const data = {
        url: CustomerApi.批量建任务,
        data:params
    }
    return Fetch.post(data)
};
/**
 * 获取GB批量建任务提信息
 * @param params
 */
export const queryTaskInfo = (params) => {
    const data = {
        url: CustomerApi.获取GB三天内批量建任务提信息,
        data:params
    }
    return Fetch.post(data)
}
/**
 * 是否含有TMK中心
 * @param param
 */
export const hasTMKCenter = (params) => {
    const data = {
        url: CustomerApi.是否含有TMK中心,
        data:params
    }
    return Fetch.post(data)
};
