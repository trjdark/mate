/**
 * desc: 云语音通话记录
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/16
 * Time: 下午4:51
 */
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "@/api/customerApi";
import {SetApi} from "@/api/settingApi";
import {Axios} from "@/service/axios";
import {Storage} from "@/common/utils/storage";
import {User} from "@/common/beans/user";
import {TelephoneApi} from "@/api/telephoneApi";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";

/**
 * 通话记录列表
 * @param params
 * @returns {Promise<any>}
 */
export const queryCallRecords = (params):Promise<any> => {
    const data = {
        url: CustomerApi.通话记录列表,
        data: params
    };
    return Fetch.post(data);
}
/**
 * 获取中心通话记录列表
 * @param params
 * @returns {Promise<any>}
 */
export const queryCenterCallRecords = (params):Promise<any> => {
    const data = {
        url: CustomerApi.中心通话记录列表,
        data: params
    };
    return Fetch.post(data);
}
/**
 * 下载文件
 * @param params
 * @returns {Promise<any>}
 */
export const downloadRecordsFile = (params) => {
    const body = {
        url: `/api${SetApi.多类型文件下载}`,
        data: params,
        header: {
            token: Storage.get('_token'),
            Accept: '*/*',
            centerCode: User.centerCode,
            userId: User.userId,
            userName: User.userName
        },
    }
    Axios.postFormData(body)
        .then((res:any) => {
            let blob = new Blob([res]);
            let link = document.createElement('a');
            link.download = '录音.mp3';
            link.target = '_self';
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
        })
}

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getPayHistory = (params):Promise<any> => {
    const data = {
        url: TelephoneApi.账户缴费记录,
        data: params
    };
    return Fetch.post(data);
}

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getCusReportInfo = (params):Promise<any> => {
    const data = {
        url: TelephoneApi.服务账单,
        data: params
    };
    return Fetch.post(data);
}
/**
 * 通话记录统计
 * @param params
 * @returns {Promise<any>}
 */
export const getCallStatisitcs = (params):Promise<any> => {
    const data = {
        url: TelephoneApi.通话记录统计,
        data: params
    };
    return Fetch.post(data);
}

/**
 * 获取坐席统计
 * @param params
 * @returns {Promise<any>}
 */
export const getEmiCloudRecord = (params):Promise<any> => {
    const data = {
        url: TelephoneApi.坐席统计,
        data: params
    };
    return Fetch.post(data);
}

/**
 * 获取技能组统计
 * @param params
 * @returns {Promise<any>}
 */
export const getEmiGroupsRecord = (params):Promise<any> => {
    const data = {
        url: TelephoneApi.技能组统计,
        data: params
    };
    return Fetch.post(data);
}


/**
 * 获取技能组列表
 * @param params
 * @returns {Promise<any>}
 */
export const getGidList = (params) => {
    return{
        type: ServiceActionEnum.获取技能组列表,
        params: params
    }
}
/**
 * 导出统计报表
 * @param param
 * @returns {Promise<any>}
 */
export const exportReport = (param:any) => {
    const params = {
        url: TelephoneApi.导出统计,
        data: param
    }
    Fetch.postBinary(params);
}
