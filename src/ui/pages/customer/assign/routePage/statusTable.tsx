/**
*Desc: 分配客户查询得到的表格
*User: Debby.Deng
*Date: 2018/10/10,
*Time: 上午10:44
*/

import {MultSelectWrap} from "../part/multSelect";
import {BtnGroup} from "../part/btnGroup";
import * as React from "react";
import { getHeader} from "./customerTableHeader";
import {TabSquare} from "../../../../component/tabSquare";
import {connect} from "../../../../../common/decorator/connect";
import {selectAssignList} from "../../../../../saga/selectors/customer/assignSelector";
import {TablePagination} from "../../../../component/tablePagination";
const tabList=[
    {
        title:'关键信息',
        id:'key'
    },
    {
        title:'基本信息',
        id:'basic'
    },
    {
        title:'leads信息',
        id:'leads'
    },
    {
        title:'跟进信息',
        id:'follow'
    },
    {
        title:'合同信息',
        id:'contract'
    },
    {
        title:'上课情况',
        id:'lesson'
    },
    {
        title:'客户成长',
        id:'growth'
    },
];

const tmkColumns = [
    {
        title: "TMK",
        dataIndex: 'tmkStaffName',
    },
]

@connect((state)=>({
    tableData:selectAssignList(state),
}),{})
class StatusTable extends React.Component<any>{
    status=0;
    state={
        lastNavIndex:null,//导航栏上次选中
        columns:[],
        type:'待分配',//按钮组
        activeIndex:0,//tabsquare 关键信息、基本信息...选中项
        searchInitial:[],//GB/GA筛选默认值
    };

    static getDerivedStateFromProps(props,state){
        const statusCode=props.status;
        const status = state.lastNavIndex;
        if(status === statusCode) {
            //仅点击navigation状态变更调用
            return null;
        }
        props.onTabClick('key');
        const customerTableHeader = getHeader(props.sortedInfo);
        switch(Number(statusCode)){
            case 1:{//待分配
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["待分配-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["待分配-关键信息"]).slice(5)
                        ],
                        type:'待分配',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["待分配-关键信息"],
                        type:'待分配',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 2:{//已分配
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["已分配-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["已分配-关键信息"]).slice(5)
                        ],
                        type:'已分配',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["已分配-关键信息"],
                        type:'已分配',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 3:{//已领取
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["已领取-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["已领取-关键信息"]).slice(5)
                        ],
                        type:'已领取',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["已领取-关键信息"],
                        type:'已领取',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 4:{//已联络
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["已联络-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["已联络-关键信息"]).slice(5)
                        ],
                        type:'已联络',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["已联络-关键信息"],
                        type:'已联络',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 5:{//诺访
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["诺访-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["诺访-关键信息"]).slice(5)
                        ],
                        type:'诺访',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["诺访-关键信息"],
                        type:'诺访',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 6:{//已到访
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["已到访-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["已到访-关键信息"]).slice(5)
                        ],
                        type:'已到访',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["已到访-关键信息"],
                        type:'已到访',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }
            }
            case 7:{//新会员
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(5)
                        ],
                        type:'新会员-老会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["新会员-老会员-关键信息"],
                        type:'新会员-老会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,

                    }
                }
            }
            case 8:{//老会员
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(5)
                        ],
                        type:'新会员-老会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["新会员-老会员-关键信息"],
                        type:'新会员-老会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,

                    }
                }
            }
            case 9:{//待续会员
                if(props.isIncludeTmk){
                    return {
                        columns:[
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(0, 5),
                            ...tmkColumns,
                            ...(customerTableHeader["新会员-老会员-关键信息"]).slice(5)
                        ],
                        type:'新会员-老会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,
                    }
                }else{
                    return {
                        columns:customerTableHeader["待续会员-关键信息"],
                        type:'待续会员',
                        activeIndex:0,
                        lastNavIndex:statusCode,

                    }
                }
            }
            case 10:{//历史名单
                return {
                    columns:customerTableHeader["历史名单-关键信息"],
                    type:'诺访',
                    lastNavIndex:statusCode,
                }
            }
            default:{
                return {
                    columns:[],
                    type:'',
                    lastNavIndex:null,
                }
            }
        }


    }
    handleChangePage=(pageInfo)=>{
        this.props.onPageChange(pageInfo);
    };
    handleSort=(pagination,filters,sorter)=>{//排序
        const columns = this.state.columns;
        columns.map((column)=>{
            column.sortOrder = column.key===sorter.field? sorter.order : '';
        });
        this.setState({columns});
        this.props.onTableSort(sorter);
    };

    onTableSelectChange=(selectedRowKeys, selectedRows)=>{//选中行回调事件
        const keys=selectedRows.map((item)=>{
            return item.key;
        });
        const {tableData} = this.props;
        const names = tableData.list.filter((item:any) => keys.includes(item.leadsId)).map((item:any) => item.babyName);
        this.props.onLeadsArrChange(keys, names);
    };
    handleClick=(i,id)=>{
        const {type}=this.state;
        this.setState({activeIndex:i});
        this.props.onTabClick(id);
        const customerTableHeader=getHeader(this.props.sortedInfo);
        switch(i){
            case 0:{//关键信息按钮
                this.setState({
                    columns:customerTableHeader[`${type}-关键信息`],
                });
                break;
            }
            case 1:{//基本信息按钮
                this.setState({
                    columns:customerTableHeader["基本信息"],
                });
                break;
            }
            case 2:{//leads信息
                this.setState({
                    columns:customerTableHeader["leads信息"],
                });
                break;
            }
            case 3:{//跟进信息
                this.setState({
                    columns:customerTableHeader["跟进信息"],
                });
                break;
            }
            case 4:{//合同信息
                this.setState({
                    columns:customerTableHeader["合同信息"],
                });
                break;
            }
            case 5:{//上课情况
                this.setState({
                    columns:customerTableHeader["上课情况"],
                });
                break;
            }
            case 6:{//客户成长
                this.setState({
                    columns:customerTableHeader["客户成长"],
                });
                break;
            }
        }
    };
    onSubmitGaGb=(value)=>{//ga/gb点击查询
        this.props.onSubmitGaGb(value);
    };
    render(){
        const {
            tableData,assignLeads,className,status, assignLeadsName,
            selectedRowKeys, defaultGAList, defaultGBList, form
        } = this.props;
        const {columns,type}=this.state;
        const dataSource=(tableData.list||[]);
        dataSource.map((item)=>{item.key=item.leadsId});
        const rowSelection={
            selectedRowKeys,
            onChange:this.onTableSelectChange
        };
        return (
            <div className={!!className?  className : ''}>
                <TabSquare tabList={tabList} activeIndex={this.state.activeIndex} onLiClick={this.handleClick}/>
                <div className='bgWhite p15 gym-assign-phase-table'>
                    <div>
                        <MultSelectWrap form={form}
                                        phaseId={status}
                                        onSubmit={this.onSubmitGaGb}
                                        defaultGA={defaultGAList}
                                        defaultGB={defaultGBList}
                        />
                        <BtnGroup totalLeadsNum={tableData.totalSize}
                                  assignLeads={assignLeads}
                                  assignLeadsName={assignLeadsName}
                                  onCallback={this.props.onLeadsArrChange}
                                  type={type}
                                  className='mtd20 gym-assign-phase-table-btn-group'
                        />
                        <TablePagination
                            columns={columns}
                            rowKey={'leadsId'}
                            handleFilterTableChange={this.handleSort}
                            dataSource={dataSource}
                            totalSize={tableData.totalSize}
                            pageSize={tableData.pageSize}
                            handleChangePage={this.handleChangePage}
                            pageNo={tableData.pageNo}
                            rowSelection={rowSelection}
                            scroll={{x:2000}}
                        />
                    </div>
                 </div>
            </div>
        )
    }
}

export {StatusTable}
