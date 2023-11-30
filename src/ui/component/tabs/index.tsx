/**
*Desc: tab切换
*User: Debby.Deng
*Date: 2018/11/5,
*Time: 下午3:13
*/
import React from 'react';
import {Tabs as AntdTabs} from "antd";
const TabPane=AntdTabs.TabPane;
import './index.scss';

declare interface tabProps {
    className?:string,
    tabPanes:Array<tabPaneObj>,
    type?:'line' | 'card' | 'editable-card',
    onChange?:(activeKey)=>(void),
    foreceRender?:boolean,
    [propName:string]:any,
}
declare interface tabPaneObj {
    key?:string,
    tabTitle:string,
    tabPane:any,
}

class Tabs extends React.Component<tabProps, any> {

    getTabPanes(){
        const {tabPanes,foreceRender=false}=this.props;
        return (tabPanes||[]).map( (pane:tabPaneObj,index)=> {
            const key=pane.key? pane.key : index;
            return (
                <TabPane tab={pane.tabTitle} key={`${key}`} forceRender={foreceRender}>
                    {pane.tabPane}
                </TabPane>
            )
        })
    }
    render(){
        const {className,type = 'card', onChange,...rest}=this.props;
        return (
            <div className={`${className} gym-tabs`}>
                <AntdTabs type={type} onChange={onChange} {...rest}>
                    {this.getTabPanes()}
                </AntdTabs>
            </div>
        )
    }
}

export {Tabs}
