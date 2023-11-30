/*
* desc:报表模块市场相关
* User: lyon.li@gymboglobal.com
* Date: 2019/2/25
* Time: 上午10:10
* */

import {Fetch} from "@/service/fetch";
import {reportApi} from "@/api/reportApi";
import {SetApi} from "@/api/settingApi";
import {CustomerApi} from "@/api/customerApi";
import {downloadExcel} from "./downloadExcel";
import {User} from "@/common/beans/user";

// 获取会员连续未到提醒
export const getMemberAbsentData = data => {
    const params = {
        url: reportApi.会员连续未到提醒,
        data,
    };

    return Fetch.post(params);
};

// 下载会员连续未到报表
export const downloadMemberAbsent = data => {
    downloadExcel(data, reportApi.会员连续未到导出, '会员连续未到提醒.xlsx');
};

// 查询排课耗课统计
export const getConsumeCourseList = data => {
    const params = {
        url: reportApi.会员排课耗课统计报表查询,
        data,
    };
    return Fetch.post(params);
};

// 下载排课耗课统计报表
export const downloadConsumeCourse = data => {
    downloadExcel(data, reportApi.会员排课耗课统计报表导出, '会员排课耗课统计.xlsx');
};

// 获取在职和离职半年的GB HGB数据
export const getGbInAndOutJobSList = (data) => {
    const params = {
        url: CustomerApi.查询GBHGB在职和所有离职,
        data,
    };
    return Fetch.post(params).then(res => {
        // 转换成所需的数据
        return res.map(item => {
            const {staffId, userName} = item;
            return {
                postCode: staffId,
                postName: userName,
            }
        });

    });
};

// 获取在职和离职半年的GA HGA数据
export const getGaInAndOutJobSList = (data) => {
    const params = {
        url: CustomerApi.查询GAHGA在职和所有离职,
        data,
    };
    return Fetch.post(params).then(res => {
        // 转换成所需的数据
        return res.map(item => {
            const {staffId, userName} = item;
            return {
                postCode: staffId,
                postName: userName,
            }
        });

    });
};

// 获取中心所有员工信息
export const getExecutorInAndOutJobSList = (data) => {
    const params = {
        url: SetApi.查询中心所有员工信息,
        data,
    };
    return Fetch.post(params).then(res => {
        // 转换成所需的数据
        return res.map(item => {
            const {staffId, userName} = item;
            return {
                postCode: staffId,
                postName: userName,
            }
        });
    });
};

// 获取任务跟进记录列表
export const getTaskFollowList = data => {
    const params = {
        url: reportApi.任务跟进记录查询,
        data
    };
    return Fetch.post(params);
};

// 下载排课耗课统计报表
export const downloadTaskFollow = data => {
    downloadExcel(data, reportApi.任务跟进记录导出, '任务跟进记录.xlsx');
};

// 查询出席报告总计
export const getAttendTotalList = data => {
    const params = {
        url: reportApi.查询出席报告总计,
        data
    };
    return Fetch.post(params);
};

// 下载出席报告总计
export const downloadAttendTotal = data => {
    downloadExcel(data, reportApi.导出出席报告总计, '出席报告.xlsx');
};

// 查询出席报告详情
export const getAttendDetailList = data => {
    const params = {
        url: reportApi.查询出席报告明细,
        data
    };
    return Fetch.post(params);
};

// 下载出席报告详情
export const downloadDetailTotal = data => {
    downloadExcel(data, reportApi.导出出席报告明细, '出席报告明细.xlsx');
};

// 获取GA耗课统计
export const getGaConsumeCourse = data => {
    const params = {
        url: reportApi.耗课统计GA查询,
        data
    };
    return Fetch.post(params);
};

// 下载GA耗课统计
export const downloadGAConsumeCourse = data => {
    downloadExcel(data, reportApi.耗课统计GA导出, '耗课统计_GA.xlsx');
};

// 获取GB耗课统计
export const getGbConsumeCourse = data => {
    const params = {
        url: reportApi.耗课统计GB查询,
        data
    };
    return Fetch.post(params);
};

// 下载GB耗课统计
export const downloadGBConsumeCourse = data => {
    downloadExcel(data, reportApi.耗课统计GB导出, '耗课统计_GB.xlsx');
};

// 获取INS耗课统计
export const getINSConsumeCourse = data => {
    const params = {
        url: reportApi.耗课统计指导师查询,
        data
    };
    return Fetch.post(params);
};

// 下载INS耗课统计
export const downloadINSConsumeCourse = data => {
    downloadExcel(data, reportApi.耗课统计指导师导出, '耗课统计_指导师.xlsx');
};

// 获取会员升班提醒数据
export const getMemberUpdateData = data => {
    const params = {
        url: reportApi.会员升班提醒查询,
        data
    };
    return Fetch.post(params);
};

// 下载会员升班提醒
export const downloadMemberUpdate = data => {
    downloadExcel(data, reportApi.会员升班提醒导出, '会员升班提醒.xlsx');
};

// 获取日常业绩报表数据
export const getAchievementDataList = data => {
    const params = {
        url: reportApi.日常业绩报表查询,
        data
    };
    return Fetch.post(params);
};

// 下载日常业绩报表
export const downloadAchievementData = data => {
    downloadExcel(data, reportApi.日常业绩报表导出, '日常业绩报表.xlsx');
};
