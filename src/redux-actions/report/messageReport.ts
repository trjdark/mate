/*
* desc:服务类报表.0
* User: Dean
* Date: 2019/9/11
* Time: 17:27
*/
import {reportApi} from "@/api/reportApi";
import {Fetch} from "@/service/fetch";
import {downloadExcel} from "@redux-actions/report/downloadExcel";

//活动汇总报表
export const getActiveCourse = (data) => {
  const params = {
      url: reportApi.活动汇总列表,
      data
  };
  return Fetch.post(params);
}
//活动汇总报表导出
export const getActiveCourseExports = (data) => {
  downloadExcel(data, reportApi.活动汇总列表导出, '活动耗课汇总列表导出.xlsx');
}

//活动耗课明细报表
export const getActiveDetail = (data) => {
  const params = {
      url: reportApi.活动耗课明细,
      data
  };
  return Fetch.post(params);
}
//活动耗课明细报表导出
export const getActiveDetailExports = (data) => {
  downloadExcel(data, reportApi.活动耗课明细导出, '活动耗课明细导出.xlsx');
}
/**
 * 排课耗课列表
 */
export const getArrangeClassVitalList = (params: any) => {
  const param = {
    url: reportApi.排课耗课列表,
    data: params
  };
  return Fetch.post(param, 30000);
};
/**
 * 待跟进会员报表
 */
export const getWaitFollowlist = (params: any) => {
  const param = {
    url: reportApi.待跟进会员报表,
    data: params
  };
  return Fetch.post(param);
};
/**
 * 待跟进会员报表导出
 */
export const exportsWaitFollowlist = (data) => {
  downloadExcel(data, reportApi.待跟进会员报表导出, '待跟进会员报表.xlsx');
}
/**
 * 获取所有课程
 */
export const getAllCourse = (params: any) => {
  const param = {
    url: reportApi.获取所有课程,
    data: params
  };
  return Fetch.post(param);
};


/**
 * 请假会员名单列表
 */
export const getLeaveClassList = (params: any) => {
  const param = {
    url: reportApi.请假会员名单列表,
    data: params
  };
  return Fetch.post(param);
};
/**
 * 排课耗课列表导出
 */
export const exportClassVital = (data) => {
    downloadExcel(data, reportApi.排课耗课列表导出, '排课耗课列表导出.xlsx');
}
/**
 * 请假会员名单列表
 */
export const exportLeaveList = (data) => {
    downloadExcel(data, reportApi.请假会员列表导出, '请假会员列表导出.csv');
}
/**
 * 出席会员上课明细
 */
export const attendClassList = (params: any) => {
    const param = {
      url: reportApi.出席会员上课明细,
      data: params
    };
    return Fetch.post(param);
};
/**
 * 导出出席会员上课明细
 */
export const exportAttendClassList = (params: any) => {
    downloadExcel(params, reportApi.导出出席会员上课明细, '出席会员上课明细.xlsx');
};
/**
 * 换课删课明细
 */
export const changeDeleteClassList = (params: any) => {
  const param = {
    url: reportApi.换课删课明细,
    data: params
  };
  return Fetch.post(param);
};
/**
 * 换课删课明细导出
 */
export const exportchangeDeleteClassList = (data) => {
  downloadExcel(data, reportApi.换课删课明细导出, '换课删课明细记录报表.xlsx');
}
/**
 * 到访表查询
 */
export const visitQueryReportList = (params: any) => {
    const param = {
        url: reportApi.到访表查询,
        data: params
    };
    return Fetch.post(param);
};
/**
 * 导出到访表
 */
export const exportVisitQueryReportList = (data) => {
    downloadExcel(data, reportApi.导出到访表, '到访记录报表.xlsx');
}
/**
 * 特殊操作日志记录查询
 */
  export const getOperateLogRecord = (params: any) => {
  const param = {
    url: reportApi.特殊操作日志记录查询,
    data: params
  };
  return Fetch.post(param);
};
/**
 * 特殊操作日志记录导出
 */
  export const exportOperateLogRecord = (params: any) => {
  downloadExcel(params,reportApi.特殊操作日志记录导出,"特殊操作日志记录.xlsx");
};
