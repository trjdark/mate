/**
 * desc: 客户回拨记录（事件）
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/25
 * Time: 下午4:30
 */
import {Fetch} from "../../service/fetch";
import {TelephoneApi} from "@/api/telephoneApi";

/**
 * 获取获取三天未接已接记录
 * @param params
 * @returns {Promise<any>}
 */
export const queryCallInContactList = (params:any):Promise<any> => {
    const param = {
        url: TelephoneApi.获取三天未接已接记录,
        data: params
    };
    return Fetch.post(param)
};
