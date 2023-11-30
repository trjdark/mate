/**
 * desc: 随堂反馈
 * User: Vicky.Yu
 * Date: 2020/10/12
 * Time: 15:30
 */
import { Fetch } from "../../service/fetch";
import { TeachingApi } from '../../api/teachingApi';
import { downloadExcel } from "@redux-actions/report/downloadExcel";

/**
 * Desc 随堂反馈点评初始数据列表
 * @returns {any}
 */
export const getInitData = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评宝宝维度详情,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 查询随堂反馈课程表
 * @param {any} params
 * @returns {any}
 */
export const getFeedCourseList = (params) => {
    const data = {
        url: TeachingApi.随堂反馈课程表,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 随堂反馈点评列表随堂表现
 * @param {any} params
 * @returns {any}
 */
export const getPerformanceList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评随堂表现,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈点评列表能力发展
 * @param {any} params
 * @returns {any}
 */
export const getAbilityList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评能力发展,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈点评编辑获取photo
 * @param {any} params
 * @returns {any}
 */
export const getPhotoByCommentsId = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈编辑获取图片,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈点评随堂表现教具
 */
export const getPerformancePiece = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评随堂表现教具,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
    });
};
/**
 * 随堂反馈点评随堂表现教具
 */
export const addComments = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.添加随堂反馈点评,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈数据统计列表
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈数据统计列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈数据统计列表detail
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsDetail = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈数据统计列表详情,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈数据统计能力发展
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsAbility = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.数据统计获取能力发展,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 数据统计获取随堂表现
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsPerformance = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.数据统计获取随堂表现,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 数据统计获取随堂表现教具
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsPieceContent = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.数据统计教具,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈管理列表
 * @param {any} params
 * @returns {any}
 */
export const getFeedBackManageList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈管理列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈管理列表详情
 * @param {any} params
 * @returns {any}
 */
export const getManageListDetail = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈管理列表详情,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈管理教具
 * @param {any} params
 * @returns {any}
 */
export const getManagePieceContent = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈管理教具,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
export const exportFeedManage = data => {
    downloadExcel(data, TeachingApi.导出随堂反馈管理数据, '随堂反馈管理.xlsx');
};
export const exportFeedManageNew = data => {
    downloadExcel(data, TeachingApi.导出随堂反馈管理数据新, '随堂反馈管理2.0.xlsx');
};
/**
 * 客户360随堂反馈
 * @param {any} params
 * @returns {any}
 */
export const getClientFeedBackList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户360随堂反馈列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 客户360随堂反馈报告
 * @param {any} params
 * @returns {any}
 */
export const getClientFeedBackReport = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户360随堂反馈报告,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 客户360随堂反馈报告2.0新
 * @param {any} params
 * @returns {any}
 */
export const getClientFeedBackReportNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户360随堂反馈报告新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈获取完整手机号
 * @param {any} params
 * @returns {any}
 */
export const getFeedBackFullphone = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.反馈数据统计获取完整手机号,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 教室类型是否匹配
 * @param {any} params
 * @returns {any}
 */
export const getIsComment = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.校验教室类型是否匹配,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 获取所有hi Ins离职在职岗位
 * @param {any} params
 * @returns {any}
 */
export const getInsHiList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.离职在职Hi和Ins,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈2.0
 * @param {any} params
 * @returns {any}
 */
export const getIsCommentNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.校验是否可以进行随堂反馈,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * Desc 随堂反馈点评初始数据列表2.0
 * @returns {any}
 */
export const getInitDataNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评宝宝维度详情新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈点评随堂表现教具新
 */
export const getPerformancePieceNew  = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评随堂表现教具新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈点评列表随堂表现新
 * @param {any} params
 * @returns {any}
 */
export const getPerformanceListNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈点评随堂表现新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈管理列表新
 * @param {any} params
 * @returns {any}
 */
export const getFeedBackManageListNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈管理列表新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈管理列表详情新
 * @param {any} params
 * @returns {any}
 */
export const getManageListDetailNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈管理列表详情新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 随堂反馈数据统计列表新
 * @param {any} params
 * @returns {any}
 */
export const getStatisticsListNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.随堂反馈数据统计列表新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 随堂反馈点评随堂表现教具新
 */
export const addCommentsNew = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.添加随堂反馈点评新,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 客户中心徽章记录
 * @param {any} params
 * @returns {any}
 */
export const getCustomerBadgeList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.客户中心徽章记录,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 客户中心月度回顾列表
 * @param {any} params
 * @returns {any}
 */
export const getMonthlyList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.月度回顾列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 月度回顾管理列表
 * @param {any} params
 * @returns {any}
 */
export const getManageList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.月度回顾管理列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 月度回顾管理列表详情
 * @param {any} params
 * @returns {any}
 */
export const getManageDetail = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.月度回顾管理列表详情,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
/**
 * 升班报告管理列表
 * @param {any} params
 * @returns {any}
 */
export const getPromotionList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.升班报告管理列表,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};

/**
 * 升班报告课程选课
 * @param {any} params
 * @returns {any}
 */
export const getUpCourseList = (params: any): Promise<any> => {
    const param = {
        url: TeachingApi.升班报告课程选课,
        data: params
    };
    return Fetch.post(param)
        .then((res: any) => {
            return Promise.resolve(res)
        });
};
