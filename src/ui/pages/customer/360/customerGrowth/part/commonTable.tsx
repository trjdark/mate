/**
 *Desc: 通用表格
 *User: Debby.Deng
 *Date: 2018/11/2,
 *Time: 上午10:44
 */
import * as React from "react";
import { TablePagination} from '@/ui/component/tablePagination';
import {tableHeader} from "./tableHeader";


declare interface tableProps {
    onPageChange:(type)=>(void),
    resData:any,
    //不用传入
    type?:any,
    leadsId?:string,
}
class CommonRecords extends React.Component<tableProps>{
    getContent=(id)=>{
        let columns=null;
        const {resData}=this.props;

        switch (id){
            case 'transfer':{//交接记录
                columns=tableHeader.transfer;
                break;
            }
            case 'keyEvent':{//关键事件记录
                columns=tableHeader.keyEvent;
                break;
            }
            case 'activity':{//活动记录
                break;
            }
            case 'growth':{//成长报告
                columns=tableHeader.growth;
                break;
            }
            case 'feedback':{//随堂反馈
                columns=tableHeader.feedback;
                break;
            }
            case 'feedbacknew':{ // 随堂反馈2.0
                columns = tableHeader.feedbacknew;
                break;
            }
            case 'renew':{//续约跟进
                columns=tableHeader.renew;
                break;
            }
            case 'recommend':{//热心推荐
                columns=tableHeader.recommend;
                break;
            }
            case 'package':{//课程包结束
                columns=tableHeader.package;
                break;
            }
            case 'testRecord':{//测试报告
                columns=tableHeader.testRecord;
                break;
            }
            case 'monthlyList':{// 月度回顾
                columns=tableHeader.monthlyList;
                break;
            }
            case 'badgeList':{// 徽章记录
                columns=tableHeader.badgeList;
                break;
            }
            case 'promotionReport':{// 升班报告
                columns=tableHeader.promotionReport;
                break;
            }
        }
        return   <TablePagination
                    columns={columns}
                    dataSource={resData.list}
                    pageSize={resData.pageSize}
                    pageNo={resData.pageNo}
                    totalSize={resData.totalSize}
                    handleChangePage={this.props.onPageChange}
        />;

    };

    componentDidMount(){

    }
    componentWillUnmount(){
    }
    render(){
        const {type}=this.props;
        return (
                this.getContent(type)
        )
    }
}

function WrappedComponent(Wrap,condition) {
    return class extends React.Component<any>{
        render(){
            return <Wrap type={condition.type} {...this.props}/>
        }
    }
}

export {WrappedComponent,CommonRecords}
