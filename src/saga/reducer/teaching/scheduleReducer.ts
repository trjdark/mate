/**
 * Desc: 课程表reducer
 * User: Debby.Deng
 * Date: 2018/12/17,
 * Time: 下午3:24
 */
import {handleActions} from "redux-actions";
import {Events} from "@/events/events";

const actions = handleActions(
    {
        /**
         * 获取课程表上页面的路由地址
         */
        [Events.TEACHING_SCHEDULE_LAST_ROUTE](state: any, action: any) {

            return {
                ...state, lastRoutePath: action.params
            }
        },
        /**
         * 清除页面初始化redux数据
         */
        [Events.CLEAR_TEACHING_INIT_DATA](state: any) {

            return {
                ...state, [Events.GET_TEACHING_ROOM_LIST]: {data: []}
            }
        },
        /**
         * 获取ins,hi
         */
        [Events.GET_TEACHING_INS_HI](state: any, action: any) {
            return {
                ...state,
                [Events.GET_TEACHING_INS_HI]: {
                    data: action.data
                }
            }
        },
        /**
         * 获取教室
         */
        [Events.GET_TEACHING_ROOM_LIST](state: any, action: any) {
            return {
                ...state,
                [Events.GET_TEACHING_ROOM_LIST]: {
                    data: action.data
                }
            }
        },
        /**
         * 获取课程包
         */
        [Events.GET_TEACHING_COURSE_LIST](state: any, action: any) {
            return {
                ...state,
                [Events.GET_TEACHING_COURSE_LIST]: {
                    data: action.data
                }
            }
        },
        /**
         * 获取GA,HGA
         */
        [Events.GET_TEACHING_GA_LIST](state: any, action: any) {
            return {
                ...state,
                [Events.GET_TEACHING_GA_LIST]: {
                    data: action.data
                }
            }
        },
        /**
         * 获取GB,HGB
         */
        [Events.GET_TEACHING_GB_LIST](state: any, action: any) {
            return {
                ...state,
                [Events.GET_TEACHING_GB_LIST]: {
                    data: action.data
                }
            }
        },
        /**
         * 选课时间
         */
        [Events.UPDATE_CHECK_IN_TIME](state: any, action: any) {
            return {
                ...state,
                [Events.UPDATE_CHECK_IN_TIME]: {
                    data: action.data
                }
            }
        },

    },
    {}
);

let ScheduleReducer: any = {};
ScheduleReducer.schedule = actions;
export default ScheduleReducer;
