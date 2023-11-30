/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React, {Fragment} from 'react';
import {Steps} from "antd";
import {PageTitle} from "@/ui/component/pageTitle"

declare interface StepInfoProps {
    stepsInfo: any
    current: number
}

const Step = Steps.Step;

class StepsInfo extends React.Component<StepInfoProps, any> {
    componentDidUpdate() {

    }

    render() {
        const {stepsInfo, current} = this.props;
        return (
            <Fragment>
                <PageTitle title={`流程进度`}/>
                <div className='gym-contract-step'>
                    <div>
                        <Steps progressDot current={current}>
                            {
                                stepsInfo.map((item, index) => (
                                    <Step key={`step_${index}`} title={item.title} description={<Fragment>
                                        <p>{item.operateName}</p>
                                        <p>{item.operateTime}</p>
                                        <p>{item.operateDesc}</p>
                                    </Fragment>} />
                                ))
                            }
                        </Steps>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {StepsInfo}
