/**
 * desc: 中心业绩目标设置表单请求方法
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/3/12
 * Time: 上午10:38
 */

import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/*获取业绩目标列表*/
export const getAchievementList = data=>{
    const params = {
        url: SetApi.获取中心业绩列表,
        data,
    };
    return Fetch.post(params);
};

/*获取业绩目标明细*/
export const getAchievementDetail = data=>{
    const params = {
        url: SetApi.获取中心业绩详情,
        data,
    };
    return Fetch.post(params);
};

/*新增业绩目标*/
export const addAchievement = data=>{
    const params = {
        url: SetApi.新增中心业绩,
        data,
    };
    return Fetch.post(params);
};

/*编辑业绩目标*/
export const editAchievement = data=>{
    const params = {
        url: SetApi.编辑中心业绩,
        data,
    };
    return Fetch.post(params);
};
