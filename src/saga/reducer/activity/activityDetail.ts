/*
* desc: 教学活动详情reducer
* User: lyon.li@gymboglobal.com
* Date: 2018/12/7
* Time: 上午14:10
* */
import {handleActions} from 'redux-actions';
import {Events} from "@/events/events";
import {Action} from "@/.h/global";
import {SafeCalculate} from "@/common/utils/commonUtils";

const defaultState = {
    types: {
        approvalStatusTeach: [],        // 教学活动审批状态
        teachingActivityType: [],       // 教学活动类型
        teachingActivityPurpose: [],    // 教学活动目的选项
        teachActivityCostDuration: [],  // 教学活动时长
        activityPayMode: [],            // 教学活动付费方式
        fieldType: [],                  // 教学活动地点类型
        approvalStatusTeachEnum: {},    // 教学活动审批状态枚举
        teachingActivityTypeEnum: {},   // 教学活动类型枚举
        teachingActivityPurposeEnum: {}, // 教学活动目的选项枚举
        activityPayModeEnum: {},         // 教学活动付费方式枚举
        payModeEnum: {},                 // 教学活动付费方式枚举(用于取值)
        fieldTypeEnum: {},               // 教学活动地点类型枚举
        teachActivityAttendanceStatusEnum: {},  // 教学活动参加情况枚举
        attendanceStatusEnum: {},        // 教学活动参加情况枚举（用于取值）
    },
    activityField: undefined,           // 活动地点
    attachments: [],                    // 附件
    describe: '',                       // 活动详情
    payMode: undefined,                 // 扣费方式
    estimateActivityCost: undefined,    // 规划的活动费用
    estimateParticipantNum: undefined,  // 规划的宝宝数
    estimateTotalCourse: 0,             // 规划的总扣课数
    estimateTotalFee: 0,                // 规划的总付费金额
    fieldType: undefined,               // 地点类型
    estimateFreeGifts: [],              // 规划的活动赠品
    purpose: undefined,                 // 活动目的
    staffs: [],                         // 参与员工
    staffsName:[],                      // 参与员工姓名
    staffList: [],                       // 在职员工列表
    babys: [],                          // 参与会员
    startDateTime: Date.now(),          // 活动时间
    theme: '',                          // 活动名称
    type: undefined,                    // 活动类型
    classRoomId: undefined,             // 教室Id
    classroomName: '',                  // 教室名称
    duration: undefined,                // 时长
    monthlyFlag: false,                 // 月结标志
    approvalStatus: '',                 // 审批状态
    classroomList: [],                  // 教室列表,
    applicationConsumption: undefined,  // 扣课数
    applicationFee: undefined,          // 付费金额
    selectedBaby: [],                   // 报名时选中的宝宝
    selectedBabyId: [],                 // 签到时选中的宝宝
    selectedCourse: [],                 // 选中的课程包
    signList: [],                       // 签到列表,
    actualActivityCost: '',             // 实际活动费用
    actualFreeGifts: [],                // 实际活动赠品
    actualParticipantNum: 0,            // 实际宝宝数
    actualTotalCourse: 0,               // 实际总扣课数
    actualTotalFee: 0,                  // 实际总付费金额
    classroomUsable: true,              // 教室是否可用
};

const reducer = handleActions(
    {
        [Events.SET_ACTIVITY_TYPE_DEF](state: any, action: Action) {
            // 设置教学活动的各个类型值
            const types = {};
            action.data.forEach(function (item) {
                // 把获得的数据转换成所需要的数组形式
                const {code, codeValue} = item;
                types[code] = codeValue;
            });

            for (let key in types) {
                // 把获得的数据转换成所需要的枚举形式
                if (types.hasOwnProperty(key)) {
                    types[key].forEach(item => {
                        if (!types[`${key}Enum`]) {
                            types[`${key}Enum`] = {};
                        }
                        if (!types[`${key}Obj`]) {
                            types[`${key}Obj`] = {};
                        }
                        types[`${key}Enum`][item.codeValue] = item.code;    // 用于比较
                        types[`${key}Obj`][item.code] = item.codeValue;     // 用于取值
                    })
                }
            }

            return {
                ...state,
                types
            };
        },
        [Events.SET_STAFFLISTONWORK](state: any, action: Action) {
            // 设置在职员工列表
            return {
                ...state,
                staffList: action.list
            }
        },
        [Events.SET_FREEGIFTLIST](state: any, action: Action) {
            // 设置规划的活动赠品
            return {
                ...state,
                estimateFreeGifts: action.data
            }
        },
        [Events.SET_ATTACHMENT](state: any, action: Action) {
            // 设置活动附件
            return {
                ...state,
                attachments: action.data
            }
        },
        [Events.SET_FIELDTYPE](state: any, action: Action) {
            // 设置地点类型
            return {
                ...state,
                fieldType: action.data
            }
        },
        [Events.SET_CLASSROOMLIST](state: any, action: Action) {
            // 设置教室列表
            return {
                ...state,
                classroomList: action.list
            }
        },
        [Events.SET_ESTIMATEDPARTICIPANTNUM](state: any, action: Action) {
            // 设置宝宝数,总扣课数，总付费金额
            const {applicationConsumption, applicationFee} = state;
            const {data} = action;
            return {
                ...state,
                estimateParticipantNum: data,
                estimateTotalCourse: SafeCalculate.mul(data * applicationConsumption),
                estimateTotalFee: SafeCalculate.mul(data * applicationFee),
            }
        },
        [Events.SET_APPLICATIONFEE](state: any, action: Action) {
            // 设置付费金额和总付费金额
            const {estimateParticipantNum} = state;
            const {data} = action;
            return {
                ...state,
                applicationFee: data,
                estimateTotalFee: SafeCalculate.mul(estimateParticipantNum * data),
            }
        },
        [Events.SET_APPLICATIONCONSUMPTION](state: any, action: Action) {
            // 设置扣课数和总扣课数
            const {estimateParticipantNum} = state;
            const {data} = action;
            return {
                ...state,
                applicationConsumption: data,
                estimateTotalCourse: SafeCalculate.mul(estimateParticipantNum * data),
            }
        },
        [Events.SET_STAFFS](state: any, action: Action) {
            // 设置员工列表
            const {data} = action;
            return {
                ...state,
                staffs: data,
            }
        },
        [Events.SET_ALL_ACTIVITY_DATA](state: any, action: Action) {
            // 设置所有数据
            const {data} = action;
            return {
                ...state,
                ...data,
            }
        },
        [Events.SET_SELECTED_BABY_ID](state: any, action: Action) {
            // 设置签到时选中的宝宝
            return {
                ...state,
                selectedBabyId: action.data,
            }
        },
        [Events.SET_SELECTED_BABY](state: any, action: Action) {
            // 设置报名时选中的宝宝
            return {
                ...state,
                selectedBaby: action.data,
            }
        },
        [Events.SET_SELECTED_COURSE](state: any, action: Action) {
            // 设置报名时选中的课程包
            return {
                ...state,
                selectedCourse: action.data,
            }
        },
        [Events.SET_SIGN_LIST](state: any, action: Action) {
            // 设置已报名列表数据
            return {
                ...state,
                signList: action.data,
            }
        },
        [Events.SET_STARTTIME](state: any, action: Action) {
            // 设置活动时间
            return {
                ...state,
                startDateTime: action.data,
            }
        },
        [Events.SET_DURATION](state: any, action: Action) {
            // 设置活动时长
            return {
                ...state,
                duration: action.data,
            }
        },
        [Events.SET_CLASSROOMID](state: any, action: Action) {
            // 设置活动教室id
            return {
                ...state,
                classRoomId: action.data,
            }
        },
        [Events.SET_ACTUALACTIVITYCOST](state: any, action: Action) {
            // 设置实际的活动费用
            return {
                ...state,
                actualActivityCost: action.data,
            }
        },
        [Events.SET_ACTUALPARTICIPANTNUM](state: any, action: Action) {
            // 设置实际的宝宝数,实际的总扣课数，实际的总付费金额
            const {applicationConsumption, applicationFee} = state;
            const {data} = action;
            return {
                ...state,
                actualParticipantNum: data,
                actualTotalFee: SafeCalculate.mul(data * applicationFee),
                actualTotalCourse: SafeCalculate.mul(data * applicationConsumption),
            }
        },
        [Events.SET_ACTUALFREEGIFTLIST](state: any, action: Action) {
            // 设置实际的活动赠品
            return {
                ...state,
                actualFreeGifts: action.data
            }
        },
        [Events.SET_PAYMODE](state: any, action: Action) {
            // 设置扣费方式，以及扣费方式与扣课数和付费数的联动
            const payMode = action.data;
            let {types, applicationConsumption, applicationFee, estimateTotalCourse, estimateTotalFee} = state;
            const {activityPayModeEnum} = types;
            if (payMode === activityPayModeEnum.仅扣课) {
                applicationFee = undefined;
                estimateTotalFee = 0;
            } else if (payMode === activityPayModeEnum.仅付费) {
                applicationConsumption = undefined;
                estimateTotalCourse = 0;

            } else if (payMode === activityPayModeEnum.免费) {
                applicationFee = undefined;
                estimateTotalFee = 0;
                applicationConsumption = undefined;
                estimateTotalCourse = 0;
            }

            return {
                ...state,
                payMode,
                applicationFee: applicationFee,
                estimateTotalFee: estimateTotalFee,
                applicationConsumption: applicationConsumption,
                estimateTotalCourse: estimateTotalCourse,
            }
        },
        [Events.SET_BABYS](state: any, action: Action) {
            // 编辑参与会员内容时设置baby列表
            return {
                ...state,
                babys: action.data
            }
        },
        // 活动签到重置数据
        [Events.RESET_CHECKIN_DATA](state: any, action: any) {
            const {selectedBaby, selectedCourse} = action.data;
            return {
                ...state,
                selectedBaby,
                selectedCourse,
            }

        },
        [Events.RESET_ACTIVITY_DATA](state: any, action: Action) {
            // 重置所有数据
            return {
                ...state,
                ...action.data,
            }
        },
        [Events.SET_CLASSROOM_USABLE](state: any, action: Action) {
            // 重置教室可用行
            return {
                ...state,
                classroomUsable: action.data,
            }
        },
    },
    defaultState
);

let activityDetailReducer: any = {};
activityDetailReducer.activityDetail = reducer;
export default activityDetailReducer;
