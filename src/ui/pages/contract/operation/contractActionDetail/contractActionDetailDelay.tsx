/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import {PageTitle} from "../../../../component/pageTitle"
import {User} from "../../../../../common/beans/user";
import {BasicInfo} from "../part/basicInfo";
import {StepsInfo} from "../part/stepsInfo";
import {form} from "../../../../../common/decorator/form";
import {getDelayApplyDetail} from "@redux-actions/contract";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {DelayContent} from "../part/delayContent";
import moment from 'moment';

//form装饰器
@form()

class ContractActionDetailDelay extends React.Component<any, any> {
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
            name: '延期申请记录',
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
            approvalStatus: 'approval', //view 查看 edit 编辑 outApproval转出审批 inApproval转入审批

            applyContent:{},      // 申请内容
            contractContent: {},  // 合同内容
            stepList: [],
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
        getDelayApplyDetail(param)
            .then((res:any) => {
                const {contractDetail, delayDetail} = res;
                let type = delayDetail.approvalStatus;
                let resultArr:any[] = [
                    {title:'发起申请'},
                    {title:'提交审批'},
                    {title:'流程结束'},
                ], current = 0;
                if(delayDetail.createDate && delayDetail.createByName){
                    current = 0;
                    resultArr[0] = {...resultArr[0],
                        operateName: delayDetail.createByName,
                        operateTime: moment(delayDetail.createDate).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '发起延期申请'
                    };
                }
                if(delayDetail.approvalTime && delayDetail.approvalStaffName){
                    current = 1;
                    resultArr[1] = {...resultArr[1],
                        operateName:delayDetail.approvalStaffName,
                        operateTime: moment(delayDetail.approvalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '21002' ? '延期审批未通过' :'延期审批通过'
                    };
                }
                if(type === '21003'){
                    current = 2;
                }

                this.setState({
                    applyContent: delayDetail,
                    contractContent:contractDetail,
                    stepList: resultArr,
                    current,
                })
            })
    };

    handleChange = ({file, fileList}) => {
        this.setState({fileList});
    };

    /**
     * 同意转出审批
     */
    approval = (e:any,type:string) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                //转中心同意或者取消
                if(type === 'approval'){
                    //同意
                    this.props.onApproval(values);
                }else {
                    //不同意
                    this.props.onApproval(values);
                }

            }
        });
    };

    render() {
        const { contractContent, applyContent, stepList, current } = this.state;

        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <StepsInfo stepsInfo={stepList} current={current} />
                        <PageTitle title={`申请信息`}/>
                        <DelayContent content={applyContent} status={this.status}/>
                    </div>
                    <div className='page-wrap gym-contract-content'>
                        <BasicInfo contractInfo={contractContent}/>
                    </div>
                </div>
            </div>
        )
    }
}

export {ContractActionDetailDelay}
