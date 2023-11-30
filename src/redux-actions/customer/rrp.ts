/**
 *Desc: RRP绑定查询
 *User: Debby.Deng
 *Date: 2019/8/28,
 *Time: 9:48 AM
 */

import {CustomerApi} from "@/api/customerApi";
import {Fetch} from "@/service/fetch";


export const rrpQuery=(params:any):Promise<any> => {
    const param = {
        url: CustomerApi.rrp绑定查询,
        data: params
    };
    return Fetch.post(param);
};
