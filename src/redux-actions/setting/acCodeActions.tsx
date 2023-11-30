/**
 * desc: 激活码
 * User: Vicky
 * Date: 2020/7/3
 * Time: 15:20
 */

import {AcodeApi} from '@/api/aCodeApi';
import {Fetch} from "@/service/fetch";
import {downloadExcel} from "@redux-actions/report/downloadExcel";


/**
 * 获取激活码列表
 * @param params
 * @returns {Promise<any>}
 */
export const getcodeList = (params: any): Promise<any> => {
    const param = {
        url: AcodeApi.激活码管理列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
    })
};


/**
 * 获取未消耗兑换码
 * @param params
 * @returns {Promise<any>}
 */
export const getUnconsumptionCode  = (params:any):Promise<any> => {
    const param = {
        url: AcodeApi.未消耗兑换码,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
    })
};

/**
 * 获取已消耗兑换码
 * @param params
 * @returns {Promise<any>}
 */
export const getconsumptionCode = (params:any):Promise<any> => {
    const param = {
        url: AcodeApi.已消耗兑换码,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
    }

/**
 * 获取总兑换码
 * @param params
 * @returns {Promise<any>}
 */
export const gettotalCode = (params: any): Promise<any> => {
    const param = {
        url: AcodeApi.总兑换码数,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        }, (err: any) => {
            return Promise.reject(err)
        })
};
/**
 * 获取中心消耗详情
 * @param params
 * @returns {Promise<any>}
 */
export const getAcodeCodeDetail = (params: any): Promise<any> => {
    const param = {
        url: AcodeApi.根据手机号查询中心消耗详情,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 下载模版
 * @param data
 */
export const downloadTemplate = (data) => {
    downloadExcel(data, AcodeApi.激活码导入模版, '激活码导入模版.xlsx');
};
/**
 * 验证激活码
 * @param params
 * @returns {Promise<any>}
 */
export const verifyCode = (params: any): Promise<any> => {
    const param = {
        url: AcodeApi.验证激活码,
        data: params
    };
    return Fetch.post(param);
};

export const uploadCode = (params: any): Promise<any> => {
    const param = {
        url: AcodeApi.上传激活码,
        data: params
    };
    return Fetch.post(param);
};