/**
 * desc: 中心费率
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/9/1
 * Time: 下午3:44
 */

import {Fetch} from "@/service/fetch";
import {ContractApi} from "@/api/contractApi";
import {downloadExcel} from "@redux-actions/report/downloadExcel";

/**
 * 中心费率查询
 * @param params
 * @returns {Promise<any>}
 */
export const queryCenterCostRate = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.中心费率查询,
        data: params
    };
    return Fetch.post(param);
};

/**
 * 修改中心费率
 * @param params
 * @returns {Promise<any>}
 */
export const updateCenterCostRate = (params: any): Promise<any> => {
    const param = {
        url: ContractApi.中心费率编辑,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 中心费率导出
 * @param params
 */
export const exportCenterCostRate = (params: any) => {
    downloadExcel(params, ContractApi.中心费率导出, '中心费率.xlsx');

};

