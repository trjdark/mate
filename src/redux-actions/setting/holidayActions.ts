/**
 * desc: 节假日事件
 * Date: 2018/8/22
 * Time: 下午7:00
 */
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**ß
 * 获取节假日列表
 */
export const getHolidayList = (params:any) => {
    const param = {
        url: SetApi.获取节假日列表,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 添加节假日
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addHoliday = (params:any) => {
    const param = {
        url: SetApi.添加节假日,
        data: params
    };
    return Fetch.post(param);
}
/**
 * 获取节假日
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getHoliday = (params:any) => {
    const param = {
        url: SetApi.获取节假日,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 修改节假日
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateHoliday = (params:any) => {
    const param = {
        url: SetApi.更新节假日,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 更新节假日
 * @param action
 * @returns {IterableIterator<any>}
 */
export const checkHoliday = (params:any):Promise<any> => {
    const data = {
        url: SetApi.检查节假日,
        data: params
    };
    return Fetch.post(data)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        });
};
