import {handleActions} from 'redux-actions';
import {Events} from "../../events/events";



const actions = handleActions({
    [Events.GET_HQ_PACKAGE_LIST](state:any, action:any){
        return {
            ...state,
            [Events.GET_HQ_PACKAGE_LIST]:{
                data: action.data
            },
            [Events.GET_HQ_PACKAGE_INFO]:{
                data: null
            },
        }
    },
    [Events.DELETE_HQ_PACKAGE_CENTER](state:any, action:any){//删除中心
        const pkgInfo={...state}[Events.GET_HQ_PACKAGE_INFO].data;
        return {
            ...state,
            [Events.GET_HQ_PACKAGE_INFO]:{
                data: {...pkgInfo,pkgCenterList:action.data}
            },
        }
    },
    [Events.ADD_HQ_PACKAGE_CENTER](state:any, action:any){//添加中心
        const pkgInfo={...state}[Events.GET_HQ_PACKAGE_INFO]?
            {...state}[Events.GET_HQ_PACKAGE_INFO].data : {};
        let {centerList,addCenter}=action.data;
        centerList=centerList.concat(addCenter);
        return {
            ...state,
            [Events.GET_HQ_PACKAGE_INFO]:{
                data: {...pkgInfo,pkgCenterList:centerList}
            },
        }
    },

    [Events.GET_HQ_PACKAGE_INFO](state:any, action:any){
        const allDay = ['mondayOk', 'tuesdayOk','wednesdayOk', 'thursdayOk', 'fridayOk', 'saturdayOk', 'sundayOk'];
        const workDay = [];
        allDay.forEach((item:string) => {
            if(action.data.pkgInfo[item] === 1){
                workDay.push(item)
            }
        });
        return {
            ...state,
            [Events.GET_HQ_PACKAGE_INFO]:{
                data: {...action.data,workDay:workDay}
            }
        }
    },
    [Events.GET_HQ_PACKAGE_CENTER](state:any, action:any){
        const centerList=action.data.list;
        const pager={
            currentPage: action.data.pageNo,
            pageSize: action.data.pageSize,
            totalSize: action.data.totalSize,
            totalNo: action.data.totalNo
        }
        const dataSource=centerList.map((list,index)=>{
            return {
                "key": index,
                "centerCode": list.centerCode,
                "centerName": list.centerName,
                "GI": list.gi,
                "FOC": list.foc,
                "area": list.districtId,
                "province": list.provinceId,
                "city": list.cityId,
                "centerId":list.centerId,
                "status":list.isEnabled? '启用' : '停用',
            }
        });
        return {
            ...state,
            [Events.GET_HQ_PACKAGE_CENTER]:{
                data: {centerList:centerList,pagination:pager,dataSource:dataSource}
            }
        }
    },


}, {});

let CourseGeneralReducer:any={};

CourseGeneralReducer["courseGeneral"] = actions;

export default CourseGeneralReducer;
