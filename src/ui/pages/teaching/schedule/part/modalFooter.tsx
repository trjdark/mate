/**
*Desc: 弹框Modal 的footer
*User: Debby.Deng
*Date: 2018/12/19,
*Time: 下午5:21
*/
import * as React from "react";
import {Modal} from "../../../../component/customerCreateModal";
import {queryCourseScheduleAfterToday} from "@redux-actions/teaching/scheduleAction";
import {ScheduleModal} from "@/ui/pages/teaching/component/scheduleModal";
import {User} from "@/common/beans/user";
import moment from 'moment';

interface propSet {
    onOk:()=>(void),
    onDelete?:()=>(void),
    onCancel?:()=>(void),
    withDelete?:boolean,
    curseInfo?:any
}
class ModalFooter extends React.Component<propSet>{
    state={
        showModal:false,
        isShowModal: false,         // 是否有排课信息弹层
        scheduleDesc: ''
    };
    onDeleteConfirm=()=>{
        const {curseInfo} = this.props;
        if(curseInfo.id){
            const data = {
                id: curseInfo.id,
                currentCenterId: User.currentCenterId
            }
            queryCourseScheduleAfterToday(data)
                .then((res:any) => {
                    if(res.length > 0){
                        this.setState({
                            isShowModal: true,
                            scheduleDesc: res.map((item:any) => moment(item.date).format("YYYY-MM-DD")).join('，')
                        })
                    }else{
                        this.setState({showModal:true});
                    }
                })
        }else{
            this.setState({showModal:true});
        }

    };
    handleOk=()=>{
        this.setState({showModal:false});
        this.props.onDelete();
    };
    handleCancel=()=>{
        this.setState({showModal:false});
    };
    /**
     * 格式化title
     */
    formatTitle = () => {
        const {curseInfo = {}} = this.props;
        const options:Map<number,string> = new Map([
            [1,'星期一'],
            [2,'星期二'],
            [3,'星期三'],
            [4,'星期四'],
            [5,'星期五'],
            [6,'星期六'],
            [7,'星期日'],
        ]);
        return (
            <div>
                <span>{curseInfo.courseCode}</span>
                <span className="schedule-title-name">{curseInfo.classroomName}</span>
                <span>{options.get(curseInfo.weekDay)}</span>
                <span>{`${curseInfo.startTime}-${curseInfo.endTime}`}</span>
            </div>
        )
    }
    render(){
        const {withDelete}=this.props;
        const {scheduleDesc} = this.state;
        return (
            <p className='text-c'>
                <button className='gym-button-default-xs' onClick={this.props.onOk}>保存</button>
                {
                    withDelete?
                        <button className='gym-button-white-xs ml20'
                                onClick={this.onDeleteConfirm}>
                            删除
                        </button>
                        :
                        <button className='gym-button-white-xs ml20'
                                onClick={this.props.onCancel}>
                            取消
                        </button>
                }
                <Modal
                    visible={this.state.showModal}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentTitle={`确定要删除吗？`}
                />
                <ScheduleModal
                    visible={this.state.isShowModal}
                    handleOk={() => this.setState({isShowModal: false})}
                    handleCancel={() => this.setState({isShowModal: false})}
                    title={this.formatTitle()}
                    content={'该课程以下日期有会员选课，请将所有课程下的会员进行删课再删除此固定排课'}
                    desc={scheduleDesc}
                />
            </p>
        )
    }

}

export {ModalFooter}
