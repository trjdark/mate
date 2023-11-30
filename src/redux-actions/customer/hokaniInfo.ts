/**
 * Desc: 客户360，其他信息
 * User: dave.zhang
 */
import {Fetch} from '@/service/fetch'
import {CustomerApi} from "../../api/customerApi";

export const getFinancialRecordInfo = (params)=>{
  const data={
      url: CustomerApi.查询收支记录信息,
      data: params
  }
  return Fetch.post(data);
}

export const getMemberInfo = (params)=>{
  const data={
      url: CustomerApi.查询会籍信息,
      data: params
  }
  return Fetch.post(data);
}

export const updateMemberInfo = (params)=>{
  const data={
      url: CustomerApi.跟新会籍信息,
      data: params
  }
  return Fetch.post(data);
}
