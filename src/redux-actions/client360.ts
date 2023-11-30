/**
 * Desc:
 * User: dave.zhang
 */
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {Fetch} from '@/service/fetch'
import {SetApi} from '@/api/settingApi';
import {CustomerApi} from "@/api/customerApi";

export const getCustomerBasicInfo = ({currentCenterId,leadsId})=>{
    return {
      type: ServiceActionEnum.获取客户360基本信息,
      params: {currentCenterId,leadsId}
    }
};

export const getBabyInformation = ({currentCenterId,leadsId})=>{
  const data={
      url: CustomerApi.客户360宝宝信息,
      data: {currentCenterId,leadsId}
  };
  return Fetch.post(data);
};

export const updateCustomerBabyInfo = (params)=>{
  const data={
    url: CustomerApi.更新宝宝信息,
    data: params
  };
  return Fetch.post(data);
};

export const deleteCustomerBabyInfo = (params)=>{
  const data={
    url:CustomerApi.删除宝宝信息,
    data:params
  };
  return Fetch.post(data)
};

export const getCustomerContactInfo = (params)=>{
  const data={
    url:CustomerApi.查询联系人信息,
    data:params
  };
  return Fetch.post(data)
};

export const deleteCustomerContactInfo = (params)=>{
  const data={
    url:CustomerApi.删除联系人信息,
    data:params
  };
  return Fetch.post(data)
};

export const updateCustomerContactInfo = (params)=>{
  const data={
    url:CustomerApi.更新联系人信息,
    data:params
  };
  return Fetch.post(data)
};

export const getCodeInfoByTypeRedux = ({type,currentCenterId})=>{
  return {
    type: ServiceActionEnum.根据类型获取字典数据,
    params:{type,currentCenterId}
  }
};

export const getCodeInfoByType = ({type,currentCenterId})=>{
  const data={
    url:SetApi.根据类型获取字典数据,
    data:{type,currentCenterId}
  };
  return Fetch.post(data)
};

export const getCustomerAddressInfo = ({currentCenterId,leadsId})=>{
  const data={
    url:CustomerApi.查询住址信息,
    data:{currentCenterId,leadsId}
  };
  return Fetch.post(data)
};

export const updateCustomerAddressInfo = (params)=>{
  const data={
    url:CustomerApi.更新住址信息,
    data:params
  };
  return Fetch.post(data)
};

export const getValidPromotorInCurrentCenter = (params)=>{
  const data={
    url:CustomerApi.获取当前中心有效promotor列表,
    data:params
  };
  return Fetch.post(data)
};

export const getValidMarketingActivityInCurrentCenter = (params)=>{
  const data={
    url:CustomerApi.获取当前中心有效市场活动列表,
    data:params
  };
  return Fetch.post(data)
};

export const leadsStatusModify = (params)=>{
  const data={
    url:CustomerApi.leads状态变更,
    data:params
  };
  return Fetch.post(data)
};

export const hasPermissonToEdit=(params)=>{
    return {
        type: ServiceActionEnum.基本信息是否可编辑,
        params
    }
};

/*分配GA，GB*/
export const handleAssignGAGB = (params)=>{
  const data={
      url: CustomerApi.分配当前leads,
      data: params,
  };
  return Fetch.post(data);
};
/**
 * 获取修改日志信息
 * @param params
 * @returns {Promise<any>}
 */
export const getLeadsOperatedLogInfo = (params)=>{
    const data={
        url:CustomerApi.获取修改日志信息,
        data:params
    };
    return Fetch.post(data)
};

/**
 * 获取各阶段leads数量(快速查询)
 * @param params
 * @returns {Promise<any>}
 */
export const getQueryPhaseNums = (params) => {
    const data={
        url:CustomerApi.获取阶段leads数量_快速查询,
        data:params
    };
    return Fetch.post(data, 60000)
};
/**
 * 获取各阶段leads数量
 * @param params
 * @returns {Promise<any>}
 */
export const getPhaseNums = (params) => {
    const data={
        url:CustomerApi.获取阶段leads数量,
        data:params
    };
    return Fetch.post(data, 60000)
};
