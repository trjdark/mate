/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/9/3
 * Time: 下午5:40
 */
import {Fetch} from "../../service/fetch";
import {TeachingApi} from '../../api/teachingApi';

/**
 * Desc 课程主题设置(Art)详情页面
 * @returns {any}
 */
export const getTeachPlanConfigDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.中心主题配置详情页面,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * 课程主题设置(Art)保存
 * @param params
 * @returns {Promise<any>}
 */
export const setTeachPlanConfig = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.中心主题配置保存,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        });
};
/**
 * Desc 课程主题设置(Art)详情页面新
 * @returns {any}
 */
export const getTeachPlanConfigDetailNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.中心主题配置详情页面新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 课程主题设置(Art)保存
 * @param params
 * @returns {Promise<any>}
 */
export const setTeachPlanConfigNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.中心主题配置保存新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
