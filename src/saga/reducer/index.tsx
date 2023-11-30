/**
 * desc: 共有状态reducer维护
 * User:
 * Date: 2018/7/30
 * Time: 下午3:28
 */

import {combineReducers} from 'redux';
import RoleReducer from './setting/roleReducer';
import RoomReducer from './setting/roomReducer';
import ProductReducer from './setting/productReducer';
import LessonCategoryReduder from './setting/lessonCategoryReducer';
import PromotorReducer from "./setting/promotorReducer";
import LoginReducer from "./loginReducer";
import CenterReducer from "./setting/centerReducer";
import LessonMatReduder from './setting/lessonMaterialReducer';
import HolidayReducer from './setting/holidayReducer';
import CourseReducer from "./setting/courseReducer";
import EmployReducer from './setting/employeeReducer';
import CourseGeneralReducer from "./courseGeneralReducer";
import homeReducer from "./homeReducer";
import AssignReducer from "./customer/assignReducer";
import AssignRecordReducer from './customer/assignRecordReducer';
import Client360Reducer from './customer/client360';
import TaskCenterReducer from './customer/taskCenter';
import ContractReducer from './contractReducer';
import marketListReducer from './market/marketListReducer';
import marketDetailReducer from './market/marketDetail';
import activityDetailReducer from './activity/activityDetail';
import activityListReducer from './activity/activityListReducer'
import ScheduleReducer from "./teaching/scheduleReducer";
import CourseSelectionReducer from './teaching/choose';
import QueryReducer from "./customer/innerQueryReducer";
import TmkReducer from './setting/tmkReducer';
import RCourseReducer from "@/saga/reducer/teaching/rCourseReducer";

let reducerMap:any = {};

const reducerArr = [
    RoleReducer,
    RoomReducer,ProductReducer,
    LessonCategoryReduder,
    PromotorReducer,LoginReducer,
    CenterReducer,LessonMatReduder,
    HolidayReducer, CourseReducer,
    EmployReducer,CourseGeneralReducer,
    homeReducer,AssignReducer,
    AssignRecordReducer,
    Client360Reducer,
    TaskCenterReducer,ContractReducer,
    marketListReducer,
    marketDetailReducer,
    activityDetailReducer,
    activityListReducer,
    ScheduleReducer,
    CourseSelectionReducer,
    QueryReducer, TmkReducer,
    RCourseReducer
];

reducerArr.map((reducer)=>{
    Object.keys(reducer).map(reducerName=>{
        reducerMap[reducerName]=reducer[reducerName]
    });
});

const reducers = combineReducers(reducerMap);

export default reducers;
