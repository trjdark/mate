/**
*Desc: promotor view层触发事件管理
*User: Debby.Deng
*Date: 2018/8/21,
*Time: 上午11:50
*/
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

export const getPromotorList = (params:any) => {
    const param = {
        url: SetApi.获取promotor列表,
        data: params
    };
    return Fetch.post(param)
};
export const addPromotor = (params:any) => {
    const param = {
        url: SetApi.添加promotor,
        data: params
    };
    return Fetch.post(param)
};
export const getPromotorInfo = (params:any) => {
    const param = {
        url: SetApi.获取promotor信息,
        data: params
    };
    return Fetch.post(param)
};
export const updatePromotor = (params:any) => {
    const param = {
        url: SetApi.更新promotor信息,
        data: params
    };
    return Fetch.post(param)
};
