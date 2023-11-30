/**
 * desc: 产品管理
 * User: debby
 * Date: 2018/8/16
 * Time:
 */
import React from 'react';
import {item, SearchForm} from "../../../../component/searchForm";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {getPromotorList} from "../../../../../redux-actions/setting/promotorActions"
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";


class PromotorMange extends React.Component<any,any>{
    state = {
        promotorName:"",
        remark:"",
        pageNo:1,
        pageSize:10,
        currentCenterId:User.currentCenterId,
        dataSource: [],
        totalSize: 0
    };
    componentDidMount(){
        this.getData();
    }
    /**
     * 获取数据
     */
    getData = () => {
        const {currentCenterId, promotorName, remark, pageNo, pageSize} = this.state;
        getPromotorList({
            currentCenterId, promotorName, remark, pageNo, pageSize
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    };
    /**
     * 搜索
     * @param values
     */
    handleChange = (values:any) => {
        this.setState({
            ...values,
            pageNo:1
        }, this.getData);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.getData);
    };

    // 搜索配置
    searchConfig:item[] = [
        {
            label: '姓名',
            type: 'text',
            placeholder: '姓名',
            name: 'promotorName'
        },{
            label: '备注',
            type: 'text',
            placeholder: '备注' ,
            name: 'remark'
        }

    ];
    // 表头配置
    columns = [{
        title: '姓名',
        dataIndex: 'promotorName',
    }, {
        title: '备注',
        dataIndex: 'remark',
        width:200
    }, {
        title: '启用状态',
        dataIndex: 'isEnabled',
        render: (text:number) => text === 1 ? "启用" : "停用"
    },{
        width:100,
        title: '操作',
        key: 'action',
        render:(text,record)=>(
            <Link to={`${Routes.promotor管理编辑.link}/${CommonUtils.stringify({id: record.id})}`}>
                <button className=" gym-button-xxs gym-button-white">编辑</button>
            </Link>
        ),
    }];
    render(){
        const {dataSource, pageNo, pageSize, totalSize} = this.state;
        return(
            <div id={`gym-product-manage`}>
                <SearchForm items={this.searchConfig} onSearch={this.handleChange}/>
                <Link to={`${Routes.promotor管理新建.path}`}>
                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+ 新建</button>
                </Link>
                <TablePagination
                    columns={this.columns}
                    rowKey={'id'}
                    dataSource={dataSource}
                    totalSize={totalSize}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={pageNo}
                />
            </div>
        )
    }
}

export {PromotorMange}
