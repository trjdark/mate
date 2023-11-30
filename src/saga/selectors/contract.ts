/**
 * desc: 合同相关选择器
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/13
 * Time: 上午10:19
 */
import {Events} from "../../events/events";


/**
 * 合同模块基础配置
 * @param state
 * @returns {{}}
 */
export const selectContractBasicConfig = (state:any) => {
    const contractCache = state["contract"];
    return (contractCache[Events.GET_CONTRACT_BASIC_CONFIG] || {}).data || [];
}

/**
 * 合同模块基础配置(审核状态)
 * @param state
 */
export const selectContractApprovalStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '合同审核状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
}

/**
 * 合同模块基础配置(修改请假次数申请审批状态)
 * @param state
 * @returns {any}
 */
export const selectContractLeaveStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '修改请假次数申请审批状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(赠课申请审批状态)
 * @param state
 * @returns {any}
 */
export const selectContractFreeStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '赠课申请审批状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
}

/**
 * 合同模块基础配置(合同延期申请审批状态)
 * @param state
 * @returns {any}
 */
export const selectContractDelayStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '合同延期申请审批状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
}

/**
 * 合同模块基础配置(合同退课申请审批状态)
 * @param state
 * @returns {any}
 */
export const selectContractReturnStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '退课申请审核状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同类型)
 * @param state
 * @returns {any}
 */
export const selectContractTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '合同类型');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同类型)
 * @param state
 * @returns {any}
 */
export const selectExpireContractTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '过期合同处理状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同改包)
 * @param state
 * @returns {any}
 */
export const selectChangePkgTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '改包申请审核状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同转中心申请)
 * @param state
 * @returns {any}
 */
export const selectChangeCenterTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '转中心审核状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同转中心申请)
 * @param state
 * @returns {any}
 */
export const selectUsageTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '使用情况类型');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};
/**
 * 合同模块基础配置(合同付款状态)
 * @param state
 * @returns {any}
 */
export const selectPaymentStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '支付状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(合同状态)
 * @param state
 * @returns {any}
 */
export const selectContractStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '合同状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(转中心类型)
 * @param state
 * @returns {any}
 */
export const selectTransCenterType = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '转中心类型');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(收款管理原由)
 * @param state
 * @returns {any}
 */
export const selectTransReceiveReasonType = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '入金/收款');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同模块基础配置(付款管理原由)
 * @param state
 * @returns {any}
 */
export const selectTransPayReasonType = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '出金/付款');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同特殊调整状态
 * @param state
 * @returns {any}
 */
export const selectContractReviseStatus = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '调整单状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

/**
 * 合同特殊调整状态
 * @param state
 * @returns {any}
 */
export const selectContractReviseType = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '调整单类型');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};


/**
 *
 * @param state
 * @returns {any}
 */
export const selectContractPartRefundTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '部分退费状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};

export const selectPartRefundDetailTypes = (state:any) => {
    const config = selectContractBasicConfig(state);
    const status = config.filter((item:any) => item.name === '部分退费详情状态');
    if(status.length > 0){
        return status[0].codeValue;
    }
    return [];
};
