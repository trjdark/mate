/**
 * desc: 点评库
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/9/1
 * Time: 上午10:23
 */
import {Fetch} from "../../service/fetch";
import {TeachingApi} from '../../api/teachingApi';

/**
 * Desc 获取点评库教案列表
 * @returns {any}
 */
export const getReviewQueryList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库教案列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取点评库教案详情
 * @param params
 * @returns {Promise<any>}
 */
export const getReviewDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库教案详情,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};

/**
 * 保存&更新教案计划
 * @param params
 * @returns {Promise<any>}
 */
export const saveReview = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库教案保存,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};

/**
 * 获取点评库主题详情
 * @param params
 * @returns {Promise<any>}
 */
export const getThemeDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库主题详情,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 更新保存点评库主题
 * @param params
 * @returns {Promise<any>}
 */
export const saveThemeDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库主题保存,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取随堂表现教具
 * @param params
 * @returns {Promise<any>}
 */
export const getPerformancePieceContent = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.随堂表现教具,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取能力发展教具
 * @param params
 * @returns {Promise<any>}
 */
export const getAbilityPieceContent = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.能力发展教具,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 点评库新增教具
 * @param params
 * @returns {Promise<any>}
 */
export const insertPieceContent = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.点评库新增教具,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
// 点评库2.0
/**
 * Desc 获取点评库教案列表
 * @returns {any}
 */
export const getReviewQueryListNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.点评库教案列表新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取点评库教案详情
 * @param params
 * @returns {Promise<any>}
 */
export const getReviewDetailNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.点评库教案详情新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取点评库主题详情新
 * @param params
 * @returns {Promise<any>}
 */
export const getThemeDetailNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.点评库主题详情新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 更新保存点评库主题新
 * @param params
 * @returns {Promise<any>}
 */
export const saveThemeDetailNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.点评库主题保存新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
