/**
*Desc: 添加周课程，临时排课
*User: Debby.Deng
*Date: 2018/12/7,
*Time: 上午11:21
*/
import * as React from "react";
import {PageTitle} from "../../../../component/pageTitle";
import {form} from "../../../../../common/decorator/form";
import {Form, Input, Select, TimePicker,InputNumber} from "antd";
import moment from 'moment';
import {connect} from "../../../../../common/decorator/connect";
import {
    selectScheduleCourse,
    selectScheduleRoom, selectScheduleRoomOnlyId
} from "../../../../../saga/selectors/teaching/scheduleSelector";
import {User} from "@/common/beans/user";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const FormItem = Form.Item;
const {Option}=Select;

interface propSet {
    type:'week'|'day',//week:一周排课，day:临时排课
    time:string,//新增周几，(日期）课程
    form:any,
    courseInfo:courseObj,
    withDelete:boolean,//是否为编辑：true:编辑， false: 新增
    [propName:string]:any,
}
interface courseObj {
    startTime?:string,//课程开始时间
    endTime?:string,//课程结束时间
    courseId?:string,//课程ID
    classroomId?:string,//教室ID
    primaryInsStaffId?:string,//主教ID
    assistantInsStaffId?:string,//辅教ID
    capacity?:number,//教室容量
    maxCapacity?:number,//教室最大容量
    classScheduleId?:string,//排课id

}

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])
const selectInsOption = isPostTransRole
    ? {
        workingStatus: '1',
        roleList: ['INS', 'HI']
    }
    : {
        workingStatus: '1',
        postName: ["INS", 'HI']
    };

@form()
@connect((state)=>({
    courseList:selectScheduleCourse(state),
    roomList:selectScheduleRoom(state),
    roomListOnlyId:selectScheduleRoomOnlyId(state),
    insList: selectTotalEmployeeList(state, selectInsOption),

}),{})
class AddTeachingCourse extends React.Component<propSet>{
    state={
        courseLength:0,//课程时长
        maxCapacity:(this.props.courseInfo && this.props.courseInfo.maxCapacity) || 1,
    };
    isIncludeIns=(id)=>{
        const {insList}=this.props;
        const idx=insList.findIndex((item)=>(item.staffId===id));
        return idx>-1;
    };
    setInitialValue=(value,type?)=>{
        if(type==='time'){
            return value? moment(value,'HH:mm') : undefined;
        }
        //如果ins离职，将当前值为空
        if(type==='primaryInsStaffId' || type==='assistantInsStaffId'){//主教
            return this.isIncludeIns(value)? value : '';
        }
        return value? value : undefined;
    };
    changeCourse=(value)=>{
        const {courseList,form}=this.props;
        const currentCourse=courseList.filter((item)=>(item.courseId===value))[0];
        form.setFieldsValue({courseLength:currentCourse.minutes});
        this.setState({courseLength:currentCourse.minutes});
    };
    changeRoom=(value)=>{
        const {form,roomList}=this.props;
        const currentRoom=roomList.filter((item)=>(item.id===value))[0];
        form.setFieldsValue({capacity:currentRoom.capacity,maxCapacity:currentRoom.maxCapacity});
        this.setState({maxCapacity:currentRoom.maxCapacity});
    };

    render(){
        const {form,type,time,courseList,roomList,insList,courseInfo,withDelete }=this.props;
        // todo
        let {courseLength, maxCapacity} = this.state;
        if(courseInfo.startTime){
            const {startTime,endTime}=courseInfo;
            courseLength=courseLength ||
                Math.abs(moment(startTime,'HH-mm').diff(moment(endTime,'HH-mm'))/1000/60);
        }
        if(!withDelete){//新建
            maxCapacity = 1
        }
        const {getFieldDecorator}=form;
        let title='';
        if(type==='week'&& !withDelete){
            title='添加周课程';
        }else if(type==='week' && withDelete){
            title='编辑周课程';
        }else if(type==='day'&& !withDelete){
            title='添加课程';
        }else if(type==='day' && withDelete){
            title='编辑课程';
        }else{
            title='添加课程';
        }
        const disabledHours=()=>{return [0,1,2,3,4,5,6,21,22,23]};
        return <div className='gym-teaching-schedule-add'>
            <PageTitle title={`${title}`}/>
            <div className='plr20'>
                <FormItem label={`课程时间:`} className='flex'>
                    {
                        type==='week'?
                        <span className='mr10'>{time}</span> :
                            <span className='mr10'>{time}</span>

                    }
                    {getFieldDecorator(`startTime`, {
                        rules: [{required:true,message:'请选择课程时间'}],
                        initialValue: this.setInitialValue(courseInfo.startTime,'time')
                    })(
                        <TimePicker disabledHours={disabledHours}
                                    hideDisabledOptions={true}
                                    minuteStep={5}
                                    disabled={withDelete}
                                    defaultOpenValue={moment('07:00','HH:mm')}
                                    format={`HH:mm`}/>
                    )}
                </FormItem>
                <FormItem className='hide'>
                    {getFieldDecorator(`courseLength`, {
                        initialValue:this.setInitialValue(courseLength)
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={`课程代码:`} className='flex'>
                    {getFieldDecorator(`courseId`, {
                        rules: [{required:true,message:'请选择课程代码'}],
                        initialValue: this.setInitialValue(courseInfo.courseId),
                    })(
                        <Select disabled={withDelete} placeholder={'请选择'} onChange={this.changeCourse}>
                            {
                                courseList.map((item)=>{
                                    return(
                                        <Option key={item.courseId}
                                                value={item.courseId}>{item.courseCode}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                    <span className='c999 ml15'>{`时长 ：${courseLength} 分钟`}</span>
                </FormItem>
                <FormItem label={`教室:`} className='flex'>
                    {getFieldDecorator(`classroomId`, {
                        rules: [{required:true,message:'请选择教室'}],
                        initialValue: this.setInitialValue(courseInfo.classroomId),
                    })(
                        <Select disabled={withDelete} placeholder={'请选择'} onChange={this.changeRoom}>
                            {
                                roomList.map((item)=>{
                                    return(
                                        <Option value={item.id} key={item.id}>{item.classroomName}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <div className='flex'>
                    <FormItem label={`主教:`} className='flex'>
                        {getFieldDecorator(`primaryInsStaffId`, {
                            rules: [{required:true,message:'请选择主教'}],
                            initialValue: this.setInitialValue(courseInfo.primaryInsStaffId,'primaryInsStaffId'),

                        })(
                            <Select placeholder={'请选择'}>
                                {
                                    insList.map((item)=>{
                                        return(
                                            <Option value={item.staffId} key={item.staffId}>
                                                {item.englishName}{item.chineseName}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={`助教:`} className='flex'>
                        {getFieldDecorator(`assistantInsStaffId`, {
                            rules: [],
                            initialValue: this.setInitialValue(courseInfo.assistantInsStaffId,'assistantInsStaffId'),

                        })(
                            <Select allowClear={true} placeholder={'请选择'}>
                                {
                                    insList.map((item)=>{
                                        return(
                                            <Option value={item.staffId} key={item.staffId}>
                                                {item.englishName}{item.chineseName}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </div>
                <div className='flex'>
                    <FormItem label='标准人数:' className='flex gym-teaching-schedule-add-room'>
                        {getFieldDecorator(`capacity`, {
                            rules: [{required:true,message:'请填写标准人数'}],
                            initialValue: this.setInitialValue(courseInfo.capacity),
                        })(
                            <InputNumber disabled={withDelete} placeholder={'请输入'} precision={0} min={1} max={999999999}/>
                        )}
                    </FormItem>
                    <FormItem label='最大人数:' className='flex gym-teaching-schedule-add-room'>
                        {getFieldDecorator(`maxCapacity`, {
                            rules: [{required:true,message:'请填写最大人数'}],
                            initialValue:  this.setInitialValue(courseInfo.maxCapacity),

                        })(
                            <InputNumber placeholder={'请输入'} precision={0} min={1} max={999999999}/>
                        )}
                    </FormItem>
                </div>

            </div>
        </div>
    }
}

export {AddTeachingCourse}
