/**
 * desc: 首页事件
 * Date: 2018/8/22
 * Time: 上午9:35
 */
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {SetApi} from "@/api/settingApi";
import {Fetch} from "@/service/fetch";
import {Cookie} from "@/service/cookie";
import {User} from "@/common/beans/user";
import {ContractApi} from "@/api/contractApi";
import {LogApi} from "@/api/logApi";

 /**
  * 获取PPS链接
  * @param params
  * @returns {any}
  */

 export const ppsUrl= (params)=>{
     const param = {
         url: SetApi.ppsUrl,
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
 * 获取西格玛PPS链接
 * @returns {{type: ServiceActionEnum}}
 */
export const segmaPpsUrl = (params:any) => {
    const param = {
        url: SetApi.西格玛商城,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 通用模块初始化
 */
export const commonInit = (userId: any) => {
    return {
        type: ServiceActionEnum.通用模块初始化,
        params: userId
    }
};

export const clearEarlyWarning = (staffId) => {
    return {
        type: ServiceActionEnum.清空预警信息,
        params: staffId
    }
};

/**
 * 获取所有权限列表 {staffId}
 * @returns {{type: ServiceActionEnum}}
 */
export const getLinkCode = (params:any, callback) => {
    const param = {
        url: SetApi.获取code,
        data: params
    };
    Fetch.syncPost(param, callback);
};

/**
 * 获取基本配置
 * @param userId
 */
export const getBasicOption = async (param: any, header:any = {}) => {
    setCookie();
    let arr = [
        getUserPostPermission(param, header),
        getStaffCenterList(param, header),
        isIncludeTmkCenter(param, header)
    ];
    if(!User.isHQ){
        arr = [
            ...arr,
            hasPaymentCenter(param, header),
            hasSigmaCenter(param, header),
            getBusinessSourceList(param, header)
        ];
    }
    try {
        const resultArr = await Promise.all(arr);
        const [permissionOption, staffCenterList, tmkOption, paymentOption, sigmaOption, businessSourse] = resultArr;
        const permissionList = (permissionOption.functions || []).map((item:any) => item.id);
        const staffRole = (permissionOption.staffRole||[]).map((item:any) => {
            if(item.roleId === 'R_HQ001_BMS'){//总部的BMS才有BMS权限
                return  item.centerId ==='C_HQ001'? 'BMS' : '';
            }else if(item.roleId === 'R_HQ001'){
                return item.centerId === 'C_HQ001'? 'ADMIN' : '';
            } else{
                return item.defaultRoleName;
            }
        });
        const roleNameList = (permissionOption.staffRole||[]).map((item:any) => {
            return item.centerId ==='C_HQ001' ? '' : item.roleName;
        });
        User.user = Object.assign({}, User.user, {
            role:staffRole.filter((role)=>(!!role && role)),
            roleName: roleNameList.filter((role)=>(!!role && role)),
            permissionList:permissionList,
            staffCenterList: staffCenterList,
            tmkStatus: tmkOption,
            hasPayment: paymentOption,
            isSigmaCenter: sigmaOption,
            businessSource: businessSourse
        });
        return Promise.resolve();

    }catch (e) {
        return Promise.reject(e)
    }


};

/**
 * 设置用户cookie,做灰度发布
 */
function setCookie() {
    Cookie.setCookie('centerCode', User.centerCode, 2*60*60*24);
    Cookie.setCookie('userName', User.userName, 2*60*60*24)
}


/**
 * 获取员工各个中心的岗位，角色信息
 * @returns {IterableIterator<any>}
 */
function getUserPostPermission(arg:any, header:any) {
    const params = {
        url:SetApi.获取用户各个中心岗位角色信息,
        data: arg,
        header:header
    };
    return Fetch.post(params);
}
/**
 * 1.获取当前员工中心列表
 * @returns {IterableIterator<CallEffect>}
 */
function getStaffCenterList (arg:any, header:any) {
    const params = {
        url:SetApi.获取员工中心列表,
        data: arg,
        header:header
    };
    return Fetch.post(params);
}
/**
 * 是否还有tmk中心
 * @param action
 * @returns {IterableIterator<any>}
 */
function isIncludeTmkCenter(arg:any, header:any){
    const params = {
        url:SetApi.是否包含TMK中心,
        data: {
            id: arg.currentCenterId,
            currentCenterId: arg.currentCenterId
        },
        header:header
    };
    return Fetch.post(params);
}
/**
 * 是否开通中心移动支付
 * @param action
 * @returns {IterableIterator<any>}
 */
function hasPaymentCenter(arg:any, header:any){
    const params = {
        url:ContractApi.中心是否开通移动支付,
        data: arg,
        header:header
    };
    return Fetch.post(params);
}
/**
 * 中心是否有西格玛权限
 * @param action
 * @returns {IterableIterator<any>}
 */
function hasSigmaCenter(arg:any, header:any){
    const params = {
        url:ContractApi.中心是否有西格玛权限,
        data: arg,
        header:header
    };
    return Fetch.post(params);
}
/**
 * 中心业务来源列表
 * @param action
 * @returns {IterableIterator<any>}
 */
function getBusinessSourceList(arg:any, header:any){
    const params = {
        url:SetApi.中心业务来源,
        data: arg,
        header:header
    };
    return Fetch.post(params);
}

/**
 * 错误记录
 * @param arg
 */
export const logError = (arg:any) => {
    const param = {
        url: LogApi.日志记录,
        data: arg,
        slience: true
    }
    return Fetch.post(param);
};
