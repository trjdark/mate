import {Fetch} from '@/service/fetch'
import {SetApi} from '@/api/settingApi';
export const getFinancialAdministration = (params)=>{
  const data =  {
    url: SetApi.获取财务管理配置信息,
    data:params
  }
  return Fetch.post(data)
};

export const setFinancialAdministration = (params)=>{
  const data =  {
    url: SetApi.编辑财务管理配置信息,
    data:params
  }
  return Fetch.post(data)
};