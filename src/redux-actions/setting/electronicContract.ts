/**
 * desc: 电子合同用印接口
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/9/7
 * Time: 上午10:18
 */
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取用印流程列表
 * @param params
 */
export const getElectronicContractList = (params:any) => {
    const param = {
        url: SetApi.获取用印流程列表,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 添加合同用印流程
 * @param params
 * @returns {Promise<any>}
 */
export const addElectronicContract = (params:any) => {
    const param = {
        url: SetApi.添加用印流程,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 获取合同用印流程详情
 * @param params
 * @returns {Promise<any>}
 */
export const getElectronicContractDetail = (params:any) => {
    const param = {
        url: SetApi.获取用印流程详情,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 编辑合同用印流程
 * @param params
 * @returns {Promise<any>}
 */
export const updateElectronicContract = (params:any) => {
    const param = {
        url: SetApi.编辑用印流程,
        data: params
    };
    return Fetch.post(param)
};
