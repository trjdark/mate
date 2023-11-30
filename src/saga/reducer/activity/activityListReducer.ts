/**
 * desc:
 * User: vicky.yu
 * Date: 2018/12/17
 * Time: 下午17:15
 */
import {handleActions} from 'redux-actions';
import {Events} from "@/events/events";

const defaultState = {
    activityData: [],       // 教学活动列表数据
    selectedBaby: {},       // 客户360报名选中的宝宝
    selectedActivity:[],    // 客户360报名选中的活动
    activityList: [],       // 360会员活动记录列表
};
const actions = handleActions(
    {
        [Events.GET_ACTIVITY_LIST](state: any, action: any) {
            return {
                ...state,
                activityData: action.data
            }
        },
        // 360会员活动记录
        [Events.SET_VIP_ACTIVITY_LIST](state: any, action: any) {
            return {
                ...state,
                activityList: action.data
            }

        },
        // 360会员活动选择宝宝
        [Events.SELECT_BABY](state: any, action: any) {
            return {
                ...state,
                selectedBaby: action.data
            }

        },
        // 360会员活动选择活动
        [Events.SELECT_ACTIVITY](state: any, action: any) {
            return {
                ...state,
                selectedActivity: action.data
            }

        },
        // 360会员活动签到重置数据
        [Events.RESET_CHECKIN_DATA](state: any, action: any) {
            const {selectedBaby360, selectedActivity} = action.data;
            return {
                ...state,
                selectedActivity,
                selectedBaby:selectedBaby360
            }

        },
    },
    defaultState);

let activityListReducer: any = {};
activityListReducer.activityList = actions;
export default activityListReducer;
