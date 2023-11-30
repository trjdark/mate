/**
 * desc: 任务类报表
 * User: Vicky.Yu
 * Date: 2020/9/4
 * Time: 10:30
 */
import {Fetch} from "../../service/fetch";
import {CustomerApi} from "@/api/customerApi";
import { downloadExcel } from "@redux-actions/report/downloadExcel";

/**
 * tmk转中心leads
 * @param params
 * @returns {Promise<any>}
 */
export const getTaskList = (params):Promise<any> => {
    const data = {
        url: CustomerApi.云语音任务跟进记录,
        data: params
    };
    return Fetch.post(data);
}

export const exportTaskList = data => {
    downloadExcel(data, CustomerApi.云语音任务跟进记录导出, '任务跟进记录报表.xlsx');
};
