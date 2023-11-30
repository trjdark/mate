/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/3/25
 * Time: 下午3:37
 */
import React, {Component} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {User} from "@/common/beans/user";
import {Table} from "@/ui/component/tablePagination";
import {queryCallInContactList} from "@redux-actions/telephone/callbackPhone";
import { recordTelephoneMembers } from "@redux-actions/telephone/callLeads";
import moment from "moment";
import { Routes } from "@/router/enum/routes";
import {Socket} from "@/common/utils/socket";
import history from "@/router/history";

class CallbackPhone extends Component <any, any>{
    constructor(props:any){
        super(props);
        this.state = {
            dataList:{},
            infoType: "1",
            columns: [],
            dataSource: [],
            totalSize: 0,
            pageSize: 10,
            pageNo:1,
            isLogin: false,
            isCalling: false,
            callLeadsId: '',
        }
    }
    private tabsConfig = [
        {
            id:1,
            name: "未接",
            value: "1"
        },{
            id:2,
            name: "已接",
            value: "2"
        }
    ];
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'telephone'
        },{
            name: '呼入明细',
            path: '',
            link: '#',
            id: 'callback-phone'
        }
    ];
    columns = () => {
        const {isLogin, isCalling, callLeadsId} = this.state;
        const option = [
            {
                title: "电话号码",
                dataIndex: 'phone',
            },{
                title: "宝宝姓名",
                dataIndex: 'babyName',
            },{
                title: "归属地",
                dataIndex: 'phonePlace',
            },{
                title: "来电时间",
                dataIndex: 'callTime',
                render: (date:number) => moment(date).format("YYYY-MM-DD HH:mm:ss")
            },{
                title: "操作",
                dataIndex: 'action',
                render: (text:string, record:any) => {
                    if(isLogin){
                        if(!isCalling){
                            return <button className="gym-button-xxs gym-button-white" onClick={() => this.call(record)}>拨打</button>
                        }else{
                            if(record.id === callLeadsId){
                                return <span>通话中...</span>
                            }else{
                                return <button className="gym-button-xxs gym-button-grey">拨打</button>
                            }
                        }
                    }else{
                        return <button className="gym-button-xxs gym-button-grey">拨打</button>
                    }
                }
            },
        ];
        return option;
    }
    componentDidMount(){
        queryCallInContactList({
            currentCenterId: User.currentCenterId,
            fromType: "1"
        }).then((res:any) => {
            this.setState({
                noAnswerList: res.noAnswer,
                answeredList: res.answered,
                dataSource: res.noAnswer
            })
        })
        this.connect();
    }
    componentWillUnmount(){
        Socket.disconnect();
    }
    handleChangeTab = (type:string) => {
        this.setState({
            infoType: type,
            dataSource: type === "1" ? this.state.noAnswerList : this.state.answeredList
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
     * 拨号
     */
    call = (record:any) => {
        if(record.isToJump==="1"){
            recordTelephoneMembers([record.leadsId]);
            window.open(Routes.语音拨打.path, 'call');
        }else{
            const param = {
                currentCenterId: User.currentCenterId,
                callInId: record.id,
                fromType: '1',                    // 0 是TMK呼入，1是MATE呼入
            };
            this.setState({ isCalling: true, callLeadsId: record.id });
            Socket.send('/directCall', param);
        }


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
                this.setState({isCalling:true});
                break;
            // 呼叫失败
            case "2002":
                this.setState({isCalling:false});
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
                });
                break;
            // 接通
            case 3:
                console.log('接通');
                this.setState({
                    isCalling: true,
                    isTalking: true,
                    callLeadsId:callLeadsId,
                });
                break;
        }
    };

    render(){
        const {infoType, dataSource, totalSize} = this.state;
        return (
            <div id="gym-telephone-callback-phone" className="gym-telephone-callback-phone">
                <BreadCrumb routes={this.routes}/>
                <div className="gym-telephone-callback-phone-tabs">
                    {
                        this.tabsConfig.map((item:any, index:number) => (
                            <div
                                key={index}
                                className={`gym-telephone-callback-phone-tab ${item.value === infoType ? 'active': ''}`}
                                onClick={() => this.handleChangeTab(item.value)}
                            >
                                <span>{item.name}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="page-wrap gym-telephone-callback-phone-content">
                    <Table
                        dataSource={dataSource}
                        columns={this.columns()}
                        totalSize={totalSize}
                        rowKey={(item:any, index:number) => index}
                    />
                </div>
            </div>
        )
    }
}

export {CallbackPhone}
