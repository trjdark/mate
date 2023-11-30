/**
 * desc: 消息提醒组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/5
 * Time: 下午6:50
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Menu, Modal, Badge} from 'antd';
import moment from 'moment';
import {Icon} from "@/ui/component/icon";
import {User} from "@/common/beans/user";
import {getNoticeDetail, readNotice} from "@redux-actions/taskCenter";
import {connect} from "@/common/decorator/connect";
import {selectNoReadNotice} from "@/saga/selectors/home";
import  {PageTitle} from "@/ui/component/pageTitle";
import {Table} from "@/ui/component/tablePagination";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";

@connect((state) => ({
    noReadNotice: selectNoReadNotice(state),
}), {readNotice})
class NoReadNotice extends React.Component<any, any>{
    state = {
        isMessageDropdown: false,
        visible:false,
        info: {}
    };
    options = new Map([
        ['192001', ['首课提醒', '明日预约首课的宝宝就要开课了，请提前做好上课准备']],
        ['192002', ['首课再次提醒', '今日预约首课的宝宝还有1个小时就要开课了，请提前做好上课准备。']],
        ['192005', ['旷课提醒', '今日旷课宝宝，请及时关注']],
        ['192006', ['升班提醒', '即将升班的宝宝，请提前与家长做好沟通和安排']],
        ['192008',['请假提醒','课程请假操作成功！']],
        ['192012',['排队约课成功提醒','课程排队约课成功提醒']],
        ['192017', ['非活跃会员提醒','连续28天未出席会员，请及时沟通。']],
        ['192011', ['换课提醒', '有宝宝操作了换课，请及时确认更新信息。']],
        ['default', ['', '']],
    ]);
    /**
     * 监听点击消息事件，
     */
    visibleMessageChang = (value: boolean) => {
        this.setState({isMessageDropdown: value})
    };
    /**
     * 查看详情
     * @param record
     */
    handleShowDetail = (record:any) => {
        const param = {
            mainId: record.mainId,
            currentCenterId: User.currentCenterId,
        };
        getNoticeDetail(param).then((res:any) => {
            this.setState({
                info: res,
                visible: true
            }, () => {this.props.readNotice(record.mainId)})
        })
    };
    /**
     * 消息
     */
    message = () => {
        const {noReadNotice} = this.props;
        // 判断消息提醒类别 内容拼接
        const noticeTheme = (item:any) => {
            if(this.options.get(item.noticeTheme)){
                if(item.noticeTheme === '192008' || item.noticeTheme === '192012') {
                    return ( <div>
                        <p>{item.lessonDate + ' '+ item.startTime + '-' + item.endTime + ' '+item.babyName + ' '+item.courseCode}</p>
                        <p>{this.options.get(item.noticeTheme)[1]}</p>
                    </div>)
                }else{
                    return this.options.get(item.noticeTheme)[1]
                }
            }else{
                return this.options.get('default')[1]
            }
        };
        return (
            <Menu className="gym-layout-operation-message">
                {
                    (noReadNotice || []).map((item:any) => (
                        <Menu.Item
                            key={item.mainId}
                            className='gym-layout-operation-message-item'
                            onClick={() => this.handleShowDetail(item)}
                        >
                            <div className='gym-layout-operation-message-item-title'>
                                <span>{this.options.get(item.noticeTheme) ? this.options.get(item.noticeTheme)[0] : this.options.get('default')[0]}</span>
                                <span>{moment(item.noticeDate).format('YYYY-MM-DD')} {item.noticeTime}</span>
                            </div>
                            <div className='gym-layout-operation-message-item-content'>
                                <p>{noticeTheme(item)}</p>
                            </div>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
    };
    /**
     * 表头配置
     * @param {string} type
     * @returns {any}
     */
    columns = (type:string) => {
        switch (type){
            case '192006':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
                    }
                ];
            case '192011':
                return [
                    {
                        title: '宝宝姓名',
                        dataIndex: 'babyName',
                        render:(text, record) =>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target="_blank">
                                <span className='cDefault' onClick={this.link}>{text}</span>
                            </Link>
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
    /**
     * 跳转
     * @param record
     */
    link = () => {
        this.setState({
            isMessageDropdown: false,
        })
    };
    /**
     * 消息提醒详情展示处理
     * @param info
     */
    describeDetaiil = (info?:any) => {
        if(info.noticeTheme){
            if(info.noticeTheme === '192008' || info.noticeTheme === "192012"){
                const weekNumEnum = {
                    1:'一',
                    2:'二',
                    3:"三",
                    4:'四',
                    5:'五',
                    6:"六",
                    0:"天",
                }
                let weekNum = new Date(info.noticeDate).getDay()
                const babyName = info.noticeDetailInfo.map(item => item.babyName)
                return `${moment(info.noticeDate).format('YYYY-MM-DD')}周(${weekNumEnum[weekNum] ? weekNumEnum[weekNum] : '' })${info.noticeTime} ${babyName.toString()} ${info.noticeDetailInfo[0].courseCode} ${this.options.get(info.noticeTheme)[1]}`
            }
           return this.options.get(info.noticeTheme)[1]
        }else{
           return this.options.get('default')[1]
        }
    }
    render(){
        const {isMessageDropdown, visible, info}:any = this.state;
        const {noReadNotice} = this.props;
        const noReadNoticeCount = noReadNotice.length;
        return(
            <Fragment>
                <Modal
                    visible={visible}
                    onCancel={() => this.setState({visible:false, isMessageDropdown:false})}
                    footer={false}
                    width={700}
                >
                    <PageTitle title={this.options.get(info.noticeTheme) ? this.options.get(info.noticeTheme)[0] : this.options.get('default')[0]}/>
                    <div className='mb25'>
                        <p>{ this.describeDetaiil(info) }</p>
                    </div>
                    <div>
                        <Table
                            columns={this.columns(info.noticeTheme)}
                            dataSource={info.noticeDetailInfo}
                            rowKey='leadsMapId'
                            style={{maxHeight: '200px', overflow: 'auto'}}
                        />
                    </div>
                </Modal>
                <Dropdown
                    overlay={this.message()}
                    trigger={['click']}
                    onVisibleChange={this.visibleMessageChang}
                    disabled={!noReadNoticeCount}
                >
                    <div className={`gym-layout-header-right-item pointer ${isMessageDropdown ? 'active' : ''}`}>
                        <Icon className='gym-layout-header-icon' type={`tixing`}/>
                        <Badge count={noReadNoticeCount} offset={[15,0]}>
                            <span>消息</span>
                        </Badge>
                    </div>
                </Dropdown>
            </Fragment>
        )
    }
}

export {NoReadNotice}

