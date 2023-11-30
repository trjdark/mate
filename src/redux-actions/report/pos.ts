/*
* desc:pos报表
* User: lyon.li@gymboglobal.com
* Date: 2019/7/31
* Time: 09:27
*/

import {reportApi} from "@/api/reportApi";
import {Fetch} from "@/service/fetch";
import {downloadExcel} from "@redux-actions/report/downloadExcel";
import moment from "moment";

// 获取订货额度数据
export const getOrderGoodsLimit = (data) => {
    const params = {
        url: reportApi.查询订货额度,
        data,
    };
    return Fetch.post(params);
};

// 获取对账单明细
export const getAccountStatement = (data) => {
    const params = {
        url: reportApi.对账单,
        data,
    };
    return Fetch.post(params);
};

// 下载对账单报表
export const downloadAccountStatement = data => {
    downloadExcel(data, reportApi.下载对账单, '对账单明细.xls');
};

// 获取预付款余额
export const getAdvancePayment = () => {
    const params = {
        url: reportApi.预付款余额明细
    };
    return Fetch.post(params);
};
// 下载预付款余额报表
export const downloadAdvancePayment = data => {
    downloadExcel(data, reportApi.下载预付款余额明细, '预付款余额明细.xls');
};

// 获取未到期余额明细
export const getUnexpiredPremium = () => {
    const params = {
        url: reportApi.未到期余额明细
    };
    return Fetch.post(params);
};
// 下载未到期余额报表
export const downloadUnexpiredPremium = data => {
    downloadExcel(data, reportApi.下载未到期余额明细, '未到期余额明细.xls');
};

// 获取未发货订单明细
export const getUnShippedOrder = (data) => {
    const params = {
        url: reportApi.未发货订单,
        data,
    };
    return Fetch.post(params);
};
// 下载未发货订单报表
export const downloadUnShippedOrder = data => {
    downloadExcel(data, reportApi.下载未发货订单, '未发货订单.xls');
};

// 获取星级数据
export const getStar = () => {
    const params = {
        url: reportApi.获取中心星级
    };
    return Fetch.post(params).then(res => {
        const {star, stars} = res;
        const starDatas = stars.map(item => {
            const {star, assementDate} = item;
            const year = new Date(assementDate).getFullYear();
            const month = new Date(assementDate).getMonth()+1;
            return {
                value: star,
                year:`${year}.${month}`
            };
        });
        const currDate=stars[stars.length-1]? moment(stars[stars.length-1].assementDate).format('YYYY-MM-DD') : '';
        return {
            star,
            starDatas,
            currDate
        }
    });
};


/**
 * 查询Ar账单
 * @param data
 * @returns {Promise<any>}
 */
export const queryArBill = (data) => {
    const params = {
        url: reportApi.查询Ar账单,
        data,
    };
    return Fetch.post(params);
};

/**
 * 查询Ar账单明细
 * @param data
 * @returns {Promise<any>}
 */
export const queryArBillDetail = (data) => {
    const params = {
        url: reportApi.查询Ar账单明细,
        data,
    };
    return Fetch.post(params);
};
/**
 * 导出AR账单明细
 * @param data
 */
export const exportBillDetail = (data) => {
    downloadExcel(data, reportApi.导出Ar账单明细, 'AR账单明细.xls');

};
/**
 * 获取政策列表
 * @param data
 * @returns {Promise<any>}
 * @constructor
 */
export const PDFlist = (data) => {
    const params = {
        url: reportApi.获取政策列表,
        data
    };
    return Fetch.post(params);
}
/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export const savePDF = (data) => {
    const params = {
        url: reportApi.pos文件上传,
        data
    };
    return Fetch.post(params);
}
/**
 *
 * @param data
 * @returns {Promise<any>}
 */
export const deletePDF = (data) => {
    const params = {
        url: reportApi.pos文件删除,
        data
    };
    return Fetch.post(params);
};
