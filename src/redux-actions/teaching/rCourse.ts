/**
 * desc: R店主题
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/9/1
 * Time: 上午10:23
 */
import {Fetch} from "@/service/fetch";
import {TeachingApi} from "@/api/teachingApi";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {call, fork, put} from "redux-saga/effects";
import {Events} from "@/events/events";

/**
 * 获取R店主题资源库课程列表
 * @param params
 */
export const getRCourseList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源库课程列表,
        data: params
    };
    return Fetch.post(param);
};
export const getRCourseListNoPage = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源库课程列表无分页,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 获取R店主题资源库列表
 * @param params
 */
export const getRCourseThemeList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源库资源列表,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 添加R店主题
 * @param params
 */
export const addRCourseTheme = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源添加,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 删除R店主题
 * @param params
 */
export const deleteRCourseTheme = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源删除,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 更新R店主题
 * @param params
 */
export const updateRCourseTheme = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源更新,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 更新R店主题库资源排序
 * @param params
 */
export const updateRCourseThemeSort = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源更新排序,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 更新R店主题资源库音乐
 * @param params
 */
export const updateRCourseMusic = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.R店主题资源更新音乐,
        data: params
    };
    return Fetch.post(param);
};

export const getSourceFromCRM = (param) => {
    return {
        type: ServiceActionEnum.获取CRM静态资源,
        params: param
    }
}

/**
 * 获取 CRM 资源
 * @param action
 */
export function* getSourceInit(action:any) {
    yield fork(getRCourseVideo, action);
    yield fork(getRCourseAudio,action);
    yield fork(getRCourseImage,action);
}

function *getRCourseVideo(action:any) {
    const params = {
        url: TeachingApi.查询CRM资源列表,
        data: Object.assign({}, action.params, {type: 'video'})
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params, 30000);
        yield put({
            type: Events.CRM_VIDEO_LIST,
            data: response
        })
    }catch (e) {

    }
}

function *getRCourseAudio(action:any) {
    const params = {
        url: TeachingApi.查询CRM资源列表,
        data: Object.assign({}, action.params, {type: 'audio'})
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.CRM_AUDIO_LIST,
            data: response
        })
    }catch (e) {

    }
}

function *getRCourseImage(action:any) {
    const params = {
        url: TeachingApi.查询CRM资源列表,
        data: Object.assign({}, action.params, {type: 'image'})
    };
    try{
        const response = yield call(Fetch.post.bind(Fetch), params);
        yield put({
            type: Events.CRM_IMAGE_LIST,
            data: response
        })
    }catch (e) {

    }
}

export const getOssToken = (params:any, type):Promise<any> => {
    const param = {
        url: `${TeachingApi.获取oss的key}${type}`,
        data: params
    };
    return Fetch.post(param);
};

export const updatePlan = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.更新R店主题资源库教案,
        data: params
    };
    return Fetch.post(param);
};

export const updateFeedback = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.更新R店主题资源库随堂反馈,
        data: params
    };
    return Fetch.post(param);
};

export const getRCourseThemeSet = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.获R店资源库配置,
        data: params
    };
    return Fetch.post(param);
};
export const updateRCourseThemeSet = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.更新获R店资源库配置,
        data: params
    };
    return Fetch.post(param);
};


export const getAppCourseList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.获取app课程列表,
        data: params
    };
    return Fetch.post(param);
};

export const updateAppCourse = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.更新app课程,
        data: params
    };
    return Fetch.post(param);
};

