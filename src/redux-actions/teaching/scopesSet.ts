/**
 * desc: 八大领域设置
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/9/5
 * Time: 下午2:12
 */
import { Fetch } from "../../service/fetch";
import { TeachingApi } from '../../api/teachingApi';

/**
 *
 * @param params
 * @returns {Promise<any>}
 */
export const getScopesList = (params) => {
    const data = {
        url: TeachingApi.八大领域管理列表,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 修改
 * @param params
 * @returns {Promise<any>}
 */
export const updateScope = (params) => {
    const data = {
        url: TeachingApi.八大领域管理编辑,
        data: params
    };
    return Fetch.post(data);
};
