import {Fetch} from "../../service/fetch";
import {CustomerApi} from "../../api/customerApi";

/**
*Desc: 跨中心查询
*User: Debby.Deng
*Date: 2019/1/19,
*Time: 2:06 PM
*/

export const crossCenterQuery=(params:any):Promise<any> => {
    const param = {
        url: CustomerApi.跨中心查询,
        data: params
    };
    return Fetch.post(param);
};
