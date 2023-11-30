/**
 * desc: 报名步骤条
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {Steps, Button} from 'antd';
import './index.scss';
import {connect} from "react-redux";


/*结构出二级组件*/
const Step = Steps.Step;

class EnrollStep extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
    }

    render() {
        const {current} = this.state;
        const {steps} = this.props;
        const flag = steps.length === 3 ? this.props.activityDetail.length > 0 : steps.length === 4 ? this.props.activityList : true
        return (
            <Fragment>
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {
                        current > 0
                        && (
                            <Button style={{marginLeft: 8}} className="gym-radius-btn gym-button-white" onClick={() => this.prev()}>
                                上一步
                            </Button>
                        )
                    }
                    {
                        current < steps.length - 1
                        && <Button type="primary" className="gym-radius-btn" disabled={!flag} onClick={() => this.next()}>下一步</Button>
                    }
                    {
                        current === steps.length - 1
                        && <Button type="primary" className="gym-radius-btn" onClick={this.handleComplete}>完成</Button>
                    }

                </div>
            </Fragment>
        )
    }

    next() {
        this.setState(prevState => ({
            current: prevState.current + 1
        }));
    }

    prev() {
        this.setState(prevState => ({
            current: prevState.current - 1
        }));
    }

    handleComplete() {
        this.props.handleComplete();
    }
}

export default connect((state:any)=>({
    activityDetail:state.activityDetail.selectedBaby,
    activityList:state.activityList.selectedBaby
}))(EnrollStep);
