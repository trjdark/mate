// dave.zhang
import React from 'react';
import { Tabs as AntdTabs } from 'antd';
import './index.scss';
const TabPane = AntdTabs.TabPane;

function Tabs360Wrapper(TabComponent) {
  return class Tabs360 extends React.Component<any,any>{
    constructor(props){
      super(props);
      this.state={}
    }

    onTabChange = (val)=>{
      this.props.setCurrentBabyInfo(this.props.basicInfo.babyInfos[val])
    };

    render(){
      const {basicInfo}=this.props;
      return(
        <div className="tabs-360">
          {
            basicInfo.babyInfos &&
            (basicInfo.babyInfos.length>1?(
              <AntdTabs onChange={this.onTabChange} type="card">
                {basicInfo.babyInfos.map((baby,idx)=>
                  <TabPane tab={baby.babyName} key={idx}>
                      <TabComponent data={baby}
                                    phase={basicInfo.phaseValue}
                      />
                      <div></div>
                  </TabPane>
                )}
              </AntdTabs>
            ):(
              <TabComponent data={basicInfo.babyInfos[0]}
                            phase={basicInfo.phaseValue}
              />
            ))
          }
        </div>
      )
    }
  }
}

export {Tabs360Wrapper};
