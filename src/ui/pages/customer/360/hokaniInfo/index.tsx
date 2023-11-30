import React from 'react';
import {Tabs} from '@/ui/component/tabs';
import {VipMessage} from './part/vipmsg';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {RecordList} from './part/record';
import {CommonUtils} from '@/common/utils/commonUtils';
import './style/index.scss';
const Fragment=React.Fragment;

class HokaniInfo extends React.Component<any,any>{
  constructor(props){
    super(props);
    this.state={
      tabPanes:[
        {
          tabTitle:'会籍信息',
          tabPane:<VipMessage leadsId={CommonUtils.parse(props).leadsId} />
        },{
          tabTitle:'收支记录',
          tabPane:<RecordList leadsId={CommonUtils.parse(props).leadsId} />
        }
      ],
      leadsId:CommonUtils.parse(props).leadsId,
    }
  }

  static crumb=[
      {name:'客户中心',path:'',link:'#',id:'customer'},
      {name:'客户360',path:'',link:'#',id:'client360'},
      {name:'其他信息',path:'',link:'#',id:'hokaniInfo'}
  ]
  render(){
    return(
      <Fragment>
        <div className="hokaniInfo">
          <BreadCrumb routes={HokaniInfo.crumb} />
          <Tabs type="card"
                tabPanes={this.state.tabPanes}
          />
        </div>
      </Fragment>
    )
  }
}

export {HokaniInfo}
