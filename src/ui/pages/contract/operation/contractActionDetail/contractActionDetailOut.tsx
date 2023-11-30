/**
 * desc: 合同操作退课
 * User: colin.lu
 * Date: 2018/11/12
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import {PageTitle} from "../../../../component/pageTitle";
import {User} from "../../../../../common/beans/user";
import {BasicInfo} from "../part/basicInfo";
import {StepsInfo} from "../part/stepsInfo";
import {form} from "../../../../../common/decorator/form";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getOutApplyDetail} from "@redux-actions/contract";
import {OutContent} from "../part/outContent";
import moment from 'moment';

@form()

class ContractActionDetailOut extends React.Component<any, any> {
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
            name: '退课申请记录',
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
            //上传文件列表
            fileList: [],
            approvalStatus: 'view', //view 查看 edit 编辑 outApproval转出审批 inApproval转入审批

            applyContent:{},      // 申请内容
            contractContent: {},  // 合同内容
            isSelectElectronic: '', // 创建时是否电子合同
            contractType: '',      // 合同类型
            stepList: [],          // 流程内容
            current: 0,            // 流程节点
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
        getOutApplyDetail(param)
            .then((res:any) => {
                const {contractDetail, outCourseDetail} = res;
                let type = outCourseDetail.approvalStatus;
                let resultArr:any[] = [
                    {title:'发起申请'},
                    {title:'提交审批'},
                    {title:'流程结束'},
                ], current = 0;
                if(outCourseDetail.applyTime && outCourseDetail.applyStaffName){
                    current = 0;
                    resultArr[0] = {...resultArr[0],
                        operateName: outCourseDetail.applyStaffName,
                        operateTime: moment(outCourseDetail.applyTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '发起退课申请'
                    };
                }
                if(outCourseDetail.approvalTime && outCourseDetail.approvalStaffName){
                    current = 1;
                    resultArr[1] = {...resultArr[1],
                        operateName:outCourseDetail.approvalStaffName,
                        operateTime: moment(outCourseDetail.approvalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '24002' ? '退课审批未通过' :'退课审批通过'
                    };
                }
                if(type === '24003'){
                    current = 2;
                }
                this.setState({
                    applyContent: outCourseDetail,
                    contractContent:contractDetail,
                    isSelectElectronic: contractDetail.electronicFlag,
                    contractType: contractDetail.contractType,
                    stepList: resultArr,
                    current
                })
            })
    }
    render() {
        const { applyContent, contractContent, isSelectElectronic, contractType, stepList, current } = this.state;
        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <StepsInfo stepsInfo={stepList} current={current}/>
                        <PageTitle title='申请信息'/>
                        <OutContent content={applyContent} status={this.status} isElectronic={isSelectElectronic} contractType={contractType}/>
                    </div>
                    <div className='page-wrap gym-contract-content'>
                        <BasicInfo contractInfo={contractContent}/>
                    </div>
                </div>
            </div>
        )
    }
}

export {ContractActionDetailOut}
