/**
 * desc: 中心课程包管理
 * Date: 2018/8/23
 * Time: 下午8:06
 */

import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";

/**
 * 获取中心课程包列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenterPackageList = (params:any) => {
    const param = {
        url: SetApi.获取中心课程包列表,
        data: params
    };
    return Fetch.post(param)
}

/**
 * 获取中心课程包
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenterPackage = (params:any) => {
    const param = {
        url: SetApi.获取中心课程包,
        data: params
    };
    return Fetch.post(param)
};

/**
 * 获取中心课程包定价历史列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenterPackagePriceHistoryList = (params:any) => {
    const param = {
        url: SetApi.获取中心课程包定价历史列表,
        data: params
    };
    return Fetch.post(param)
}

/**
 * 获取中心课程包促销历史列表
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getCenterPackagePromotionHistoryList = (params:any) => {
    const param = {
        url: SetApi.获取中心课程包促销历史列表,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 创建中心课程包促销学习
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const addCenterPackagePromotion = (params:any) => {
    const param = {
        url: SetApi.创建中心课程包促销,
        data: params
    };
    return Fetch.post(param)
}
/**
 * 更新中心课程包促销学习
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const updateCenterPackagePromotion = (params:any) => {
    const param = {
        url: SetApi.更新中心课程包促销信息,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 更新中心课程包定价信息
 * @param params
 * @returns {{type: any; params: any}}
 */
export const updateCenterPackagePrice = (params:any) => {
    const param = {
        url: SetApi.更新中心课程包定价信息,
        data: params
    };
    return Fetch.post(param)
}

/**
 * 添加中心课程包定价信息
 * @param params
 * @returns {{type: any; params: any}}
 */
export const addCenterPackagePrice = (params:any) => {
    const param = {
        url: SetApi.创建中心课程包定价,
        data: params
    };
    return Fetch.post(param)
}
