/**
 * desc: 选课情况
 * User: colin.lu
 * Date: 2018/12/29
 * Time: 上午10:00
 */
import {Fetch} from "../../service/fetch";
import {TeachingApi} from '../../api/teachingApi';
import {Storage} from "@/common/utils/storage";

/**
 * Desc 查询选课情况列表
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getAttendanceRecordList = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询选课情况列表,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 查询选课情况日历
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const getAttendanceRecordCalendar = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.查询选课情况日历,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * Desc 删除未上课程
 * @param centerId currentCenterId{any}
 * @returns {any}
 */
export const deleteUnClass = (params:any):Promise<any> => {
    const param = {
        url: TeachingApi.删除未上课程,
        data: params
    };
    return Fetch.post(param)
        .then((res:any) => {
            return Promise.resolve(res)
        }, (err:any) => {
            return Promise.reject(err)
        })
};

/**
 * 选择需要换课的已约课（保存在本地）
 * @param params
 * @returns {{type: ServiceActionEnum; params: any}}
 */
export const recordSelectCourseList = (params:any) => {
    Storage.set('courseList', params)
};

/**
 * 获取需要换课的已约课
 * @returns {any}
 */
export const getSelectCourseList = () => {
    return Storage.get('courseList')
};
