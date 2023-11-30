/**
 *Desc: 分配客户view 层事件
 *User: Debby.Deng
 *Date: 2018/9/30,
 *Time: 下午2:37
 */

import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "../../api/customerApi";
import {Storage} from "@/common/utils/storage";
import {Loading} from "@/ui/component/loading";
import axios from "axios";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Message} from "@/ui/component/message/message";
import {User} from "@/common/beans/user";

/**
 * 获取高级查询按钮组
 * @param {any} params
 * @returns {{type: ServiceActionEnum}}
 */
export const getAdanceSearchBtns = (params) => {
    return {
        type: ServiceActionEnum.获取高级查询按钮组,
        params: params
    }
};
/**
 * 删除自定义查询
 * @param {any} params
 * @returns {{type: ServiceActionEnum}}
 */
export const deleteAdvanceBtn = (params) => {
    return {
        type: ServiceActionEnum.删除高级查询按钮,
        params: params
    }
};

/**
 * 保存自定义查询
 * @param {any} params
 * @param {any} callback
 * @returns {{type: ServiceActionEnum}}
 */
export const saveAdvanceBtn = (params, callback?) => {
    return {
        type: ServiceActionEnum.保存高级查询按钮,
        params: params,
        callback: callback
    }
};

/**
 * 获取分配状态栏数量
 * @param {any} params
 * @returns {any}
 */
export const getAssignStatus = (params) => {
    return {
        type: ServiceActionEnum.获取分配状态,
        params: params
    }
};

/**
 * 获取分配情况列表格
 * @param {any} params
 * @returns {any}
 */
export const getAssignList = (params) => {
    return {
        type: ServiceActionEnum.获取分配列表,
        params: params
    }
};

/**
 * 获取高级查询课程包列表
 * @param {any} params
 * @returns {any}
 */
export const getPackageList = (params) => {
    return {
        type: ServiceActionEnum.获取高级查询中心课程包列表,
        params: params
    }
};

/**
 * 获取高级查询ins列表
 * @param {any} params
 * @returns {any}
 */
export const getAdvanceInsList = (params) => {
    return {
        type: ServiceActionEnum.获取高级查询INS列表,
        params: params
    }
};


/**
 * 获取高级查询区域列表
 * @param {any} params
 * @returns {any}
 */
export const getDistrictList = (params) => {
    return {
        type: ServiceActionEnum.获取高级查询区域列表,
        params: params
    }
};

/**
 * 获取分配leads GA列表
 * @param {any} params
 * @returns {any}
 */
export const getAssignGaList = (params) => {
    return {
        type: ServiceActionEnum.获取分配GA角色列表,
        params: params
    }
};

/**
 * 获取分配leads GB列表
 * @param {any} params
 * @returns {any}
 */
export const getAssignGbList = (params) => {
    return {
        type: ServiceActionEnum.获取分配GB角色列表,
        params: params
    }
};
/**
 * 获取 所有中心列表
 * @param {any} params
 * @returns {any}
 */
export const getAssignCenterList = (params) => {
    return {
        type: ServiceActionEnum.获取分配所有中心列表,
        params: params
    }
};

/**
 * 分配LEADS给ga
 * @param {any} params
 * @returns {any}
 */
export const leadsToGa = (params) => {
    const data = {
        url: CustomerApi.分配leads至GA,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 分配会员给ga
 * @param {any} params
 * @returns {any}
 */
export const assignCustomerToGa = (params) => {
    const data = {
        url: CustomerApi.分配会员至GA,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 分配会员给gb
 * @param {any} params
 * @returns {any}
 */
export const assignCustomerToGb = (params) => {
    const data = {
        url: CustomerApi.分配会员至GB,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 历史名单分配会员给gb
 * @param {any} params
 * @returns {any}
 */
export const assignCustomerToGbInHistory = (params) => {
    const data = {
        url: CustomerApi.历史名单分配会员至GB,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 重新分配会员给ga
 * @param {any} params
 * @returns {any}
 */
export const reAssignCustomerToGa = (params) => {
    const data = {
        url: CustomerApi.重新分配会员至GA,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 重新分配会员给gb
 * @param {any} params
 * @returns {any}
 */
export const reAssignCustomerToGb = (params) => {
    const data = {
        url: CustomerApi.重新分配会员至GB,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 分配LEADS给gb
 * @param {any} params
 * @returns {any}
 */
export const leadsToGb = (params) => {
    const data = {
        url: CustomerApi.分配leads至GB,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 重新分配LEADS给ga,gb
 * @param {any} params
 * @returns {any}
 */
export const reLeadsToGaGb = (params) => {
    const data = {
        url: CustomerApi.重新分配leads至GAGB,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 分配LEADS给中心
 * @param {any} params
 * @returns {any}
 */
export const leadsToCenter = (params) => {
    const data = {
        url: CustomerApi.leads转中心,
        data: params
    };
    return Fetch.post(data);

};


/**
 * 领取leads
 * @param {any} params
 * @returns {any}
 */
export const receiveLeads = (params) => {
    const data = {
        url: CustomerApi.领取leads,
        data: params
    };
    return Fetch.post(data);
};


/**
 * 加入回收站
 * @param {any} params
 * @returns {any}
 */
export const recycleLeads = (params) => {
    const data = {
        url: CustomerApi.leads加入回收站,
        data: params
    };
    return Fetch.post(data);
};


/**
 * 交还主管
 * @param {any} params
 * @returns {any}
 */
export const returnLeads = (params) => {
    const data = {
        url: CustomerApi.leads交还主管,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户管理leads导出
 * @param params
 * @returns {any}
 */
export const downloadLeads = (params) => {
    const config = {
        headers: {
            token: Storage.get('_token'),
            userName: User.userName,
            centerCode: User.centerCode,
            userId: User.userId
        },
        responseType: 'blob',
    };
    Loading.add();
    //将null过滤掉
    params = CommonUtils.filterParams(params);
    return axios.post(`/api${CustomerApi.leads导出}`, params, config).then(res => {
        const fr = new FileReader();
        fr.onload = function () {
            try {//导出失败(若成功res.data为string类型，JSON.parse会报错)
                const data = JSON.parse(this.result);
                Message.error(data.msg);
            } catch (err) {//导出成功
                const type = res.headers[`content-type`];
                const filename = res.headers[`content-disposition`].split('=')[1];
                let link = document.createElement('a');
                link.download = filename;
                link.style.display = 'none';
                let blob = typeof File === 'function'
                    ? new File([res.data], filename, {type: type})
                    : new Blob([res.data], {type: type});
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        fr.readAsText(res.data);
        //移除遮罩
        Loading.remove();
    }, err => {
        Loading.remove();
    }).catch((err) => {
        Message.error(err);
        Loading.remove();
    });
};

/**
 * 检测是否有转入leads
 * @param params
 * @returns {any}
 */
export const hasLeadsImport = (params) => {
    const data = {
        url: CustomerApi.是否有leads导入,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 搜索GA，GB(包含leads数量)
 * @param params
 * @returns {any}
 */
export const getGBGAlistHasLeads = (params) => {
    const data = {
        url: CustomerApi.获取GAGB列表含leads数,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 搜索GA，GB角色(包含leads数量)
 * @param params
 * @returns {any}
 */
export const getGBGARolelistHasLeads = (params) => {
    const data = {
        url: CustomerApi.获取GAGB角色列表含leads数,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户中心（新）查询
 * @param params
 * @returns {any}
 */
export const getClientCenterQuery = (params) => {
    const data = {
        url: CustomerApi.查询客户中心leads列表,
        data: params
    };
    return Fetch.post(data, 60000);
};
/**
 * 客户中心（新）快速查询
 * @param params
 * @returns {any}
 */
export const getClientCenterQuickQuery = (params) => {
    const data = {
        url: CustomerApi.快速查询客户中心leads列表,
        data: params
    };
    return Fetch.post(data, 60000);
};

/**
 * 客户中心（新）导出
 * @param params
 * @returns {any}
 */
export const exportClientCenterQuery = (params) => {
    const data = {
        url: CustomerApi.导出客户中心leads列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 客户中心（新）获取当前中心的TMK中心的所有TMK和HTMK名单
 * @param params
 * @returns {any}
 */
export const getCurrentCenterBingTmkAndHtmk = (params) => {
    const data = {
        url: CustomerApi.获取当前中心的TMK中心的所有TMK和HTMK名单,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 客户中心（新）获取任务跟进记录
 * @param params
 * @returns {Promise<any>}
 */
export const getTaskInfo = (params) => {
    const data = {
        url: CustomerApi.获取任务跟进记录,
        data: params,
        slience: true
    };
    return Fetch.post(data);
};
/**
 * 分配leads给GBGA(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newAssignLeadsToGAGB = (params) => {
    const data = {
        url: CustomerApi.分配leads给GBGA_新,
        data: params,
        slience: true
    };
    return Fetch.post(data);
};

/**
 * 领取leads(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newReceiveLeads = (params) => {
    const data = {
        url: CustomerApi.领取leads_新,
        data: params,
    };
    return Fetch.post(data);
};
/**
 * leads返回待分配(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newReturnLeads = (params) => {
    const data = {
        url: CustomerApi.leads返回待分配_新,
        data: params,
    };
    return Fetch.post(data);
};
/**
 * leads转中心(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newTransToCenter = (params) => {
    const data = {
        url: CustomerApi.leads转中心_新,
        data: params,
    };
    return Fetch.post(data);
};
/**
 * leads加入回收站(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newRecycleLeads = (params) => {
    const data = {
        url: CustomerApi.leads加入回收站_新,
        data: params,
    };
    return Fetch.post(data);
};
/**
 * leads转移至tmk(新)
 * @param params
 * @returns {Promise<any>}
 */
export const newTransToTmk = (params) => {
    const data = {
        url: CustomerApi.leads转入TMK_新,
        data: params,
    };
    return Fetch.post(data);
};
