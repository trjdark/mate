/**
 * Desc: 选课 actions
 * User: dave.zhang
 */
import {Fetch} from "@/service/fetch";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {TeachingApi} from '@/api/teachingApi';
import {ContractApi} from '@/api/contractApi';
import {SetApi} from '@/api/settingApi';
import {CustomerApi} from '@/api/customerApi';

/**
 * Desc 选课固定课程列表查询
 * @param params 查询参数
 * @returns {any}
 */
export const getClassScheduleList = (params) => {
    const data = {
        url: TeachingApi.选课固定课程列表查询,
        data: params
    };
    return Fetch.post(data);
};

/**
 * Desc 查询试听选课固定课程列表
 * @param params 查询参数
 * @returns {any}
 */
export const previewScheduleList = (params) => {
    const data = {
        url: TeachingApi.查询试听选课固定课程列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * Desc 备选临时课程列表查询
 * @param params 查询参数
 * @returns {any}
 */
export const getBackupLessonList = (params) => {
    const data = {
        url: TeachingApi.备选临时课程列表查询,
        data: params
    };
    return Fetch.post(data);
};
/**
 * Desc 备选临时课程列表查询（批量排课）
 * @param params 查询参数
 * @returns {any}
 */
export const getBackupLessonListNew = (params) => {
    const data = {
        url: TeachingApi.备选临时课程列表查询新,
        data: params
    };
    return Fetch.post(data);
};

/**
 * Desc 获取试听备选课程
 * @param params 查询参数
 * @returns {any}
 */
export const preselectionList = (params) => {
    const data = {
        url: TeachingApi.获取试听备选课程,
        data: params
    };
    return Fetch.post(data);
};

/**
 * Desc 提交选课
 * @param params 查询参数
 * @returns {any}
 */
export const submitReservation = (params) => {
    const data = {
        url: TeachingApi.提交选课,
        data: params
    };
    return Fetch.post(data, 30000)
};
/**
 * Desc 提交换课
 * @param params 查询参数
 * @returns {any}
 */
export const submitChangeCourse = (params) => {
    const data = {
        url: TeachingApi.提交换课,
        data: params
    };
    return Fetch.post(data, 30000)
};
/**
 * Desc 操作人明细
 * @param params 查询参数
 * @returns {any}
 */
 export const operateList = (params) => {
    const data = {
        url: TeachingApi.操作人明细,
        data: params
    };
    return Fetch.post(data, 30000)
};
/**
 * Desc 试听申请提交
 * @param params 查询参数
 * @returns {any}
 */
export const previewBookingSave = (params) => {
    const data = {
        url: TeachingApi.试听申请提交,
        data: params
    };
    return Fetch.post(data)
};

/**
 * Desc 获取课程分类
 * @param params 查询参数
 * @returns {any}
 */
export const getCourseType = (params) => {
    const data = {
        url: SetApi.获取课程分类,
        data: params
    };
    return Fetch.post(data)
};

/**
 * Desc 获取教学Leads下的所有合同
 * @param params 查询参数
 * @returns {any}
 */
export const getTeachContractList = (params) => {
    const data = {
        url: ContractApi.获取教学Leads下的所有合同,
        data: params
    };
    return Fetch.post(data)
};

/**
 * Desc 提交选课到预定选课
 * @param params 查询参数
 * @returns {any}
 */
export const submitSelectionToReservation = (params) => {
    return {
        type: ServiceActionEnum.提交选课到预定选课,
        params: params,
    }
};

/**
 * Desc 获取是否设置审批
 * @param params 查询参数
 * @returns {any}
 */
export const getCenterConfig = (params) => {
    const data = {
        url: SetApi.获取中心配置信息,
        data: params
    };
    return Fetch.post(data)
};
/**
 * 获取leads下合同，用于客户中心选课入口
 * @param params
 * @returns {Promise<any>}
 */
export const getContractWithChooseLesson = (params: any) => {
    const data = {
        url: ContractApi.获取leads下合同,
        data: params
    };
    return Fetch.post(data)
};

export const getBabyInfo = (params: any) => {
    const data = {
        url: CustomerApi.客户360基本信息,
        data: params
    };
    return Fetch.post(data)
};

export const getCustomerPackageDetail = (params: any) => {
    const data = {
        url: ContractApi.获取用户课包详情,
        data: params,
    };
    return Fetch.post(data);
};

/**
 *
 * @param params
 * @returns {Promise<void>}
 */
export const getClientInfo = async (params: any): Promise<any> => {
    try {
        return Promise.all([
            getContractWithChooseLesson(params),
            getBabyInfo(params)
        ]).then((res: any) => {
            return Promise.resolve({
                chooseLesson: res[0],
                babyInfo: res[1]
            })
        })
    } catch (e) {

    }
}
