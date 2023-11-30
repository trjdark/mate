import React, {Fragment} from 'react';
import {Row, Col, Icon as AntdIcon, Modal, Popover} from 'antd';
import {PageTitle} from "../component/client360WrapperTitle";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CollapseWrapper} from "../component/collapse";
import {RecordsContent} from './part/recordsContent';
import {Steps} from "@/ui/pages/customer/component/steps";
import {BabyInfo360} from './part/bbInfo';
import {Tabs360Wrapper} from '../component/tabs360';
import {Link} from "react-router-dom";
import {ContactItem} from './part/contactItem';
import {leadsStatusModify} from '@redux-actions/client360';
import {User} from "@/common/beans/user";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {TeachingRoutes} from "@/router/enum/teachingRoutes";
import {CommonUtils} from '@/common/utils/commonUtils'
import history from '@/router/history';
import {Client360Context} from './context';
import {StatusModal} from './part/statusModal';
import {form} from "@/common/decorator/form";
import {leadsStatus, taskThemeCode, taskStatus} from '../enum/client360';
import {getClientInfo, getCustomerPackageDetail} from '@/redux-actions/teaching/chooseLesson';
import './style/index';
import {Routes} from "@/router/enum/routes";
import EditorTaskForm from '@/ui/component/editTaskForm/index';
import {EssentialInfo} from './part/essentialInfo';
import {Icon} from '@/ui/component/icon';
import {MemoCollapse} from './part/memoCollapse';
import {TaskCenterRoutes} from "@/router/enum/taskCenterRouter";
import {message} from "antd/es";
import {getLeadsInfo, isRecycle, queryLeadsCallRecords, queryLastLeadsInfo} from "@redux-actions/customer/customerAcquire";
import {getCodeInfoByType} from "@redux-actions/customerCreate";
import moment from 'moment';
import {downloadRecordsFile} from "@redux-actions/telephone/callRecords";

const Provider:any = Client360Context.Provider;
const Consumer = Client360Context.Consumer;
const Collapse = CollapseWrapper(
    PageTitle,
    {title: '跟进记录', hn: 'h4'},
    <Consumer>{({leadsId, basicInfo}) => (<RecordsContent leadsId={leadsId} basicInfo={basicInfo}/>)}</Consumer>
);
const Tabs360 = Tabs360Wrapper(BabyInfo360);

@form()

class Client360 extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            crumb: [
                {name: '客户', path: '', link: '#', id: 'customer'},
                {name: '客户360', path: '', link: '#', id: 'client360'}
            ],
            leadsId: CommonUtils.parse(props).leadsId,
            visible: false,
            currBabyInfo: null,         // 当前宝宝的信息
            hasContract: false,         // 是否有合同
            isChooseLesson: false,      // 是否可点击
            showCreateModel: false,     // 新建任务弹出
            cellphoneVisible: false,    // 手机号可见
            memoCollapseArr: [],        // 判断待办事项collapse是否折叠
            basicInfo: {},              // 宝宝信息
            leadsInfo: {},              // Leads信息
            packageDetail: '',          // 课包信息
            ChannelTypeList: [],        // 市场渠道列表
            handedRecycle: false,       // 是否手动回收站，默认不是
            callRecords: [],            // 通话记录
            lastLeadsInfo: {},          // 最新获取信息
        }
    }

    onCreateTask = (bool) => {
        this.setState({showCreateModel: bool})
    };

    onMoreTask = () => {
        // 1:待完成，2:已完成
        let param = {leadsId: this.state.leadsId, taskStatus: '65001'};
        history.push(`${TaskCenterRoutes.任务中心.link}/${CommonUtils.stringify(param)}`)
    };

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {};
                if (values.nextStatus === '放弃') {
                    params = {
                        currentCenterId: User.currentCenterId,
                        leadsId: this.state.leadsId,
                        leadsStatus: leadsStatus[values.nextStatus],
                        recycleType: values.recycleType,
                        recycleReason: values.recycleReason
                    }
                } else {
                    params = {
                        currentCenterId: User.currentCenterId,
                        leadsId: this.state.leadsId,
                        leadsStatus: leadsStatus[values.nextStatus],
                        priority: values.priority ? '68002' : '68001',
                        remindFrequencyTime: values.remindFrequencyTime,
                        taskDesc: values.taskDesc,
                        taskStatus: taskStatus[values.taskStatus],
                        taskThemeCode: taskThemeCode[values.taskThemeCode],
                        taskTime: values.taskTime
                    }
                }

                leadsStatusModify(params).then(_res => {
                    this.pageRefresh()
                })
            }
        })
    };

    pageRefresh = () => {
        const history = this.props.history;
        const path = history.location.pathname;
        history.replace('/customer');
        setTimeout(() => {
            history.replace(path);
        })
    };

    handleCancel = () => {
        this.setState({visible: false})
    };

    showModal = () => {
        const phaseValue = this.state.basicInfo.phaseValue;
        if (
            phaseValue === '已领取' || phaseValue === '已联络' ||
            phaseValue === '诺访' || phaseValue === '已到访'
        ) {
            this.setState({visible: true})
        }
    };

    setCurrentBabyInfo = (baby) => {
        this.setState({currBabyInfo: baby})
    };

    toggle = () => {
        this.setState({cellphoneVisible: !this.state.cellphoneVisible})
    };

    memoCollapseOnChange = (key) => {
        this.setState({memoCollapseArr: key})
    };

    /*处于某些阶段或者没有填写月龄时阻止试听或选课*/
    preventSelectCourse = (e) => {
        const phaseValue = this.state.basicInfo.phaseValue;
        const currBabyInfo = this.state.currBabyInfo;
        const monthValue = currBabyInfo ? currBabyInfo.monthValue : null;
        // 处于这三个阶段时不需要跳转
        if (phaseValue === '待分配' || phaseValue === '已分配' || phaseValue === '历史会员') {
            e.preventDefault();
        }
        // 没有填写月龄时提示用户填写
        if (monthValue === null || typeof monthValue === 'undefined') {
            message.error('请先设置宝宝的出生日期！');
            e.preventDefault();
        }
    };

    /*获取通话记录*/
    getLeadsCallRecord = () => {
        queryLeadsCallRecords({
            currentCenterId: User.currentCenterId,
            leadsId: this.state.leadsId,
            pageSize: 3
        }).then((res) => {
            // 前3条
            this.setState({
                callRecords: res.list
            })
        })
    };

    componentDidMount() {
        Promise.all([
            getClientInfo({
                currentCenterId: User.currentCenterId,
                leadsId:  this.state.leadsId
            }),
            getLeadsInfo({
                currentCenterId: User.currentCenterId,
                leadsId: this.state.leadsId,
            }),
            getCodeInfoByType({
                type: 'ChannelType',
                currentCenterId: User.currentCenterId
            }),
            getCustomerPackageDetail({
                currentCenterId: User.currentCenterId,
                leadsId:  this.state.leadsId
            }),
            isRecycle({
                currentCenterId: User.currentCenterId,
                leadsId: this.state.leadsId,
            }),
            queryLastLeadsInfo({
                currentCenterId: User.currentCenterId,
                leadsId:  this.state.leadsId
            })
        ]).then((res:any) => {
            const babyInfo = res[0].babyInfo;
            const chooseLesson = res[0].chooseLesson;
            // Todo 临时解决title被覆盖问题
            setTimeout(() => {document.title = babyInfo.babyInfos[0].babyName;}, 500);
            this.setState({
                hasContract: chooseLesson.list.length > 0,
                isChooseLesson: chooseLesson.flag === '1',       // 列表中是否有结清的合同，0表示没有，1表示有
                currBabyInfo: babyInfo.babyInfos[0],
                basicInfo: babyInfo,
                leadsInfo: res[1],
                ChannelTypeList: res[2],
                packageDetail: res[3].packageInfo,
                handedRecycle: res[4].handedRecycle,
                lastLeadsInfo: res[5]
            }, () => {
                if(this.isCall()){
                    this.getLeadsCallRecord()
                }
            })
        });
    }
    downloadRecords = (fileId:string) => {
        downloadRecordsFile({
            currentCenterId: User.currentCenterId,
            fileId: fileId,
        })
    };
    // 是否有拨打权限
    isCall = ():boolean => {
        const {leadsInfo} = this.state;
        // 如果拥有CD， HGB， HGA 角色可以拨打电话
        if(User.role.includes('CD') || User.role.includes('HGA') || User.role.includes('HGB')){
            return true;
        }
        // 如果是GB，GA，则是本人名下的
        if(User.role.includes('GB') || User.role.includes('GA')){
            if(leadsInfo.primaryGbStaffId === User.userId || leadsInfo.primaryGaStaffId === User.userId){
                return true;
            }
        }
        return false;
    };
    render() {
        const {
            cellphoneVisible, leadsId, memoCollapseArr, isChooseLesson, hasContract, packageDetail,
            showCreateModel, currBabyInfo, crumb, basicInfo, leadsInfo, ChannelTypeList, handedRecycle,
            callRecords, lastLeadsInfo
        } = this.state;
        let babyId = currBabyInfo?currBabyInfo.id:null
        const {phase, phaseValue, contactInfos = [], taskTodoInfos = []} = basicInfo;
        const status = (phaseValue === '已领取' || phaseValue === '已联络' || phaseValue === '诺访' || phaseValue === '已到访');
        const xuankeLink = `${TeachingRoutes.选择固定课表.link}${CommonUtils.stringify({
            leadsId,
            currBabyInfo,
            hasContract,
        })}`;
        const basicInfoLink = `${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify({leadsId})}`;
        const huoquLink = `${CustomerRoutes.客户获取.link}/${CommonUtils.stringify({leadsId})}`;
        const contractLink = `${CustomerRoutes.客户获取.link}/${CommonUtils.stringify({leadsId, id: '2'})}`;
        const growthLink = `${CustomerRoutes.客户成长.link}/${CommonUtils.stringify({leadsId, phase, babyId})}`;
        const qingjiaLink = `${Routes.选课情况列表.link}${CommonUtils.stringify({leadsId})}`;
        const hokaniInfoLink = `${CustomerRoutes.其他信息.link}${CommonUtils.stringify({leadsId})}`;
        const logLink = `${CustomerRoutes.渠道日志.link}${CommonUtils.stringify({leadsId})}`;
        return (
            <Fragment>
                <Modal
                    title="状态变更"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    okText="确认变更"
                    width="800px"
                    destroyOnClose={true}
                >
                    <StatusModal form={this.props.form} basicInfo={basicInfo}/>
                </Modal>

                {
                    showCreateModel ? (
                            <EditorTaskForm
                                switchEditModel={this.onCreateTask}
                                leadsId={leadsId}
                                taskId=''
                                phase={phase}
                                searchTaskList={() => {
                                }}
                                handleOk={this.pageRefresh}
                            />
                        )
                        : null
                }

                <BreadCrumb routes={crumb}/>
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={10}>
                                <div className="babyInfoWrapper">
                                    <Provider value={{showModal: this.showModal, status: status}}>
                                        <Tabs360
                                            setCurrentBabyInfo={this.setCurrentBabyInfo}
                                            basicInfo={basicInfo}
                                        />
                                    </Provider>
                                </div>
                            </Col>
                            <Col span={14}>
                                <EssentialInfo
                                    packageDetail={packageDetail}
                                    basicInfo={basicInfo}
                                    leadsInfo={leadsInfo}
                                    ChannelTypeList={ChannelTypeList}
                                    handedRecycle={handedRecycle}
                                    lastLeadsInfo={lastLeadsInfo}
                                />
                            </Col>
                        </Row>
                        <Row className="memoWrapper shadow">
                            <MemoCollapse
                                basicInfo={basicInfo}
                                pageRefresh={this.pageRefresh}
                                memoCollapseOnChange={this.memoCollapseOnChange}
                                leadsId={leadsId}
                            />
                            <div
                                className="new"
                                onClick={() => {
                                    this.onCreateTask(true)
                                }}
                            >
                                + 新建
                            </div>
                            {
                                taskTodoInfos.length > 9 && memoCollapseArr.length > 0 &&
                                <div className="more" onClick={this.onMoreTask}>更多>>></div>
                            }
                        </Row>
                        <Row>
                            <Col span={14}>
                                <div className="recordWrapper">
                                    <Provider value={{leadsId, basicInfo}}>
                                        <Collapse/>

                                    </Provider>
                                </div>
                            </Col>
                            <Col span={10}>
                                <div className="progressWrapper shadow">
                                    <PageTitle title={'里程碑'} hn={'h4'}/>
                                    <div className="stepsWrapper">
                                        <Steps steps={basicInfo.mileStoneInfos}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Row className="contactWrapper shadow">
                            <PageTitle title={'联系人'} hn={'h4'}/>
                            {this.state.cellphoneVisible ? (
                                <AntdIcon
                                    type="eye"
                                    theme="outlined"
                                    className="eyeSize"
                                    onClick={this.toggle}
                                />
                            ) : (
                                <Icon
                                    className="iconSize"
                                    type="biyan1"
                                    onClick={this.toggle}
                                />
                            )}
                            <div className={contactInfos.length > 4 ? 'scroll-contacts' : 'no-scroll-contacts'}>
                                {
                                    contactInfos.map((info, idx) => {
                                        return (
                                            <ContactItem
                                                logList={basicInfo.leadsChannelLogList}
                                                key={idx}
                                                info={info}
                                                visible={cellphoneVisible}
                                                leadsId={leadsId}
                                                isCall={this.isCall()}
                                                phaseValue={phaseValue}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </Row>
                        <Row className="selecClassWrapper shadow">
                            <PageTitle title={'快捷入口'} hn={'h4'}/>
                            <Row className="basicRow1" type="flex">
                                <Col className="textCenter" span={8}>
                                    <Link to={contractLink} className="link" target='_blank'>
                                        <Icon className="iconSize" type="qianyue"/>
                                        <p>{(phaseValue === '历史会员' || isChooseLesson) ? '续约' : '签约'}</p>
                                    </Link>
                                </Col>
                                <Col className="textCenter" span={8}>
                                    <Link to={qingjiaLink} className="link" target='_blank'>
                                        <Icon className="iconSize" type="qingjia"/>
                                        <p>上课情况</p>
                                    </Link>
                                </Col>
                                <Col className="textCenter" span={8}>
                                    {
                                        (!isChooseLesson && hasContract) ? (
                                            <Popover title="流程未完成收款，不能选课" placement="left">
                                                <div>
                                                    <div className={"disabled"}>
                                                        <i className="iconfont icon-rili iconSize"/>
                                                        <p>{(hasContract || phaseValue === '历史会员') ? '排课选课' : '试听'}</p>
                                                    </div>
                                                </div>

                                            </Popover>
                                        ) : (
                                            <Link
                                                to={xuankeLink}
                                                className={`link ${(phaseValue === '待分配' || phaseValue === '已分配' || phaseValue === '历史会员') ? 'disabled' : ''}`}
                                                target='_blank'
                                                onClick={this.preventSelectCourse}
                                            >
                                                <i className="iconfont icon-rili iconSize"/>
                                                <p>{(hasContract || phaseValue === '历史会员') ? '排课选课' : '试听'}</p>
                                            </Link>
                                        )
                                    }
                                </Col>
                            </Row>
                        </Row>
                        <Row className="basicInfosWrapper shadow">
                            <PageTitle title={'详细信息'} hn={'h4'}/>
                            <div className="content">
                                <Row className="basicRow1" type="flex">
                                    <Col className="textCenter" span={8}>
                                        <Link to={basicInfoLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="yonghuxinxi"/>
                                            <p>基本信息</p>
                                        </Link>
                                    </Col>
                                    <Col className="textCenter" span={8}>
                                        <Link to={huoquLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="yonghuxinxi1"/>
                                            <p>客户获取</p>
                                        </Link>
                                    </Col>
                                    <Col className="textCenter" span={8}>
                                        <Link to={qingjiaLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="jiaoxue"/>
                                            <p>上课情况</p>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row className="basicRow1" type="flex">
                                    <Col className="textCenter" span={8}>
                                        <Link to={growthLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="chengchang"/>
                                            <p>客户成长</p>
                                        </Link>
                                    </Col>
                                    <Col className="textCenter" span={8}>
                                        <Link to={hokaniInfoLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="qita"/>
                                            <p>其他信息</p>
                                        </Link>
                                    </Col>
                                    <Col className="textCenter" span={8}>
                                        <Link to={logLink} className="link" target='_blank'>
                                            <Icon className="iconSize" type="rizhi1"/>
                                            <p>渠道日志</p>
                                        </Link>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                        {
                            this.isCall() &&
                            <Row className="basicInfosWrapper shadow">
                                <PageTitle title={'通话记录'} hn={'h4'}/>
                                {
                                    callRecords.map((item:any) => (
                                        <div key={item.id} className="call-record-item">
                                            <span>{moment(item.createDate).format("YYYY-MM-DD HH:mm")}</span>
                                            {
                                                // 只有CD HGB HGA 有下载权限
                                                (item.recordingUrl && (User.role.includes('CD') || User.role.includes('HGA') || User.role.includes('HGB'))) &&
                                                <button className="gym-button-white gym-button-xxs" onClick={() => this.downloadRecords(item.recordingUrl)}>
                                                    下载
                                                </button>
                                            }
                                        </div>
                                    ))
                                }

                                <Link to={`${Routes.通话记录.link}${CommonUtils.stringify({leadsId: leadsId})}`} className="call-record-more">
                                    <span>更多</span>
                                </Link>
                            </Row>
                        }
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

export {Client360}
