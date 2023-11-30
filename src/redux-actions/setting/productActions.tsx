import {Fetch} from "../../service/fetch";
import {SetApi} from "../../api/settingApi";

/**
 * 获取产品列表（无分页）
 * @param params
 * @returns {Promise<any>}
 */
export const getProductListNoPages = (params):Promise<any> => {
    const param = {
        url: SetApi.获取总产品列表,
        data: params
    }
    return Fetch.post(param).then((res:any) => {
        return Promise.resolve(res)
    }, (err:any) => {
        return Promise.reject(err)
    })
}

/**
 * 获取产品列表
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
export const getProductList = (params) => {
    const param = {
        url: SetApi.获取产品列表,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取产品信息
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
export const getProductInfo = (params) => {
    const param = {
        url: SetApi.获取产品信息,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 添加产品
 * @param  params
 * @returns {{type: ServiceActionEnum; params: }}
 */
export const addProduct = (params) => {
    const param = {
        url: SetApi.添加产品,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 更新产品
 * @param params
 * @returns {{type: ServiceActionEnum; params: }}
 */
export const updateProduct = (params) => {
    const param = {
        url: SetApi.更新产品,
        data: params
    };
    return Fetch.post(param);
};
