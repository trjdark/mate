/**
*Desc: rrp查询绑定页面
*User: Debby.Deng
*Date: 2019/8/27,
*Time: 2:40 PM
*/
import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Tabs} from '@/ui/component/tabs';
import {RrpList} from "@/ui/pages/customer/rrp/parts/rrpList";

class CheckRRP extends React.Component<any,any>{
    constructor(props){
        super(props);
        this.state={
            crumb: [
                {name:'客户',path:'',link:'#'},
                {name:'客户信息管理',path:'',link:'#'},
                {name:'RRP绑定查询',path:'',link:'#'},
            ],
            tabPanes:[
                {
                    tabTitle:'RRP绑定查询',
                    tabPane:<RrpList/>
                },

            ]
        }
    }

    callback = (key)=>{

    }

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

export {CheckRRP}
