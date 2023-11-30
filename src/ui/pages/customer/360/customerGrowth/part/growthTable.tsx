/**
*Desc: 客户成长tab公用Table
*User: Debby.Deng
*Date: 2018/11/23,
*Time: 上午10:06
*/
import * as React from "react";
import {CommonRecords, WrappedComponent} from "./commonTable";
import {
    courseClose,
    hotRecommend,
    keyEventList,
    reNewFollow,
    transferRecord,
} from "@redux-actions/customer/customerGrowth";
import {
    getClientFeedBackList,
    getClientFeedBackReportNew,
    getCustomerBadgeList, getMonthlyList
} from "@redux-actions/teaching/feedBack";
import {getCustomerReportList, getPromotionReportList} from "@redux-actions/teaching/evaluationReport";
import {User} from "../../../../../../common/beans/user";

interface propsType {
    leadsId:string,
    type:string,
    [propName:string]:any,
}
class GrowthTable extends React.Component<propsType, any>{
    state={
        resData:{},
        query:{
            currentCenterId:User.currentCenterId,
            centerId:User.currentCenterId,
            babyId: this.props.babyId,
            pageNo:1,
            pageSize:10,
            leadsId:this.props.leadsId,
            id: this.props.leadsId,
        }
    };
    handlePageChange=(page)=>{
        this.resetTable(page);
    };
    resetTable(setting){
        const {type}=this.props;
        let request=null;
        switch (type){
            case 'transfer':{//交接记录
                request=transferRecord;
                break;
            }
            case 'keyEvent':{//关键事件记录
                request=keyEventList;
                break;
            }
            case 'growth':{//成长报告
                request=transferRecord;

                break;
            }
            case 'feedback':{//随堂反馈
                request = getClientFeedBackList;
                break;
            }
            case 'renew':{//续约跟进
                request=reNewFollow;
                break;
            }
            case 'recommend':{//热心推荐
                request=hotRecommend;
                break;
            }
            case 'package':{//课程包结束
                request=courseClose;
                break;
            }
            case 'testRecord':{// 测评报告
                request = getCustomerReportList;
                break;
            }
            case 'feedbacknew':{ // 随堂反馈新
                request = getClientFeedBackReportNew;
                break;
            }
            case 'monthlyList':{ // 月度回顾
                request = getMonthlyList;
                break;
            }
            case 'badgeList':{ // 徽章记录
                request = getCustomerBadgeList;
                break;
            }
            case 'promotionReport':{ // 升班报告
                request = getPromotionReportList;
                break;
            }
        }
        const params = Object.assign({},this.state.query,setting);
        request && request(params).then((res)=>{
            this.setState({
                resData:res,
                query:params,
            })
        })
    }
    componentDidMount(){
        this.resetTable({});
        this.props.onRef &&this.props.onRef(this);
    }
    componentWillUnmount(){
        this.props.onRef &&this.props.onRef(undefined);
    }
    render(){
        const {type}=this.props;
        const {resData}:any = this.state;
        (resData.list||[]).map((item,index)=>{
            item.key=index;
        });
        const TableWrap=WrappedComponent(CommonRecords,{type:type});
        return(
            <div>
                <TableWrap onPageChange={this.handlePageChange} resData={resData}/>
            </div>
        )
    }
}

export{GrowthTable}
