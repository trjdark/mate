/**
 * desc: dashboard公用变量及方法
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/2/28
 * Time: 下午1:38
 */
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {commonQlist, navConfig} from "@/ui/pages/customer/enum/assign";
import { TaskCenterRoutes } from "@/router/enum/taskCenterRouter";
import { convenientSearchTag } from "../../taskCenter/enum";


export const pattern = /\B(?=(\d{3})+(?!\d))/g;   // 千分位

/*把数字转换为千分位展示*/
export const thousandNum = function (str: number | string) {
    return String(str).replace(pattern, ',');
};

/*跳转至客户中心*/
export const toCustomerCenter = function (obj) {
    const params = CommonUtils.stringify(obj);
    this.props.history.push(`${CustomerRoutes.分配客户.link}/${params}`);
};

/*根据commonQueryList和navConfig得到客户中心常用查询和leads阶段的枚举值*/
let queryEnum: any = {}, navConfigEnum: any = {};

for (const val of navConfig) {
    const {title, phaseId} = val;
    navConfigEnum[title] = phaseId;
}

for (const {data} of commonQlist) {
    for(const val of data){
        const {name, queryId} = val;
        queryEnum[name] = queryId;
    }
}
export {queryEnum, navConfigEnum}


/*跳转至任务中心*/
export const toTaskCenter = function (obj) {
    const params = CommonUtils.stringify(obj);
    this.props.history.push(`${TaskCenterRoutes.任务中心.link}/${params}`);
};

let searchTagEnum:any = {};

for (const val of convenientSearchTag) {
    const {type, name} = val;
    searchTagEnum[name] = type;
}
export {searchTagEnum}
