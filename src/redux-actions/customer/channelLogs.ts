/**
 * desc: 渠道日志
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/5/22
 * Time: 上午10:52
 */
import {Fetch} from '@/service/fetch'
import {CustomerApi} from "../../api/customerApi";
import {getChannelType, getAppearanceType} from "@redux-actions/report/marketReport";

export const getInfo = async (params):Promise<any> => {
    try{
        return await Promise.all([
            getChannelLogs(params),
            getChannelType(),
            getAppearanceType()
        ]).then((res:any) => {
            return Promise.resolve({
                logs: res[0],
                channelTypes: res[1],
                appearanceTypes: res[2],
            })
        })
    }catch (e) {

    }
}

const getChannelLogs = (params):Promise<any> => {
    const data={
        url: CustomerApi.获取渠道日志,
        data: params
    }
    return Fetch.post(data);
};


