/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/5
 * Time: 下午2:35
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom'
import {getNoticeDetail, readNotice} from "@redux-actions/taskCenter";
import {User} from "@/common/beans/user";
import {ListModal} from "@/ui/component/listModal";
import {PageTitle} from "@/ui/component/pageTitle";
import {Form} from 'antd';
import {Table} from "@/ui/component/tablePagination";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import { TeachingRoutes } from '@/router/enum/teachingRoutes'

const FormItem = Form.Item;


// 定义表单的布局方式
const formItemLayout = {
    labelCol: {
        sm: 5
    },
    wrapperCol: {
        sm: 18
    }
};

@connect(() => ({}), {
    readNotice
})

class ShowSystemDetailButton extends React.Component<any, any>{
    state = {
        visible: false,
        info: {}
    };
    /**
     * 显示详情
     */
    handleShowSystem = () => {
        const {item} = this.props;
        const param = {
            currentCenterId: User.currentCenterId,
            mainId: item.mainId
        };
        getNoticeDetail(param).then((res) => {
            this.setState({
                info: res,
                visible: true
            }, () => {
                this.props.readNotice(item.mainId);
            })
        })
    };
    callBack =  () => {
        this.props.emitRead();
    }
    columns = (type:string) => {
        switch (type){
            case '192006':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render: (text:string, record:any) => <div onClick={()=>{
                            this.callBack()
                        }}>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        </div>
                    },{
                        title: '升班月龄',
                        dataIndex: 'nextGradeMonth',
                    },{
                        title: '升班课程',
                        dataIndex: 'nextGradeCourse',
                    },
                ];
            case '192001':
            case '192002':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render: (text:string, record:any) => <div onClick={()=>{
                            this.callBack()
                        }}>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        </div>
                    },{
                        title: '课程日期',
                        dataIndex: 'courseDate',
                        render: (text:number, record:any) => `${moment(text).format('YYYY-MM-DD')} ${record.courseTime}`
                    },{
                        title: '课程',
                        dataIndex: 'courseCode',
                    },
                ];
                case '192008':
                    return [
                        {
                            title: '宝宝姓名',
                            dataIndex: 'babyName',
                            render: (text:string, record:any) => <div onClick={()=>{
                                this.callBack()
                            }}>
                                <Link to={`${TeachingRoutes.选课情况列表.link}${CommonUtils.stringify({leadsId: record.leadsId,tab:'3'})} `} target='_blank'>{text}</Link>
                            </div>
                        },{
                            title: '请假时间',
                            dataIndex: 'courseDate',
                            render: (text:number, record:any) => `${moment(text).format('YYYY-MM-DD')} ${record.courseTime}-${record.courseEndTime}`
                        },{
                            title: '请假课程',
                            dataIndex: 'courseCode',
                        },
                    ]
                case '192012':
                    return [
                        {
                            title: '宝宝姓名',
                            dataIndex: 'babyName',
                            render: (text:string, record:any) => <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        },{
                            title: '约课时间',
                            dataIndex: 'courseDate',
                            render: (text:number, record:any) => `${moment(text).format('YYYY-MM-DD')} ${record.courseTime}-${record.courseEndTime}`
                        },{
                            title: '约课课程',
                            dataIndex: 'courseCode',
                        },
                    ]
            case '192005':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render: (text:string, record:any) => <div onClick={()=>{
                            this.callBack()
                        }}>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        </div>
                    },{
                        title: '课程日期',
                        dataIndex: 'courseDate',
                        render: (text:number, record:any) => `${moment(text).format('YYYY-MM-DD')} ${record.courseTime}`
                    },{
                        title: '课程',
                        dataIndex: 'courseCode',
                    },
                ];
            case '192017':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render: (text:string, record:any) => <div onClick={()=>{
                            this.callBack()
                        }}>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        </div>
                    },{
                        title: '月龄',
                        dataIndex: 'monthAge',
                    },{
                        title: '剩余课时',
                        dataIndex: 'remainingCourseNum',
                    },{
                        title: '已耗课时',
                        dataIndex: 'usedCourseNum',
                    },{
                        title: '上一次出席时间',
                        dataIndex: 'attendDate',
                    },{
                        title: '上一次出席',
                        dataIndex: 'attendName',
                    },{
                        title: '上一次联系时间',
                        dataIndex: 'lastTaskTime',
                        render: (text:number, record:any) => text ? `${moment(text).format('YYYY-MM-DD HH:mm')} `: '-'
                    },{
                        title: '上一次联系人',
                        dataIndex: 'lastExecutor',
                    },
                ];
            case '192011':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render: (text:string, record:any) => <div onClick={()=>{
                            this.callBack()
                        }}>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target='_blank'>{text}</Link>
                        </div>
                    },{
                        title: '原课程',
                        dataIndex: 'beforeCourseCode',
                    },{
                        title: '原课程时间',
                        dataIndex: 'beforeCourseDate',
                        render: (text:number, record:any) => text ? `${moment(text).format('YYYY-MM-DD')} ${record.beforeCourseTime}`: '-'
                    }, {
                        title: '换课后课程',
                        dataIndex: 'courseCode',
                    },{
                        title: '换课后课程时间',
                        dataIndex: 'courseDate',
                        render: (text:number, record:any) => text ? `${moment(text).format('YYYY-MM-DD')} ${record.courseTime}`: '-'

                    },
                ];
        }
    };
    formatTheme = (type:string) => {
        const options = new Map([
            ['192001', '首课提醒'],
            ['192002', '首课再次提醒'],
            ['192005', '旷课提醒'],
            ['192006', '升班提醒'],
            ['192008', '请假提醒'],
            ['192012', '排队约课成功提醒'],
            ['192017', '非活跃会员提醒'],
            ['192011', '换课提醒'],
            ['default', '-'],
        ]);
        return options.get(type) ? options.get(type) : options.get('default');
    };
    render(){
        const {visible, info}:any = this.state;
        return(
            <Fragment>
                <ListModal
                    visible={visible}
                    handleCancel={() => this.setState({visible:false},this.callBack)}
                    maskClosable={true}
                    footer={false}
                >
                    <PageTitle title='查看任务'/>
                    <Form className="gym-channel-form">
                        <FormItem label="发起人" {...formItemLayout} className="gym-input-wrap">
                            <span>{info.sponsor === "QIMENGAPP" ? '启蒙App' : info.sponsor}</span>
                        </FormItem>
                        <FormItem label="执行人" {...formItemLayout} className="gym-input-wrap">
                            <span>{info.recipient}</span>
                        </FormItem>
                        <FormItem label="服务对象" {...formItemLayout} className="gym-input-wrap">
                            <span>{ (info.noticeDetailInfo || []).map((item) => item.babyName).join('  ') }</span>
                        </FormItem>
                        <FormItem label="主题" {...formItemLayout} className="gym-input-wrap">
                            <span>{this.formatTheme(info.noticeTheme)}</span>
                        </FormItem>
                        <FormItem label="创建时间" {...formItemLayout} className="gym-input-wrap">
                            <span>{`${moment(info.noticeDate).format('YYYY-MM-DD')} ${info.noticeTime}`}</span>
                        </FormItem>
                        <FormItem label={this.formatTheme(info.noticeTheme)} {...formItemLayout} className="gym-input-wrap ">
                            <Table
                                columns={this.columns(info.noticeTheme)}
                                dataSource={info.noticeDetailInfo}
                                rowKey='leadsId'
                                style={{maxHeight: '200px', overflow: 'auto', margin: '10px 0'}}
                            />
                        </FormItem>
                    </Form>
                </ListModal>
                <button
                    className="gym-button-xxs gym-button-white"
                    onClick={this.handleShowSystem}
                >
                    查看
                </button>
            </Fragment>
        )
    }
}

export {ShowSystemDetailButton}
