/**
 * desc: 教学管理/测评报告/库api
 * User: Vicky.Yu
 * Date: 2020/6/5
 * Time: 15:10
 */

import {Fetch} from "../../service/fetch";
import {TeachingApi} from '../../api/teachingApi';
import {downloadExcel} from "@redux-actions/report/downloadExcel";

/**
 * Desc 获取测评库列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getEvaluationLibList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.测评库列表,
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
 * Desc 获取测评库项目列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getProjectList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.获取项目列表,
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
 * 月龄列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getCourseMonths = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.获取月龄学阶,
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
 * Desc 编辑测评库
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const editEvaluationLib = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.编辑测评库,
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
 * Desc 测评库详情
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getEvaluationLibDetail = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.测评库详情,
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
 * Desc 新建测评库
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const createEvaluationLib = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.新建测评库,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};
// 测评报告
/**
 * Desc 编辑测评报告
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const editReport = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.编辑测评报告,
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
 * Desc 编辑查询测评报告详情
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const editReportDetail = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.编辑查询测评报告详情,
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
 * 新建测评报告
 * @param action
 * @returns {any}
 */

export const  createReport= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.新建测评报告,
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
 * 查看报告雷达图
 * @param action
 * @returns {any}
 */

export const getReportRadar = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.报告雷达图,
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
 * 可选学阶
 * @param action
 * @returns {any}
 */

export const  getUserfulMonths= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.可选学阶,
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
 * 获取测评报告列表
 * @param action
 * @returns {any}
 */

export const  getReportList= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.获取测评报告列表,
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
 * 选择测评报告列表
 * @param action
 * @returns {any}
 */

export const  getBabysReportList= (params:any):Promise<any> =>{
    const param = {
        url: TeachingApi.选择测评报告列表,
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
 * 选择测评报告列表(查看)
 * @param action
 * @returns {any}
 */

export const getBabysReportListALL = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.查看选择测评宝宝报告列表,
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
 * 新建未选测评
 * @param action
 * @returns {any}
 */
export const getInitLib = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.新建未选测评,
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
 * 客户中心宝宝测评列表
 * @param action
 * @returns {any}
 */
export const getCustomerReportList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户中心宝宝测评列表,
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
 * 发送至app
 * @param action
 * @returns {any}
 */
export const sendToApp = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.发送至App,
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
 * 默认学阶
 * @param action
 * @returns {any}
 */
export const getDefaultCourse = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.默认学阶,
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
 * 测评库重复项（新建）
 * @param action
 * @returns {any}
 */
export const evluateRepeat = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.测评库重复项,
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
 * 测评库重复项（编辑）
 * @param action
 * @returns {any}
 */
export const evluateEditRepeat = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.编辑时测评库重复项,
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
 * 客户中心宝宝升班报告
 * @param action
 * @returns {any}
 */
export const getPromotionReportList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户中心宝宝升班报告,
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
 * Desc 查询升班报告详情
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const promotionReportDetail = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.升班报告查询详情,
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
 * Desc 升班报告预览详情
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const promotionReportPreview = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.升班报告预览详情,
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
 * Desc 导出升班报告预览报告
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const exportPromotionReportPreview = data => {
    downloadExcel(data, TeachingApi.导出升班报告预览详情, '升班报告预览详情.xlsx');
};
/**
 * Desc 导出升班报告查询报告
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const exportPromotionReport = data => {
    downloadExcel(data, TeachingApi.导出升班报告查询详情, '升班报告查询详情.xlsx');
};
/**
 * 升班报告同步至启蒙
 * @param action
 * @returns {any}
 */
export const sendPromotionReportToApp = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.升班报告同步至启蒙,
        data: params
    };

    return Fetch.post(param)
        .catch((err: any) => {
            return Promise.reject(err)
        })
};
