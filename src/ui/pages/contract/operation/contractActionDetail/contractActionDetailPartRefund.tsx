/**
 * desc: 部分退费
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/17
 * Time: 10:47
 */

import React from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import {PageTitle} from "../../../../component/pageTitle";
import {User} from "../../../../../common/beans/user";
import {StepsInfo} from "../part/stepsInfo";
import {form} from "../../../../../common/decorator/form";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getPartRefundDetail} from "@redux-actions/contract";
import {PartRefund} from "@/ui/pages/contract/operation/part/partRefund";
import moment from 'moment';
import {connect} from "@/common/decorator/connect";
import {selectPartRefundDetailTypes} from "@/saga/selectors/contract";

@form()
@connect((state:any) => ({
    partRefundStatusList: selectPartRefundDetailTypes(state),
}))
class ContractActionDetailPartRefund extends React.Component<any, any> {
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
            name: '部分退费记录',
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
            currentCenterId:User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId
        };
        Promise.all([
            getPartRefundDetail(param),
        ]).then((res:any) => {
                const [partRefundCourseDetail, ] = res;
                let type = partRefundCourseDetail.partRefundStatus;
                let resultArr:any[] = [
                    {title:'发起申请'},
                    {title:'中心出纳审批'},
                    {title:'总部财务审批'},
                    {title:'中心出纳付款'},
                ], current = 0;
                if(partRefundCourseDetail.applyTime && partRefundCourseDetail.applyByName){
                    current = 0;
                    resultArr[0] = {...resultArr[0],
                        operateName: partRefundCourseDetail.applyByName,
                        operateTime: moment(res.applyTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '发起部分退费申请'
                    };
                }
                if(partRefundCourseDetail.centerApprovalTime && partRefundCourseDetail.centerApprovalByName){
                    current = 1;
                    resultArr[1] = {...resultArr[1],
                        operateName:partRefundCourseDetail.centerApprovalByName,
                        operateTime: moment(partRefundCourseDetail.centerApprovalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '1206001001' ? '部分退费中心审批未通过' :'部分退费中心审批通过'
                    };
                }
                if(partRefundCourseDetail.hqApprovalTime && partRefundCourseDetail.hqApprovalByName){
                    current = 2;
                    resultArr[2] = {...resultArr[2],
                        operateName:partRefundCourseDetail.hqApprovalByName,
                        operateTime: moment(partRefundCourseDetail.hqApprovalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '1206002001' ? '部分退费总部审批未通过' :'部分退费总部审批通过'
                    };
                }
                if(partRefundCourseDetail.paymentRefundTime && partRefundCourseDetail.paymentRefundByName){
                    current = 3;
                    resultArr[3] = {...resultArr[3],
                        operateName:partRefundCourseDetail.paymentRefundByName,
                        operateTime: moment(partRefundCourseDetail.paymentRefundTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '1206003001' ? '中心出纳付款通过' :'中心出纳付款退回'
                    };
                }
                this.setState({
                    applyContent: partRefundCourseDetail,
                    stepList: resultArr,
                    current
                })
            })
    }
    render() {
        const { applyContent, stepList, current } = this.state;
        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <StepsInfo stepsInfo={stepList} current={current}/>
                        <PageTitle title='申请信息'/>
                        <PartRefund
                            content={applyContent}
                            id={this.id}
                            contractId={this.contractId}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export {ContractActionDetailPartRefund}
