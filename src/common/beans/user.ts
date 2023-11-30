/**
 * desc: 用户类
 * Date: 2018/8/6
 * Time: 下午1:52
 */
import {Storage} from "../utils/storage";

declare interface UserModal {
    userName?:string,
    userId:string,
    englishName? :string,
    chineseName?: string,
    currentCenterId?:any,
    isHQ?: boolean,
    currentCenterName?: string,
    role?:Array<string>,
    roleName?:Array<string>,
    permissionList?:Array<string>,
    centerCode?:string,
    isAdmin?:boolean,
    firstDayOfMonth:boolean,
    staffCenterList?:Array<string>,
    tmkStatus?:any,
    hasPayment?:any,
    // Todo是否为Sigma中心，之后会废弃
    isSigmaCenter?:any,
    loginTime?:number,
    businessSource?:Array<any>
}

class User {
    static _key = "_user";
    static _user:UserModal = null;

    /**
     * 获取当前员工ID
     * @returns {string}
     */
    static get userId (){
        return this.user.userId
    }

    /**
     * 获取当前登录中心ID
     * @returns {string}
     */
    static get currentCenterId (){
        return this.user.currentCenterId
    }

    /**
     * 获取用户信息
     * @returns {UserModal}
     */
    static get user():UserModal {
        if(!this._user){
            this._user=Storage.get(this._key);
        }
        return this._user;
    }

    /**
     * 设置用户信息
     * @param {UserModal} user
     */
    static set user(user:UserModal){
        this._user = user;
        Storage.set(this._key, user);
    }

    /**
     * 获取用户名
     * @returns {string}
     */
    static get userName(){
        return this.user.userName
    }
    /**
     * 获取用户中文名
     * @returns {string}
     */
    static get chineseName(){
        return this.user.chineseName
    }

    /**
     * 获取用户英文名
     * @returns {string}
     */
    static get englishName(){
        return this.user.englishName
    }

    /**
     * 获取用户当前中心
     * @returns {any}
     */
    static get currentCenterName(){
        return this.user.currentCenterName
    }

    /**
     * 是否为总部
     * @returns {any}
     */
    static get isHQ(){
        return this.user.isHQ
    }
    /**
     * 默认角色信息
     * @returns {any}
     */
    static get role(){
        return this.user.role
    }
    /**
     * 角色名字
     * @returns {any}
     */
    static get roleName(){
        return this.user.roleName
    }
    /**
     * 用户权限
     * @returns {any}
     */
    static get permissionList(){
        if((this.user.permissionList) instanceof Array){
            return this.user.permissionList
        }else{
            return [];
        }
    }

    /**
     * 获取中心编号
     * @returns {string | undefined}
     */
    static get centerCode(){
        return this.user.centerCode
    }

    /**
     * 获取员工中心列表
     * @returns {any}
     */
    static get staffCenterList(){
        return this.user.staffCenterList || []
    }
    /**
     * 获取本中心tmk,员工状态（是否含有锁定）配置信息
     * @returns {any}
     */
    static get tmkStatus(){
        return this.user.tmkStatus || {}
    }
    /**
     * 获取本中心是否含有支付中
     * @returns {any}
     */
    static get hasPayment(){
        return this.user.hasPayment || []
    }
    /**
     * 获取本中心是否含有sigma
     * @returns {any}
     */
    static get isSigmaCenter(){
        return this.user.isSigmaCenter || {}
    }
    /**
     * 获取登陆者的token
     * @returns {string | undefined}
     */
    static get getToken(){
        const _key = '_token';
        return Storage.exist(_key) ? Storage.get(_key) : null;
    }

    /**
     * 获取是否本月第一次登陆
     * @returns {string | undefined}
     */
    static get getIsFirstLogin(){
        return this.user.firstDayOfMonth
    }
    /**
     * 获取本中心是否含有sigma
     * @returns {any}
     */
    static get businessSource() {
        return this.user.businessSource || []
    }
    /**
     * 清空
     */
    static empty(){
        this.user = {
            userName:"",
            userId:"",
            englishName:"",
            chineseName: "",
            currentCenterId:"",
            isHQ: null,
            currentCenterName: "",
            role:null,
            permissionList:null,
            centerCode:"",
            isAdmin:null,
            firstDayOfMonth:null,
            staffCenterList:null,
            tmkStatus: null,
            hasPayment:null,
            isSigmaCenter:null,
            loginTime:null,
            businessSource: []
        };
        Storage.clear();
    }
}

export {User}
