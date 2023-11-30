import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
*Desc: view层发起的人员相关事件dispatch(action)
*User: Debby.Deng
*Date: 2018/8/16,
*Time: 下午5:53
*/

export const getCourseList = (params) => {
    const param = {
        url: SetApi.获取课程分类列表,
        data: params
    };
    return Fetch.post(param);
};

export const getCourseCateInfo = (params) => {
    const param = {
        url: SetApi.获取课程分类信息,
        data: params
    };
    return Fetch.post(param);
};

export const addCourse = (params) => {
    const param = {
        url: SetApi.新增课程分类,
        data: params
    };
    return Fetch.post(param);
};

export const updateCourse = (params) => {
    const param = {
        url: SetApi.更新课程分类,
        data: params
    };
    return Fetch.post(param);
};
