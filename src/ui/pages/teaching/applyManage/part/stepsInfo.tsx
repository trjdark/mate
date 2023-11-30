/**
 * desc: 三步审批步骤
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {Steps, Popover} from "antd";
import {Icon} from "../../../../component/icon";
import {form} from "../../../../../common/decorator/form";
import moment from 'moment';

declare interface StepInfoProps {
    stepInfo: any
}

const Step = Steps.Step;

let customDotWaiting = (dot, { status, index}) => (
    <span>
        {
            index == 0 &&
            <span>
                {dot}
            </span>
        }
        {
            index == 1 &&
            <span className='gym-contract-waitingIcon'>
                <Icon type="daishenhe"/>
            </span>
        }
        {
            index == 2 &&
            <span>
                {dot}
            </span>
        }
    </span>
);

let customDotSuccess = (dot, { status, index, description }) => (
    <span>
        {
            index == 0 &&
            <span>
                {dot}
            </span>
        }
        {
            index == 1 &&
            <Popover content={description}>
                <span className='gym-contract-successIcon'>
                    <Icon type="yitongguo"/>
                </span>
            </Popover>
        }
        {
            index == 2 &&
            <span className='gym-contract-successIcon'>
                <Icon type="yitongguo"/>
            </span>
        }
    </span>
);

let customDotFail = (dot, { status, index }) => (
    <span>
        {
            index == 0 &&
            <span>
                {dot}
            </span>
        }
        {
            index == 1 &&
            <Popover content='未通过'>
                <span className='gym-contract-failIcon'>
                    <Icon type="weitongguo"/>
                </span>
            </Popover>
        }
        {
            index == 2 &&
            <span>
                {dot}
            </span>
        }
    </span>
);

//form装饰器
@form()

class StepsInfo extends React.Component<StepInfoProps, any> {
    constructor(props: any) {
        super(props);
        this.setStep();
        this.state = {
            stepBarInfo:{
                current: null,
                stepBarDetail:[
                    {
                        stepTitle: '',
                        stepUser: '',
                        stepTime: '',
                        stepReason: null,
                        stepStatus: null
                    },
                    {
                        stepTitle: '',
                        stepUser: '',
                        stepTime: '',
                        stepReason: null,
                        stepStatus: null
                    },
                    {
                        stepTitle: '',
                        stepUser: '',
                        stepTime: '',
                        stepReason: null,
                        stepStatus: null
                    }
                ]
            },
            //sstep的状态样式
            setStep: ()=>{}
        }
    }


    componentDidUpdate() {
        if(this.props.stepInfo.previewApplyInfo){
            this.setStep()
        }
    }

    setStep = () =>{
        const {stepInfo} = this.props;
        if(this.state && this.state.stepBarInfo.current == null){
            if(stepInfo.previewApplyInfo.status == 44001){
                this.setState({
                    stepBarInfo:{
                        current: 1,
                        stepBarDetail:[
                            {
                                stepTitle: '创建申请',
                                stepUser: this.props.stepInfo.operateRecord.createUserName,
                                stepTime: moment(this.props.stepInfo.operateRecord.createDate).format('YYYY-MM-DD HH:mm:ss'),
                                stepReason: null,
                                stepStatus: null
                            },
                            {
                                stepTitle: '提交审批',
                                stepUser: '',
                                stepTime: '',
                                stepReason: '',
                                stepStatus: null
                            },
                            {
                                stepTitle: '完成',
                                stepUser: '',
                                stepTime: '',
                                stepReason: '',
                                stepStatus: null
                            }
                        ]
                    },
                    setStep:customDotWaiting
                });
            }else if(stepInfo.previewApplyInfo.status == 44003){
                this.setState({
                    stepBarInfo:{
                        current: 2,
                        stepBarDetail:[
                            {
                                stepTitle: '创建申请',
                                stepUser: this.props.stepInfo.operateRecord.createUserName,
                                stepTime:  moment(this.props.stepInfo.operateRecord.createDate).format('YYYY-MM-DD HH:mm:ss'),
                                stepReason: null,
                                stepStatus: null
                            },
                            {
                                stepTitle: '提交审批',
                                stepUser: this.props.stepInfo.operateRecord.approvalStaffName,
                                stepTime:  moment(this.props.stepInfo.operateRecord.approvalTime).format('YYYY-MM-DD HH:mm:ss'),
                                stepReason: '',
                                stepStatus: null
                            },
                            {
                                stepTitle: '完成',
                                stepUser: '',
                                stepTime: '',
                                stepReason: '',
                                stepStatus: null
                            }
                        ]
                    },
                    setStep:customDotSuccess
                });
            }else if(stepInfo.previewApplyInfo.status == 44002){
                this.setState({
                    stepBarInfo:{
                        current: 1,
                        stepBarDetail:[
                            {
                                stepTitle: '创建申请',
                                stepUser: this.props.stepInfo.operateRecord.createUserName,
                                stepTime:  moment(this.props.stepInfo.operateRecord.createDate).format('YYYY-MM-DD HH:mm:ss'),
                                stepReason: null,
                                stepStatus: null
                            },
                            {
                                stepTitle: '提交审批',
                                stepUser: this.props.stepInfo.operateRecord.approvalStaffName,
                                stepTime:  moment(this.props.stepInfo.operateRecord.approvalTime).format('YYYY-MM-DD HH:mm:ss'),
                                stepReason: '',
                                stepStatus: null
                            },
                            {
                                stepTitle: '完成',
                                stepUser: '',
                                stepTime: '',
                                stepReason: '',
                                stepStatus: null
                            }
                        ]
                    },
                    setStep:customDotFail
                });
            }
        }else{
            return false
        }
    };

    render() {
        const { stepInfo } = this.props;
        const { stepBarInfo, setStep } = this.state;

        const desc1 = (
            <div>
                <div>{stepBarInfo.stepBarDetail[0].stepUser}</div>
                <div>{stepBarInfo.stepBarDetail[0].stepTime}</div>
                {
                    stepBarInfo.stepBarDetail[0].stepStatus != null && stepBarInfo.stepBarDetail[0].stepStatus === 1 &&
                    <div>{stepBarInfo.stepBarDetail[0].stepReason}</div>
                }
            </div>
        );

        const desc2 = (
            <div>
                <div>{stepBarInfo.stepBarDetail[1].stepUser}</div>
                <div>{stepBarInfo.stepBarDetail[1].stepTime}</div>
                {
                    stepBarInfo.stepBarDetail[1].stepStatus != null && stepBarInfo.stepBarDetail[0].stepStatus === 1 && (stepInfo.approvalStatus == 23003 || stepInfo.approvalStatus == 38003 || stepInfo.approvalStatus == 48003 || stepInfo.approvalStatus == 21003 || stepInfo.approvalStatus == 22003 || stepInfo.approvalStatus == 24003) &&
                    <div>已通过</div>
                }
                {
                    stepBarInfo.stepBarDetail[1].stepStatus != null && stepBarInfo.stepBarDetail[0].stepStatus === 1 && (stepInfo.approvalStatus == 23003 || stepInfo.approvalStatus == 38003 || stepInfo.approvalStatus == 48003 || stepInfo.approvalStatus == 21003 || stepInfo.approvalStatus == 22003 || stepInfo.approvalStatus == 24003) &&
                    <div>未通过</div>
                }
                {
                    stepBarInfo.stepBarDetail[1].stepStatus != null && stepBarInfo.stepBarDetail[0].stepStatus === 1 &&
                    <div>{stepBarInfo.stepBarDetail[1].stepReason}</div>
                }
                <div>{stepBarInfo.stepBarDetail[1].stepReason}</div>
            </div>
        );

        const desc3 = (
            <div>
                <div>{stepBarInfo.stepBarDetail[2].stepUser}</div>
                <div>{stepBarInfo.stepBarDetail[2].stepTime}</div>
                {
                    stepBarInfo.stepBarDetail[2].stepStatus != null && stepBarInfo.stepBarDetail[0].stepStatus === 1 &&
                    <div>{stepBarInfo.stepBarDetail[2].stepReason}</div>
                }
            </div>
        );

        return (
            <div className='gym-contract-content'>
                <div className='gym-contract-step'>
                    <div>
                        <Steps current={stepBarInfo.current} progressDot={setStep}>
                            <Step title={stepBarInfo.stepBarDetail[0].stepTitle} description={desc1} />
                            <Step title={stepBarInfo.stepBarDetail[1].stepTitle} description={desc2} />
                            <Step title={stepBarInfo.stepBarDetail[2].stepTitle} description={desc3} />
                        </Steps>
                    </div>
                </div>
            </div>
        )
    }
}

export {StepsInfo}
