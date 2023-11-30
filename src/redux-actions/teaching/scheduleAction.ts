/**
 * Desc: 教学排课后台数据交互
 * User: Debby.Deng
 * Date: 2018/12/17,
 * Time: 下午12:04
 */

import {Fetch} from "@/service/fetch";
import {TeachingApi} from "@/api/teachingApi";
import {Message} from "@/ui/component/message/message";
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";
import {Events} from "@/events/events";
import axios from "axios";
import {Storage} from "@/common/utils/storage";
import {Loading} from "@/ui/component/loading";
import {User} from "@/common/beans/user";

/**
 * 清除初始化数据
 * @param {any} params
 * @returns {any}
 */
export const clearTeachingInit = () => {
    return {
        type: Events.CLEAR_TEACHING_INIT_DATA,
    }
};
/**
 * 课程表初始化
 * @param {any} params
 * @returns {any}
 */

export const teachingInit = (params) => {
    return {
        type: ServiceActionEnum.教学课程表初始化,
        params: params,
    }
};

/**
 * 预约选择宝宝ga,gb dispatch action
 * @param {any} params
 * @returns {any}
 */

export const getGaGbInit = (params) => {
    return {
        type: ServiceActionEnum.教学获取GAGB列表,
        params: params,
    }
};

/**
 * 获取宝宝列表
 * @param {any} params
 * @returns {any}
 */
export const getBabyList = (params) => {
    const data = {
        url: TeachingApi.宝宝预约,
        data: params
    };
    return Fetch.post(data);
};

 /**
  * 获取宝宝合同列表
  * @param params
  * @returns {any}
  */
 export const getBabyContract=(params)=>{
     const data={
         url:TeachingApi.宝宝合同,
         data:params,
     }
     return Fetch.post(data);
 }

/**
 * 新增固定课程
 * @param {any} params
 * @returns {any}
 */
export const addWeekSchedule = (params) => {
    const data = {
        url: TeachingApi.新增固定排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('新增成功');
    });

};
/**
 * 编辑固定课程
 * @param {any} params
 * @returns {any}
 */
export const editWeekSchedule = (params) => {
    const data = {
        url: TeachingApi.编辑固定排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('保存成功');
    });

};
/**
 * 删除固定课程
 * @param {any} params
 * @returns {any}
 */
export const deleteWeekSchedule = (params) => {
    const data = {
        url: TeachingApi.删除固定排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('删除成功');
    });

};

/**
 * 查询固定课程
 * @param {any} params
 * @returns {any}
 */
export const getWeekSchedule = (params) => {
    const data = {
        url: TeachingApi.查询固定排课,
        data: params
    };
    return Fetch.post(data);

};

/**
 * 新增临时排课
 * @param {any} params
 * @returns {any}
 */
export const addDaySchedule = (params) => {
    const data = {
        url: TeachingApi.新增临时排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('新增成功');
    });

};

/**
 * 编辑临时排课
 * @param {any} params
 * @returns {any}
 */
export const editDaySchedule = (params) => {
    const data = {
        url: TeachingApi.编辑临时排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('保存成功');
    });

};

/**
 * 删除临时排课
 * @param {any} params
 * @returns {any}
 */
export const removeWeekSchedule = (params) => {
    const data = {
        url: TeachingApi.删除临时排课,
        data: params
    };
    return Fetch.post(data).then(() => {
        Message.success('删除成功');
    });

};

/**
 * 查询临时排课
 * @param {any} params
 * @returns {any}
 */
export const getTemporarySchedule = (params) => {
    const data = {
        url: TeachingApi.查询临时排课,
        data: params
    };
    return Fetch.post(data);

};

/**
 * 查询签到列表
 * @param {any} params
 * @returns {any}
 */
export const getSignInList = (params) => {
    const data = {
        url: TeachingApi.签到列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 查询签到详情
 * @param {any} params
 * @returns {any}
 */
export const getSignInBabyList = (params) => {
    const data = {
        url: TeachingApi.课程详情签到列表,
        data: params
    };
    return Fetch.post(data);
};
/**
 * 判断是否月结
 * @param date
 * @returns {any}
 */
export const isManualMonth = (date) => {
    const data = {
        url: TeachingApi.判断是否月结,
        data: date
    };
    return Fetch.post(data);
};
/**
 * 状态变更
 * @param {any} params
 * @returns {any}
 */
export const changeStatus = (params) => {
    const data = {
        url: TeachingApi.状态变更,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 删课
 * @param {any} params
 * @returns {any}
 */
export const deleteCourse = (params) => {
    const data = {
        url: TeachingApi.删除未上课程,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 请假确认列表
 * @param {any} params
 * @returns {any}
 */
export const leaveConfirmList = (params) => {
    const data = {
        url: TeachingApi.请假确认列表,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 请假提交
 * @param {any} params
 * @returns {any}
 */
export const leaveSubmit = (params) => {
    const data = {
        url: TeachingApi.请假提交,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 签到批量打印
 * @param {any} params
 * @returns {any}
 */
export const bulkPrint = (params) => {
    const config = {
        headers: {
            token: Storage.get('_token'),
            userName: User.userName,
            centerCode: User.centerCode,
            userId: User.userId
        },
        responseType: 'blob',
    };
    Loading.add();
    return axios.post(`/api${TeachingApi.批量打印}`, params, config).then(
        res => {
            const type = res.headers[`content-type`];
            const filename = res.headers[`content-disposition`].split('=')[1];
            let link = document.createElement('a');
            link.download = filename;
            link.style.display = 'none';
            let blob = typeof File === 'function'
                ? new File([res.data], filename, {type: type})
                : new Blob([res.data], {type: type});
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // 移除遮罩
            Loading.remove();
        },
        err => {
            Loading.remove();
        });

};
/**
 * 签到打印有无联系方式
 * @param {any} params
 * @returns {any}
 */
export const singlePrint = (params) => {
    const data = {
        url: TeachingApi.签到打印,
        data: params
    };
    return Fetch.post(data);
};

/**
 * 预约宝宝排课
 * @param {any} params
 * @returns {any}
 */
export const bookCourse = (params) => {
    const data = {
        url: TeachingApi.预约排课,
        data: params
    };
    return Fetch.post(data).then((res) => {
        Message.success('排课成功')
    });
};

/**
 * 预约宝宝等位
 * @param {any} params
 * @returns {any}
 */
export const bookWaiting = (params) => {
    const data = {
        url: TeachingApi.预约等位,
        data: params
    };
    return Fetch.post(data).then((res) => {
        Message.success('安排等位成功')
    });
};

/**
 * 修改签到时间
 * @param params
 */
export const changeCheckInTime = (params) => {
    return {
        type: ServiceActionEnum.修改签到时间,
        params: params,
    }
};

/**
 * 查询课程今后的排课情况
 * @param date
 * @returns {any}
 */
export const queryCourseScheduleAfterToday = (date) => {
    const data = {
        url: TeachingApi.查询固定排课今后选课情况,
        data: date
    };
    return Fetch.post(data);
};


/**
 * 查询等位日志列表
 * @param params
 */
export const getAlleleList = (params) => {
    const data = {
        url:TeachingApi.等位日志列表,
        data:params,
    };
    return Fetch.post(data)
}
