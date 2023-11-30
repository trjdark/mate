import React from 'react';
import { Steps as AntdSteps, Icon as AntdIcon } from 'antd';
import moment from 'moment'
import './index.scss'
import _ from 'lodash';
const AntdStep = AntdSteps.Step;

class Title extends React.Component<any,any>{
  constructor(props){
    super(props)
  }
  render(){
    const {step,idx,currentIdx}=this.props;
    let nullInfo = undefined;
    if (!step.milestoneDate && idx<currentIdx) {
      nullInfo = 'nullInfo'
    }
    return(
      <React.Fragment>
        <div className={`${nullInfo}`}>
          {step.milestoneInfo}
        </div>
        <div>
          {
            step.milestoneDate?(
              moment(step.milestoneDate).format('YYYY-MM-DD')
            ):('')
          }
        </div>
      </React.Fragment>
    )
  }
}


class Steps extends React.Component<any,any>{
  constructor(props){
    super(props);
  }
  getIdx = (arr)=>{
    // 计算数组最后一个元素的milestoneDate非null的idx
    return _.findLastIndex(arr,(elem:any) => elem.milestoneDate!==null)
  }
  /**
   *
   */
  getClassName = (idx:number,currentIdx:number,step:any) => {
      if (!step.milestoneDate && idx < currentIdx) {
          return 'none'
      }
      if(idx > currentIdx) {
          return 'undone';
      }
      if(idx < currentIdx) {
          return 'done';
      }


  }
  render(){
    const {steps}=this.props;
    const currentIdx = this.getIdx(steps)
    return(
      <div className="component-steps">
        <AntdSteps  direction="vertical" size="small" current={currentIdx}>
          {steps && steps.map((step,idx)=>
            <AntdStep title={
                        <Title step={step}
                               idx={idx+1}
                               currentIdx={currentIdx+1}
                        />
                      }
                      key={idx}
                      icon={
                        <AntdIcon
                            type="check-circle"
                            theme="filled"
                            className={this.getClassName(idx+1, currentIdx+1, step)}
                        />
                      }
            />
          )}
        </AntdSteps>
      </div>
    )
  }
}

export {Steps}
