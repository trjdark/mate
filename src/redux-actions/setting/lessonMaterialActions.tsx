/**
 *Desc: view层dispatch课程资料事件
 *User: Debby.Deng
 *Date: 2018/8/17,
 *Time: 下午3:54
 */

import {SetApi} from "../../api/settingApi";
import {Fetch} from "../../service/fetch";
import {ServiceActionEnum} from "../serviceActionsEnum";

export const getLessonMatList = (params) => {
    const param = {
        url: SetApi.获取课程资料列表,
        data: params
    };
    return Fetch.post(param)
};
export const getLessonMatInfo = (params) => {
    const param = {
        url: SetApi.获取课程资料信息,
        data: params
    };
    return Fetch.post(param)
};
/**
 * 获得课程分类
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const getLessonMatType = (params) => {
    return {
        type: ServiceActionEnum.课程资料分类,
        params:params
    }
};
/**
 * 获取升班课程
 * @param params
 * @returns {Promise<any>}
 */
export const getUpgradeMatInfo = (params) => {
    const param = {
        url: SetApi.获取升班课程,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 新增课程资料
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const createLessonMat = (params) => {
    const param = {
        url: SetApi.新增课程资料,
        data: params
    };
    return Fetch.post(param)
};

export const closeOrOpenLessonMat = (params) => {

    const param = {
        url: SetApi.封存解压课程资料,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 获取课程资料等级下拉列表
 * @param params
 * @returns {Promise<any>}
 */
export const getLessonLevel = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取课程资料等级下拉列表,
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
 * 获取课程资料等级下拉列表
 * @param params
 * @returns {Promise<any>}
 */
export const getCurrentLessonMatInfo = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取课程资料信息,
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
 * 获取课程资料等级下拉列表
 * @param params
 * @returns {Promise<any>}
 */
export const getRRPList = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取RRP模板列表,
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
 * 获取配置模板列表
 * @param params
 * @returns {Promise<any>}
 */
export const getRRPTemplateList = (params:any):Promise<any> => {
    const param = {
        url: SetApi.新建或编辑获取配置模板列表,
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
 * 新建RRP模板
 * @param params
 * @returns {Promise<any>}
 */
export const addRRPTemplate = (params:any):Promise<any> => {
    const param = {
        url: SetApi.新增RRP模板,
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
 * 新建RRP模板
 * @param params
 * @returns {Promise<any>}
 */
export const editRRPTemplate = (params:any):Promise<any> => {
    const param = {
        url: SetApi.编辑RRP模板,
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
 * 获取RRP模板详情
 * @param params
 * @returns {Promise<any>}
 */
export const getRRPTemplateDetail = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取配置模板列表,
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
 * 获取RRP配置
 * @param params
 * @returns {Promise<any>}
 */
export const getRRPConfig = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取RRP配置,
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
 * 获取RRP配置
 * @param params
 * @returns {Promise<any>}
 */
export const saveRRPConfig = (params:any):Promise<any> => {
    const param = {
        url: SetApi.保存RRP配置,
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
 * 是否推送RRP
 * @param params
 * @returns {Promise<any>}
 */
export const sendPush = (params:any):Promise<any> => {
    const param = {
        url: SetApi.推送RRP,
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
 * 获取预览
 * @param params
 * @returns {Promise<any>}
 */
export const getPrview = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取预览,
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
 * 获取预览
 * @param params
 * @returns {Promise<any>}
 */
export const getMonthList = (params:any):Promise<any> => {
    const param = {
        url: SetApi.获取月份,
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
 * 保存课程资料
 * @param params
 * @returns {Promise<any>}
 */
export const editLessonMat = (params:any):Promise<any> => {
    const param = {
        url: SetApi.修改课程资料,
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
 * 查询这个模板是否能编辑
 * @param params
 * @returns {Promise<any>}
 */
export const checkIfTemplateIsEnbale = (params:any):Promise<any> => {
    const param = {
        url: SetApi.查询这个模板是否能编辑,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
