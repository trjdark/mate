/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import {PageTitle} from "../../../../component/pageTitle";
import {User} from "../../../../../common/beans/user";
import {BasicInfo} from "../part/basicInfo";
import {form} from "../../../../../common/decorator/form";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getChangePkgApplyDetail} from "@redux-actions/contract";
import {ChangePkg} from "../part/changePkg";
import {StepsInfo} from "../part/stepsInfo";
import moment from 'moment';
@form()

class ContractActionDetailPkg extends React.Component<any, any> {
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
            name: '改包申请记录',
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
            course: {},
            isSelectElectronic: '', // 创建时是否选择电子活动
            contractType: '',      // 合同类型
            stepsList: [],
            current: 0,
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
        getChangePkgApplyDetail(param)
            .then((res:any) => {
                const {contractDetail, changePkgDetail} = res;
                let type = changePkgDetail.approvalStatus;
                let resultArr:any[] = [
                    {title:'发起申请'},
                    {title:'提交审批'},
                    {title:'流程结束'},
                ], current = 0;
                if(changePkgDetail.applyTime && changePkgDetail.applyStaffName){
                    current = 0;
                    resultArr[0] = {...resultArr[0],
                        operateName: changePkgDetail.applyStaffName,
                        operateTime: moment(changePkgDetail.applyTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: '发起改包申请'
                    };
                }
                if(changePkgDetail.approvalTime && changePkgDetail.approvalStaffName){
                    current = 1;
                    resultArr[1] = {...resultArr[1],
                        operateName:changePkgDetail.approvalStaffName,
                        operateTime: moment(changePkgDetail.approvalTime).format('YYYY-MM-DD HH:mm:ss'),
                        operateDesc: type === '23002' ? '改包审批未通过' :'改包审批通过'
                    };
                }
                if(type === '23003'){
                    current = 2;
                }
                this.setState({
                    applyContent: changePkgDetail,
                    contractContent:contractDetail,
                    course: res.course,
                    isSelectElectronic: contractDetail.electronicFlag,
                    contractType: contractDetail.contractType,
                    stepsList:resultArr,
                    current
                })
            })
    }

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
        const { applyContent, contractContent, course, isSelectElectronic,contractType, stepsList, current } = this.state;
        return (

            <div id='gym-contract-receive'>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <StepsInfo stepsInfo={stepsList} current={current}/>
                        <PageTitle title={`申请信息`}/>
                        <ChangePkg
                            content={applyContent}
                            courseInfo={course}
                            status={this.status}
                            contractInfo={contractContent}
                            isElectronic={isSelectElectronic}
                            contractType={contractType}
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

export {ContractActionDetailPkg}
