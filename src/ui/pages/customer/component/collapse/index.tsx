// dave.zhang
import React from 'react';
import {Collapse as AntdCollapse} from 'antd';
const Panel = AntdCollapse.Panel;
import './index.scss';

function CollapseWrapper (Header,headerOpts,Content) {
  return class Collapse extends React.Component<any,any>{
    constructor(props){
      super(props);
      this.state={
        collapse:true
      }
    }

    onChange = (arr)=>{
      if (arr.length>0){
        this.setState({collapse:false})
      } else{
        this.setState({collapse:true})
      }
    }
    render() {
      return(
        <div className="component-collapse">
          <AntdCollapse defaultActiveKey={[]} onChange={this.onChange}>
              <Panel header={
                  <Header {...headerOpts}
                          isCollapse={true}
                          collapseStatus={this.state.collapse}
                  />
              }
                   key="1" showArrow={false}>
              {Content}
            </Panel>
          </AntdCollapse>
        </div>
      )
    }
  }
}

export {CollapseWrapper};
