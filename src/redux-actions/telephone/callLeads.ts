/**
 * desc: 云语音leads 事件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/5
 * Time: 下午5:09
 */
import {Fetch} from "../../service/fetch";
import {Storage} from "@/common/utils/storage";
import {SetApi} from "@/api/settingApi";
import {CustomerApi} from "@/api/customerApi";


/**
 * 获取中心下TMK人员列表
 * @returns {Promise<any>}
 */
export const getCenterMemberList = (params):Promise<any> => {
    const data = {
        url: SetApi.根据中心ID查找tmk人员列表,
        data: params
    };
    return Fetch.post(data);
}


/**
 * 记录打电话leads列表（保存在本地）
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const recordTelephoneMembers = (params:any) => {
    Storage.set('memberList', params)
};

/**
 * 获取打电话leads列表
 * @returns {any}
 */
export const getTelephoneMembers = () => {
    return Storage.get('memberList')
};

/**
 * 获取分机号
 * @param params
 * @returns {Promise<any>}
 */
export const getExNum = (params):Promise<any> => {
    const data = {
        url: CustomerApi.获取云语音分机号,
        data: params
    };
    return Fetch.post(data);
}
/**
 * 新增坐席
 * @param params
 * @returns {Promise<any>}
 */
export const addLandLine = (params):Promise<any> => {
    const data = {
        url: CustomerApi.新增坐席,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 根据ID查询坐席详情
 * @param params
 * @returns {Promise<any>}
 */
export const getSeatInfo = (params):Promise<any> => {
    const data = {
        url: CustomerApi.获取坐席信息,
        data: params
    };
    return Fetch.post(data);
}
/**
 * 新增坐席
 * @param params
 * @returns {Promise<any>}
 */
export const editLandLine = (params):Promise<any> => {
    const data = {
        url: CustomerApi.更新坐席,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 获取坐席列表
 * @param params
 * @returns {Promise<any>}
 */
export const getLandLineList = (params):Promise<any> => {
    const data = {
        url: CustomerApi.获取坐席记录,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 查询leads通话记录
 * @param params
 * @returns {Promise<any>}
 */
export const getCallRecords = (params):Promise<any> => {
    const data = {
        url: CustomerApi.查询leads通话记录,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 保存通话记录任务
 * @param params
 * @returns {Promise<any>}
 */
export const saveCallTask = (params):Promise<any> => {
    const data = {
        url: CustomerApi.保存通话记录任务,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 更新共话记录（云语音）
 * @param params
 * @returns {Promise<any>}
 */
export const updateCallRecordRemark = (params):Promise<any> => {
    const data = {
        url: CustomerApi.编辑通话记录任务描述,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 根据leadsId数组获取leads信息
 * @param params
 * @returns {Promise<any>}
 */
export const getLeadsInfoByLeadsIdList = (params):Promise<any> => {
    const data = {
        url: CustomerApi.根据id获取leads信息,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 修改联系人信息（云语音）
 * @param params
 * @returns {Promise<any>}
 */
export const updateContact = (params):Promise<any> => {
    const data = {
        url: CustomerApi.修改联系人信息,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 添加联系人信息（云语音）updateBabyInfo
 * @param params
 * @returns {Promise<any>}
 */
export const addContact = (params):Promise<any> => {
    const data = {
        url: CustomerApi.添加联系人信息,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 添加宝宝信息（云语音）
 * @param params
 * @returns {Promise<any>}
 */
export const updateBabyInfo = (params):Promise<any> => {
    const data = {
        url: CustomerApi.修改宝宝信息,
        data: params
    };
    return Fetch.post(data);
};
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const checkLandLine = (params):Promise<any> => {
    const data = {
        url: CustomerApi.校验坐席,
        data: params
    };
    return Fetch.post(data);
};
