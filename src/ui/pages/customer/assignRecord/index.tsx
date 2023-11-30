/**
 * Desc: 会员转中心
 * User: dave.zhang
 */
import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Tabs} from '@/ui/component/tabs';
import {AssignRecordLeadsList} from './part/leadsList'
import './style/index.scss';

class AssignRecord extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            crumb: [
                {name:'客户',path:'',link:'#',id:'customer'},
                {name:'客户信息管理',path:'',link:'#',id:'customer-info-management'},
                {name:'转中心记录',path:'',link:'#',id:'customer-assign-record'},
            ],
            tabPanes:[
              {
                tabTitle:'Leads转中心',
                tabPane:<AssignRecordLeadsList/>
              },
            ]
        }
    }

    callback = ()=>{}

    render(){
        return(
            <div className="assign-records">
                <BreadCrumb routes={this.state.crumb} />
                <Tabs onChange={this.callback}
                      type="card"
                      tabPanes={this.state.tabPanes}
                />
            </div>
        )
    }
}

export {AssignRecord}
