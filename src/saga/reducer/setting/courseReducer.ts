/**
 * desc: 课程包
 * Date: 2018/8/23
 * Time: 下午8:14
 */

import {handleActions} from 'redux-actions';
import {Events} from "../../../events/events";



const actions = handleActions({
    [Events.GET_CENTER_COURSE_PACKAGE_LIST](state:any, action:any){
        const data = {
            data:action.data.list,
            totalSize:action.data.totalSize
        }
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE_LIST]:{
                data: data
            }
        }
    },
    [Events.GET_CENTER_COURSE_PACKAGE](state:any, action:any){
        // 老数据遍历适用日 Todo今后需要修改
        const allDay = ['mondayOk', 'tuesdayOk','wednesdayOk', 'thursdayOk', 'fridayOk', 'saturdayOk', 'sundayOk']
        const workDay = [];
        allDay.forEach((item:string) => {
            if(action.data[item] === 1){
                workDay.push(item)
            }

        })
        // 转 unit 为中文单位
        let unitData;
        if (action.data.unit==='51001') {unitData='天'}
        if (action.data.unit==='51002') {unitData='周'}
        if (action.data.unit==='51003') {unitData='月'}
        let actionData = Object.assign({}, action.data, {unit:unitData})
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE]:{
                data: {
                    hqPackage: actionData,
                    workDay: workDay
                }
            }
        }
    },
    [Events.GET_CENTER_COURSE_PACKAGE_PRICE_HISTORY_LIST](state:any,action:any) {
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE_PRICE_HISTORY_LIST]: {data:action.data}
        }
    },
    [Events.GET_CENTER_COURSE_PACKAGE_PROMOTION_HISTORY_LIST](state:any,action:any) {
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE_PROMOTION_HISTORY_LIST]: {data:action.data}
        }
    },
    [Events.UPDATE_CENTER_COURSE_PACKAGE_PROMOTION_SUCCESS](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE_PROMOTION_HISTORY_LIST]: {data: action.data}
        }
    },
    [Events.UPDATE_CENTER_COURSE_PACKAGE_PRICE_SUCCESS](state:any, action:any){
        return {
            ...state,
            [Events.GET_CENTER_COURSE_PACKAGE_PRICE_HISTORY_LIST]: {data: action.data}
        }
    }
}, {});

let CourseReducer:any={};

CourseReducer["course"] = actions;

export default CourseReducer;
