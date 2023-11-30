/**
*Desc: 客户成长异步请求数据
*User: Debby.Deng
*Date: 2018/11/22,
*Time: 下午7:59
*/



import {CustomerApi} from "../../api/customerApi";
import {Fetch} from "../../service/fetch";
import {Message} from "../../ui/component/message/message";

/**
 * 客户360 客户成长 交接记录
 * @param {any} params
 * @returns {any}
 */
export const transferRecord=(params) => {
    const data={
        url: CustomerApi.交接记录列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 客户成长 课程包结束
 * @param {any} params
 * @returns {any}
 */
export const courseClose=(params) => {
    const data={
        url: CustomerApi.客户成长课程包结束,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 客户360 客户成长 关键事件列表
 * @param {any} params
 * @returns {any}
 */
export const keyEventList=(params) => {
    const data={
        url: CustomerApi.关键事件列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 客户成长 创建关键事件
 * @param {any} params
 * @returns {any}
 */
export const createKeyEvent=(params) => {
    const data={
        url: CustomerApi.创建关键事件,
        data: params
    };
    return Fetch.post(data).then(()=>{
        Message.success('保存成功');
    });
};

/**
 * 客户360 客户成长 续约跟进列表
 * @param {any} params
 * @returns {any}
 */
export const reNewFollow=(params) => {
    const data={
        url: CustomerApi.续约跟进列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户360 客户成长 创建续约跟进
 * @param {any} params
 * @returns {any}
 */
export const createRenew=(params) => {
    const data={
        url: CustomerApi.创建续约跟进,
        data: params
    };
    return Fetch.post(data).then(()=>{
        Message.success('保存成功');
    });
};


/**
 * 客户360 客户成长 续约意向列表
 * @param {any} params
 * @returns {any}
 */
export const intensionList=(params) => {
    const data={
        url: CustomerApi.续约意向列表,
        data: params
    };
    return Fetch.post(data);
};


/**
 * 客户360 客户成长 热心推荐列表
 * @param {any} params
 * @returns {any}
 */
export const hotRecommend=(params) => {
    const data={
        url: CustomerApi.热心推荐列表,
        data: params
    };
    return Fetch.post(data);
};
