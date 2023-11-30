import {Fetch} from '@/service/fetch'
import {SetApi} from "@/api/settingApi";

export const importContractLeads = (params)=>{
    const data =  {
        url: SetApi.导入合同leads,
        data:params
    }
    return Fetch.post(data)
};
