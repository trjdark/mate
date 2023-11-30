/**
 * desc: 审批合同
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/15
 * Time: 下午3:42
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb/index";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import history from "../../../../router/history";
import {Routes} from "@/router/enum/routes";
import {User} from "../../../../common/beans/user";
import {approveContract, getContractDetail} from "@redux-actions/contract";
import {BasicContractInfo} from "./part/basicContractInfo";
import {ConfirmCheck} from "../../../component/confirmCheck";
import {message} from "antd";
import {Message} from "@/ui/component/message/message";

class Approval extends React.Component<any, any>{
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
            name: '审批合同',
            path: '',
            link: '#',
            id: 'approval'
        }
    ];
    contractCode:string;
    contractId:string;
    constructor(props: any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.contractId = CommonUtils.parse(props).contractId;
        }else{
            history.push(Routes.合同管理列表.path)
        }
        this.state = {
            contractInfo: {}
        }
    }
    componentDidMount(){
        getContractDetail({currentCenterId: User.currentCenterId, contractCode: this.contractCode, contractId: this.contractId})
            .then((res:any) => {
                this.setState({contractInfo: res})
            })
    }
    // 审批合同
    approvalContract = (value:string) => {
        const {contractInfo} = this.state;
        const data = {
            contractId: contractInfo.contractId,
            currentCenterId: User.currentCenterId,
            approvalOperateType: value
        }
        approveContract(data)
            .then((res:any) => {
                message.success("审批成功")
                history.push(Routes.合同管理列表.path)
            }, (err) => {
                Message.error(err.msg)
            })
    }
    render(){
        const {contractInfo} = this.state;
        return (
            <div id='gym-contract-approval'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap'>
                    <BasicContractInfo
                        contractInfo={contractInfo}
                    />
                    <div className='gym-contract-approval-buttons'>
                        <ConfirmCheck
                            contentText={"确认同意此合同？"}
                            item={{}}
                            ensure={() => this.approvalContract('1')}
                            button={<button className='gym-button-default gym-button-xs'>同意</button>}
                        />
                        <ConfirmCheck
                            contentText="确认不同意此合同？"
                            item={{}}
                            ensure={() => this.approvalContract('0')}
                            button={<button className='gym-button-white gym-button-xs'>不同意</button>}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export {Approval}
