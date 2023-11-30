import React from 'react';
import {Collapse as AntdCollapse} from 'antd';
import {Memos} from './memos'
import {PageTitle} from "../../component/client360WrapperTitle";
const Panel = AntdCollapse.Panel

class MemoCollapse extends React.Component<any,any>{
  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    const {basicInfo,pageRefresh,leadsId}=this.props;
    return(
        <AntdCollapse onChange={this.props.memoCollapseOnChange}>
          <Panel showArrow={false}
                 key='need_done'
                 header={
                   <PageTitle title={'待办事项'} hn={'h4'}
                              news={
                                basicInfo.taskTodoInfos &&
                                basicInfo.taskTodoInfos.length
                              }
                   />
                 }
          >
            <Memos memoArr={basicInfo.taskTodoInfos}
                   pageRefresh={pageRefresh}
                   leadsId={leadsId}
            />
          </Panel>
        </AntdCollapse>
    )
  }
}

export {MemoCollapse};
