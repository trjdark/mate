/**
 * desc: 云语音拨打页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/4
 * Time: 下午2:29
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from "react-router-dom";
import {Row, Col, message, Modal} from 'antd';
import {PageTitle} from "@/ui/component/pageTitle";
import {Scrollbars} from 'react-custom-scrollbars';
import {CommonUtils} from "@/common/utils/commonUtils";
import {CallStatusHeader} from "@/ui/pages/telephoneOnline/call/part/callStatusHeader";
import {MemberTable} from "@/ui/pages/telephoneOnline/call/part/memberTable";
import {ParentInfoCard} from "@/ui/pages/telephoneOnline/call/part/parentInfoCard";
import {BabyInfoCard} from "@/ui/pages/telephoneOnline/call/part/babyInfoCard";
import {ActionLeadsButton} from "@/ui/pages/telephoneOnline/call/part/actionLeadsButton";
import {FormCallRecord} from "@/ui/pages/telephoneOnline/call/part/formCallRecord";
import {RecordTable} from "@/ui/pages/telephoneOnline/call/part/recordTable";
import {
    getTelephoneMembers, getLeadsInfoByLeadsIdList, getCallRecords,
    updateContact, addContact, updateBabyInfo, saveCallTask,
    updateCallRecordRemark
} from "@redux-actions/telephone/callLeads";
import {getClientInfo} from '@/redux-actions/teaching/chooseLesson';
import {getBabyInfo} from "@redux-actions/teaching/chooseLesson";
import {User} from "@/common/beans/user";
import {Socket} from "@/common/utils/socket";
import history from "@/router/history";
import {Routes} from "@/router/enum/routes";
import { RecordsContent } from '../../customer/client360/part/recordsContent';
import { Client360Context } from '../../customer/client360/context';

const Provider: any = Client360Context.Provider;
const Consumer = Client360Context.Consumer;

class Call extends React.Component<any, any>{
    private pageTitle:any;
    private formScrollBar:any;
    formRecord:any = React.createRef();
    constructor(props:any){
        super(props)
        this.state = {
            memberList:[],
            memberTableScrollH: 0,
            formScrollH:0,
            babyInfoList:[],        // leads中宝宝信息列表
            babyInfo:{},            // 宝宝信息
            contactInfo:[],         // 联系人信息
            leadsInfo:{},           // leads信息
            customerId:'',          // 客户ID
            leadsId:'',             // leadsId
            selectLeads: {},        // 选中的leads
            recordDataSource: [],   // 通话记录
            memberIndex: 0,         // 客户列表索引
            isLogin: false,         // 是否登录
            isCalling: false,       // 是否拨打
            isTalking: false,       // 是否通话
            callLeadsId:'',         // 拨通的leadsId
            callId: '',             // 通话记录Id
            isChangeMember: true,   // 能否切换客户
            isCallIn: false,        // 是否有电话呼入
            callInInfo: {},         // 呼入信息
        }
    }
    componentDidMount(){
        const leadsIdList = getTelephoneMembers();
        console.log(leadsIdList)
        getLeadsInfoByLeadsIdList({
            leadsIdList:leadsIdList,
            currentCenterId: User.currentCenterId
        }).then((res:any) => {
            const defaultLead = res[0];
            console.log(res)
            if(defaultLead){
                this.queryLeadsBasicInfo(defaultLead);
                getClientInfo({
                    currentCenterId: User.currentCenterId,
                    leadsId: defaultLead.leadsId,
                }).then((r: any) => {
                    const chooseLesson = r.chooseLesson;
                    const babyInfo = r.babyInfo;
                    // Todo 临时解决title被覆盖问题
                    setTimeout(
                        () => {
                            document.title = babyInfo.babyInfos[0].babyName;
                        },
                        500
                    );
                    this.setState({
                        hasContract: chooseLesson.list.length > 0,
                        isChooseLesson: chooseLesson.flag === '1',       // 列表中是否有结清的合同，0表示没有，1表示有
                        currBabyInfo: babyInfo.babyInfos[0],
                        basicInfo: babyInfo
                    })
                })
            }
            this.setState({memberList: res})
        });


        this.connect();
        this.onResize();
        window.addEventListener('resize',this.onResize);

    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize);
        Socket.disconnect();
    }
    /**
     * 获取leads基本信息
     */
    queryLeadsBasicInfo = (leads:any) => {
        const param = {
            currentCenterId: leads.cid,
            leadsId: leads.leadsId
        };
        Promise.all([
            getBabyInfo(param),
            getCallRecords(param)
        ]).then((res:any) => {
            this.setState({
                selectLeads: leads,
                babyInfoList:res[0].babyInfos,
                babyInfo:res[0].babyInfos[0],
                contactInfo: res[0].contactInfos,
                leadsInfo: res[0].leadsInfo,
                customerId: res[0].customerId,
                leadsId: res[0].leadsId,
                phaseValue: res[0].phaseValue,
                recordDataSource: res[1],
                basicInfo: res[0]
            })
        });
    };
    /**
     * 计算高度
     */
    onResize = () => {
        const pageTitleNode:any = ReactDOM.findDOMNode(this.pageTitle);
        const headerHeight = CommonUtils.getElementTop(pageTitleNode) + 50;
        this.setState({
            memberTableScrollH: window.innerHeight - headerHeight,
            formScrollH: window.innerHeight - headerHeight - 70,
        })
    };
    /**
     * 拨打
     * @param record
     */
    handleDial = (record:any) => {
        const param = {
            currentCenterId: record.cid,
            callLeads: [record.leadsId],
            contactId: record.contactId,
            fromType: '1',                    // 0 是TMK呼入，1是MATE呼入
        };
        this.setState({isCalling: true});
        Socket.send('/call',param);
    };
    /**
     * 切换客户，选择leads
     */
    selectMember = (index:number) => {
        const {memberList} = this.state;
        this.formScrollBar.scrollTop(0);
        const selectLeads = memberList.filter((item:any, i:number) => i === index)[0];
        this.formRecord.clearForm();
        this.setState({
            memberIndex: index,
            selectLeads:selectLeads,
            isChangeMember:true,
            callId:'',
        }, () => this.queryLeadsBasicInfo(selectLeads))
    };
    /**
     * 操作宝宝
     * @param param
     */
    handleActionBaby = (babyId:string) => {
        const {babyInfoList} = this.state;
        const selectBaby = babyInfoList.filter((item:any) => item.id === babyId)[0];
        this.setState({babyInfo: selectBaby});
    };
    /**
     * 操作联系人
     * @param param
     */
    handleActionContact = (param:any, type:'edit'|'add') => {
        const {selectLeads} = this.state;
        if(type === 'edit'){
            updateContact(param).then((res:any) => {
                message.success('更新成功');
                this.queryLeadsBasicInfo(selectLeads);
            })
        }else{
            addContact(param).then((res:any) => {
                message.success('添加成功');
                this.queryLeadsBasicInfo(selectLeads);
            })
        }
    };
    /**
     * 修改宝宝信息
     * @param param
     */
    handleEditBabyInfo = (param:any) => {
        const {selectLeads} = this.state;
        updateBabyInfo(param).then((res:any) => {
            message.success('更新成功');
            this.queryLeadsBasicInfo(selectLeads);
        })
    };
    /**
     * 保存通话记录
     */
    handleSaveRecord = (param:any) => {
        const {selectLeads} = this.state;
        saveCallTask(param).then(() => {
            message.success('保存成功！');
            this.setState({isChangeMember: true});
            this.queryRecords();
            this.queryLeadsBasicInfo(selectLeads);
        })
    };
    /**
     * 获取通话记录
     */
    queryRecords = () => {
        const {selectLeads} = this.state;
        getCallRecords({
            currentCenterId: selectLeads.cid,
            leadsId: selectLeads.leadsId
        }).then((res:Array<any>) => {
            this.setState({recordDataSource: res})
        })
    };
    /**
     * 更新通话记录
     */
    handleUpdateRemark = (param:any) => {
        updateCallRecordRemark(param).then(() => {
            message.success('更新成功！');
            this.queryRecords();
        })
    };
    /**
     * 连接scoket
     */
    connect = () => {
        const options = {
            subscribe: '/queue/message/',
            callback: this.socketReceivesMessage
        };
        Socket.init(options);
    };
    /**
     * 订阅接受
     * @param data
     */
    socketReceivesMessage = (data:any) => {
        const response = JSON.parse(data.body);
        const type = response.type;
        const newData = response.data;

        switch (type) {
            case 1:
                // 初始化
                this.initStatus(newData);
                break;
            case 2:
                // 接收消息
                this.messageAlert(newData);
                break;
            case 3:
                // 登陆失效
                history.push(process.env.LOGIN_URL);
                break;
            case 4:
                // 拨打电话
                this.callSuccess(newData);
                break;
            case 5:
                // 呼入通知
                this.callIn(newData)
                break;
        }
    };
    /**
     * 获取云语音初始化
     * @param data
     */
    initStatus = (data:any) => {
        if(data.workStatus === 1002){
            this.setState({isLogin: true})
        }else{
            this.setState({isLogin: false})
        }
    };
    /**
     * 接受消息
     * @param data
     */
    messageAlert = (data:any) => {
        switch (data.messageCode){
            // 呼叫成功
            case "2001":
                this.setState({isCalling:true})
                break;
            // 呼叫失败
            case "2002":
                this.setState({isCalling:false});
                message.error(data.message)
                break;
        }
    };
    /**
     * 处理成功拨打信息
     * @param data
     */
    callSuccess = (data:any) => {
        const callLeadsId = data.callLeads;
        const status = data.callStatus;
        switch (status){
            // 未接通，通话挂断
            case -1:
                console.log('通话挂断');
                this.setState({
                    callLeadsId:'',
                    isCalling: false,
                    isTalking: false,
                });
                break;
            // 振铃
            case 2:
                console.log('振铃');
                this.setState({
                    isCalling: true,
                    isTalking: false,
                    callLeadsId:callLeadsId,
                    callId: data.callId,
                    isChangeMember: false,
                });
                break;
            // 接通
            case 3:
                console.log('接通');
                this.setState({
                    isCalling: true,
                    isTalking: true,
                    callLeadsId:callLeadsId,
                    callId: data.callId,
                    isChangeMember: false
                });
                break;
        }
    };
    /**
     * 呼入回拨消息通知
     * @param data
     */
    callIn = (data:any) => {
        console.log('呼入');
        this.setState({
            isCallIn: true,
            callInInfo: data
        })

    };
    render(){
        const {
            memberTableScrollH, memberList, formScrollH, recordDataSource,
            isLogin, isCalling, isTalking, memberIndex, callId, callLeadsId,
            isChangeMember, contactInfo, customerId, leadsId, selectLeads,
            babyInfoList, babyInfo, leadsInfo, isCallIn, callInInfo,phaseValue,
            basicInfo
        } = this.state;
        const memberCount = memberList.length;
        return(
            <div id="gym-call" className="gym-call">
                <Row>
                    <Col span={8}>
                        <div className="gym-call-head-box mb15">
                            <CallStatusHeader
                                isCalling={isCalling}
                                isLogin={isLogin}
                                isTalking={isTalking}
                            />
                        </div>
                        <div className="gym-call-page-wrap mb0" >
                            <PageTitle title={<div className="gym-call-member-title">
                                <div>客户列表（{memberCount}条）</div>
                                <Link to={Routes.客户回拨统计.path}>
                                    <button className="gym-button-lg gym-button-default">客户回拨来电</button>
                                </Link>
                            </div>} ref={(ref:any) => this.pageTitle = ref}/>
                            <Scrollbars
                                autoHide={true}
                                universal={true}
                                autoHeightMin={memberTableScrollH}
                                autoHeightMax={memberTableScrollH}
                                autoHeight={true}
                            >
                                <MemberTable
                                    memberList={memberList}
                                    memberIndex={memberIndex}
                                    callId={callId}
                                    isLogin={isLogin}
                                    isCalling={isCalling}
                                    callLeadsId={callLeadsId}
                                    isChangeMember={isChangeMember}
                                    emitDial={this.handleDial}
                                    emitSelectMember={this.selectMember}
                                />
                            </Scrollbars>
                        </div>
                    </Col>
                    <Col span={16}>
                        <Row>
                            <Col span={12}>
                                <div className="gym-call-right-baby gym-position">
                                    <BabyInfoCard
                                        babyInfoList={babyInfoList}
                                        leadsInfo={leadsInfo}
                                        emitChangeBaby={this.handleActionBaby}
                                        phaseValue={phaseValue}
                                    />
                                    <ActionLeadsButton
                                        babyInfo={babyInfo}
                                        leadsInfo={leadsInfo}
                                        customerId={customerId}
                                        leadsId={leadsId}
                                        emitSubmitEditBabyInfo={this.handleEditBabyInfo}
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="gym-call-right-parent">
                                    <ParentInfoCard
                                        contactInfo={contactInfo}
                                        customerId={customerId}
                                        isLogin={isLogin}
                                        isCalling={isCalling}
                                        leadsId={leadsId}
                                        cid={selectLeads.cid}
                                        emitSumbit={this.handleActionContact}
                                        emitDial={this.handleDial}
                                    />

                                </div>
                            </Col>
                        </Row>
                        <div className='gym-call-right-form'>
                            <Scrollbars
                                autoHide={true}
                                universal={true}
                                // Todo 高度不能写死
                                autoHeightMin={formScrollH}
                                autoHeightMax={formScrollH}
                                autoHeight={true}
                                ref={(ref) => this.formScrollBar = ref}
                            >
                                <div className="gym-call-page-wrap mb15">
                                    <FormCallRecord
                                        wrappedComponentRef={(inst) => this.formRecord = inst}
                                        callId={callId}
                                        leadsId={leadsId}
                                        emitSubmit={this.handleSaveRecord}
                                    />
                                </div>
                                <div className="gym-call-page-wrap mb15">
                                    <div className="recordWrapper">
                                        <Provider value={{ leadsId, basicInfo }}>
                                            <PageTitle title={`跟进记录`} />
                                            <Consumer>{({ leadsId, basicInfo }) => (<RecordsContent leadsId={leadsId} basicInfo={basicInfo} />)}</Consumer>
                                        </Provider>
                                    </div>
                                </div>
                                <div className="gym-call-page-wrap">
                                    <PageTitle title={`通话记录（${recordDataSource.length}条）`}/>
                                    <RecordTable
                                        recordDataSource={recordDataSource}
                                        emitSubmit={this.handleUpdateRemark}
                                    />
                                </div>
                            </Scrollbars>
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={isCallIn}
                    footer={false}
                    onCancel={() => this.setState({isCallIn:false, callInfo: {}})}
                >
                    <div className="text-c mb25 size20">
                        <span className="cDefault">{callInInfo.callPhone}</span>
                        <span>未接来电提醒</span>
                    </div>
                    <div className="text-c">
                        <button
                            className="gym-button-default gym-button-lg"
                            onClick={() => this.setState({isCallIn:false, callInfo: {}})}
                        >
                            知道了
                        </button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export {Call}
