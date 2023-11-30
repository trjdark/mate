import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "../../api/customerApi";

export const getAssignRecordList = (params)=>{
    return {
        type: ServiceActionEnum.获取分配记录列表,
        params: params
    }
};

export const getTransferCenterList = (params)=>{
  const data={
      url: CustomerApi.转中心列表,
      data: params
  };
  return Fetch.post(data);
}

export const getCenterLeadsList = (params)=>{
  const data={
    url:CustomerApi.leads转中心记录,
    data:params
  }
  return Fetch.post(data);
}

export const getCenterMemberList = (params)=>{
  const data={
    url:CustomerApi.会员转中心记录,
    data:params
  }
  return Fetch.post(data);
};
