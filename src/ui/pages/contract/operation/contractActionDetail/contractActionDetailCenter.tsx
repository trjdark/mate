/**
 * desc: 转中心合同操作
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import {PageTitle} from "../../../../component/pageTitle";
import {User} from "../../../../../common/beans/user";
import {BasicInfo} from "../part/basicInfo";
import moment from 'moment';
import {form} from "../../../../../common/decorator/form";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getChangeCenterDetail} from "@redux-actions/contract";
import {ChangeCenter} from "../part/changeCenter";
import {StepsInfo} from "../part/stepsInfo";



//form装饰器
@form()

class ContractActionDetailCenter extends React.Component<any, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '查看合同',
            path: '',
            link: '#',
            id: 'contractManagementPay'
        },{
            name: '转中心申请记录',
            path: '',
            link: '#',
            id: 'contractManagementRecord'
        }
    ];
    id:string;
    contractId:string;
    contractCode: string;
    status: string;
    constructor(props: any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.status = CommonUtils.parse(props).status;
        }
        this.state = {
            applyContent:{},      // 申请内容
            contractContent: {},  // 合同内容
            stepsInfo: [],
            current: 0

        }
    }

    componentDidMount() {
        this.getDetail();
    }

    /**
     * 获取信息
     */
    getDetail = () => {
        const param = {
            id:this.id,
            contractId: this.contractId,
            contractCode: this.contractCode,
            currentCenterId:User.currentCenterId,
        };

        getChangeCenterDetail(param)
            .then((res:any) => {
                const {contractDetail, changeCenterCourseDetail} = res;
                let resultArr:any[] = [
                    {title:'发起转出申请'},
                    {title:'转出审批'},
                    {title:'转入审批'},
                    {title:'转出付款'},
                    {title:'转入收款'}
                ], current = 0;
                if(changeCenterCourseDetail.applyTime && changeCenterCourseDetail.applyStaffName){
                    current = 0;
                    resultArr[0] = {...resultArr[0],
                        operateName: changeCenterCourseDetail.applyStaffName,
                        operateTime: moment(changeCenterCourseDetail.applyTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '发起转出申请'
                    };
                }
                if(changeCenterCourseDetail.rollOutApprovalTime && changeCenterCourseDetail.rollOutApprovalStaffName){
                    current = 1;
                    resultArr[1] = {...resultArr[1],
                        operateName:changeCenterCourseDetail.rollOutApprovalStaffName,
                        operateTime: moment(changeCenterCourseDetail.rollOutApprovalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: changeCenterCourseDetail.approvalStatus === '1205001' ? '转出审批未通过' :'转出审批通过'
                    };
                }
                if(changeCenterCourseDetail.rollInApprovalTime && changeCenterCourseDetail.rollInApprovalStaffName){
                    current = 2;
                    resultArr[2] = {...resultArr[2],
                        operateName:changeCenterCourseDetail.rollInApprovalStaffName,
                        operateTime: moment(changeCenterCourseDetail.rollInApprovalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: changeCenterCourseDetail.approvalStatus === '1205002' ? '转入审批未通过' :'转入审批通过'
                    };
                }
                if((changeCenterCourseDetail.rollOutFinTime && changeCenterCourseDetail.rollOutFinStaffName) ||
                    (changeCenterCourseDetail.withdrawTime  && changeCenterCourseDetail.withdrawStaffName)
                ){
                    current = 3;
                    resultArr[3] = {...resultArr[3],
                        operateName: changeCenterCourseDetail.approvalStatus === '1205004'
                            ? changeCenterCourseDetail.withdrawStaffName
                            : changeCenterCourseDetail.rollOutFinStaffName,
                        operateTime: changeCenterCourseDetail.approvalStatus === '1205004'
                            ? moment(changeCenterCourseDetail.withdrawTime).format('YYYY-MM-DD HH:mm:ss')
                            :moment(changeCenterCourseDetail.rollOutFinTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: changeCenterCourseDetail.approvalStatus === '1205004' ? '转出付款撤回' : '转出已付款'
                    };
                }
                if((changeCenterCourseDetail.rollInFinTime && changeCenterCourseDetail.rollInFinStaffName)){
                    current = 4;
                    resultArr[4] = {...resultArr[4],
                        operateName: changeCenterCourseDetail.rollInFinStaffName,
                        operateTime: moment(changeCenterCourseDetail.rollInFinTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '转入已收款'
                    };
                }
                this.setState({
                    applyContent: changeCenterCourseDetail,
                    contractContent:contractDetail,
                    transCenterApplyStatus: changeCenterCourseDetail.approvalStatus,
                    stepsInfo: resultArr,
                    current
                });
            })
    };

    render() {
        const { applyContent, contractContent, stepsInfo, current } = this.state;

        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <StepsInfo stepsInfo={stepsInfo} current={current}/>
                        <PageTitle title='申请信息'/>
                        <ChangeCenter
                            contractInfo={contractContent}
                            content={applyContent}
                            status={this.status}
                        />
                    </div>
                    <div className='page-wrap gym-contract-content'>
                        <BasicInfo contractInfo={contractContent}/>
                    </div>
                </div>
            </div>
        )
    }
}

export {ContractActionDetailCenter}
