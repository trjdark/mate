/**
 * desc: 合同收付款管理api
 * User: colin.lu
 * Date: 2018/11/13
 * Time: 上午10:00
 */

import {Fetch} from "../service/fetch";
import {ContractApi} from "../api/contractApi";

/**
 * 新建收付款
 * @param params
 * @returns {Promise<any>}
 */
export const creatPayOrReceive = (params:any, submitRequestId:string):Promise<any> => {
    const param = {
        url: ContractApi.新建收付款,
        data: params,
        header: {
            submitRequestId: submitRequestId
        }
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 查询宝宝leads信息
 * @param params
 */
export const searchBaby = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询宝宝,
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
 * 原由为注册费是通过leadsId 查询能收付款的合同列表
 * @param params
 */
export const searchContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.通过leadsId查询合同,
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
 * 通过leadsId 对应合同id选取对应的付款
 * @param params
 */
export const searchLeadsInContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查找leads相对应的合同原由,
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
 * 获取收付款管理合同列表
 * @param params
 */
export const getPayAndReceiveManagement = (params:any) => {
    const param = {
        url: ContractApi.查询收付款列表,
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
 * 获取收付款管理合同列表
 * @param params
 */
export const getPartRefundList = (params:any) => {
    const param = {
        url: ContractApi.查询部分退费列表,
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
 * 删除非合同收付款
 * @param params
 */
export const deletePayAndReceive = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.删除非合同收付款,
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
 * 通过leadsId 对应合同id选取对应的付款
 * @param params
 */
export const confirmPay = (params:any, submitRequestId:string):Promise<any> => {
    const param = {
        url: ContractApi.确认合同付款,
        data: params,
        header: {
            submitRequestId: submitRequestId
        }
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 通过leadsId 对应合同id选取对应的付款
 * @param params
 */
export const confirmReceive = (params:any, submitRequestId:string):Promise<any> => {
    const param = {
        url: ContractApi.确认合同收款,
        data: params,
        header: {
            submitRequestId: submitRequestId
        }
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 通过leadsId aparID 查询合同收款详情
 * @param params
 */
export const getContractDetailAmount = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询合同类收付款详情,
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
 * 通过finicialId 查询非合同收款详情
 * @param params
 */
export const getUnContractDetail = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.查询非合同类收付款详情,
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
 * 通过finicialId 确认非合同收付款
 * @param params
 */
export const confirmUnContract = (params:any, submitRequestId:string):Promise<any> => {
    const param = {
        url: ContractApi.确认非合同收款,
        data: params,
        header:{
            submitRequestId: submitRequestId
        }
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

// 合同基本信息
export const getContractBasic = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.合同详情,
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
 * 通过leadsId aparID 退款
 * @param params
 */
export const returnContract = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.收付款退款,
        data: params
    };

    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        })
};
/**
 * 审批-部分退费
 * @param params
 * @returns {Promise<any>}
 */
export const approvePartRefund = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.审批部分退费,
        data: params
    };

    return Fetch.post(param);
};
/**
 * 退回部分退费
 * @param params
 * @returns {Promise<any>}
 */
export const cancelPartRefund = (params:any):Promise<any> => {
    const param = {
        url: ContractApi.退回部分退费付款,
        data: params
    };

    return Fetch.post(param);
};
