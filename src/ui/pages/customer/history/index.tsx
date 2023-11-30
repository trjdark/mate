/**
*Desc: 历史名单
*User: Debby.Deng
*Date: 2018/11/2,
*Time: 上午10:44
*/

import * as React from "react";
import {Tabs} from "../../../component/tabs";
import {connect} from "../../../../common/decorator/connect";
import {Recycle} from "./part/recycle";
import {OtherRecycle} from "./part/otherRecycle";
import {User} from "../../../../common/beans/user";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CourseClose} from "@/ui/pages/customer/history/part/courseClose";
@connect((state)=>({
}),{})
class HistoryRecord extends React.Component<any>{
    breadCrumb=[
        {
            name: '客户',
            path: '',
            link: '#',
        },{
            name: '客户信息管理',
            path: '',
            link: '#',
        },{
            name: '客户管理',
            path: '',
            link: '#',
        },{
            name: '历史名单',
            path: '',
            link: '#',
        },
    ];
    state={
        resData:Array(9).fill({}),
        query:{
            currentCenterId:User.currentCenterId,
            pageNo:1,
            pageSize:10,
        },
    };

    handleSearch=()=>{

    };
    getTabPans=()=>{//返回panes
        const {resData}=this.state;
        const titleObj={
            'courseClose':'课程包结束',
            'loss':'LEADS流失',
            'transfer':'LEADS转移',
            'customerTransfer':'会员转移',
            'unReceive':'长时间不领取回收',
            'unContact':'分配后领取未联系回收',
            'disContact':'领取后长期不联系回收',
            'unSign':'分配后长期未签约回收',
        };
        const panes=Object.keys(titleObj).map((type,key)=>{
            if(type==='courseClose'){
                return {
                    tabTitle:titleObj[type],
                    tabPane:<CourseClose key={key} type={type}/>
                }
            }
            return {
                tabTitle:titleObj[type],
                tabPane: <OtherRecycle key={key}
                                       type={type}
                />
            }
        });
        panes.unshift({
            tabTitle:'手动回收站',
            tabPane:<Recycle key={resData.length-1}
                              />
        });
        return panes;

    };

    switchTab=(activeKey)=>{//切换tab

    };

    componentDidMount(){
    }

    render(){
        return (
            <div className='gym-customer-history-list'>
                <BreadCrumb routes={this.breadCrumb} />
                <Tabs onChange={this.switchTab} tabPanes={this.getTabPans()}/>
            </div>
        )
    }
}

export {HistoryRecord}
