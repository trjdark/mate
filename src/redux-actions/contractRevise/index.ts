/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/6/3
 * Time: 上午11:26
 */
import {Fetch} from "../../service/fetch";
import {ContractApi} from "@/api/contractApi";
import {downloadExcel} from "@redux-actions/report/downloadExcel";

/**
 * 总部获取合同特殊调整列表
 * @param {any} params
 * @returns {{type: ServiceActionEnum}}
 */
export const getContractReviseListFromHQ001 = (params) => {
    const data = {
        url: ContractApi.总部获取合同特殊调整列表,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 导出
 * @param data
 */
export const exportListForCenter = (data, name:string) => {
    downloadExcel(data, ContractApi.合同调整导出, `${name}.xlsx`);
};
/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getPartRefundListFromHQ = (params) => {
    const data = {
        url: ContractApi.总部获取部分退费列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 导出
 * @param data
 */
export const exportPartRefundListForCenter = (data, name:string) => {
    downloadExcel(data, ContractApi.部分退费列表导出, `${name}.xlsx`);
};
