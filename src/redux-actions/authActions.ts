/**
 * desc: viewlogin logout(action)
 * User: colin.lu
 * Date: 2018/8/15
 * Time: 下午20:10
 */
/// <reference path="../.h/user.d.ts" />
import {ServiceActionEnum} from "./serviceActionsEnum";
import {SetApi} from "@/api/settingApi";
import {User} from "@/common/beans/user";
import {Fetch} from "@/service/fetch";
import {Storage} from "@/common/utils/storage";
import {CommonUtils} from "@/common/utils/commonUtils";

/**
 * 用户登录
 * @param {User} params
 * @returns {{type: ServiceActionEnum; params: User}}
 */
export const login = (params: User) => {
    return {
        type: ServiceActionEnum.登录,
        params: params
    }
};

/**
 * Desc
 * @param {any}
 * @returns {any}
 */
export const loginRequest = (params)=>{
  const data={
    url: SetApi.登录,
    data: params
  }
  return Fetch.post(data);
}
/**
 * Desc
 * @param {any}
 * @returns {any}
 */
export const homeMateLoginRequest = (params)=>{
    const data={
        url: SetApi.home登录mate,
        data: params,
        responseType: 'homeMateLogin'
    }
    return Fetch.post(data);
}
/**
 * 重置密码
 * @param params
 * @returns {Promise<any>}
 */
export const resetPassword = (params)=>{
    const data={
        url: SetApi.重置密码,
        data: params
    }
    return Fetch.post(data);
}

/**
 * 用户注销
 * @param  null
 * @returns {{type: ServiceActionEnum; params: {}}}
 */
export const logout = () => {
    const data={
        url:`${SetApi.注销}`,
        data:{
            currentCenterId:User.currentCenterId,
        }
    };
    Fetch.post(data).then((res) => {
        if(res){
            CommonUtils.newWinSelf(process.env.home_Url, 'home_Url')
            Storage.clear();
            User.empty();
        }
    })
};
/**
 * 获取中心角色信息
 * @param params
 */
export const getCenterRoleList =(params:any) => {
    return {
        type: ServiceActionEnum.获取中心员工角色列表,
        params: params
    }
};
/**
 * 记录用户名
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const reportUserName = (params:any) => {
    return {
        type: ServiceActionEnum.记录用户名,
        params: params
    }
};
/**
 * 发送验证码
 * @param params
 * @returns {Promise<any>}
 */
export const sendVerifyCode = (params:any) => {
    const data = {
        url: SetApi.发送验证码,
        data: params
    }
    return Fetch.post(data);
};
/**
 * 发送更新密码验证码
 * @param params
 * @returns {Promise<any>}
 */
export const sendResetPasswordVerifyCode = (params:any) => {
    const data = {
        url: SetApi.更新密码发送验证码,
        data: params
    }
    return Fetch.post(data);
};
