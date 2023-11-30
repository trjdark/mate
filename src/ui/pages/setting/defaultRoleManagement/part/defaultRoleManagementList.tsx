/**
 * desc: 默认角色管理
 * User: colin.lu
 * Date: 2018/8/16
 * Time: 上午10:00
 */

import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {getDefaultRoles} from "@redux-actions/setting/roleActions";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";


class DefaultRoleManagementList extends React.Component<any, any>{
    constructor(props:any){
        super(props);
        this.state = {
            pageSize:10,
            pageNo:1,
            roleName: '',
            remark: '',
            currentCenterId:User.currentCenterId,
            dataSource: [],
            totalSize: 0,
        }
    }
    componentDidMount(){
        this.handleSearch();
    }
    formatIsEnabled = (status:number) => {
        switch (status){
            case 0:
                return '失效';
            case 1:
                return '启用';
        }
    };
    onSearch = (values:any) => {
        this.setState({
            ...values,
                currentPage:1,
                pageSize:this.state.pageSize},
            this.handleSearch);
    };
    /**
     * 搜索
     * @param body
     */
    handleSearch = () => {
        const {pageNo, pageSize, roleName, remark, currentCenterId} = this.state;
        getDefaultRoles({pageNo, pageSize, roleName, remark, currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            });
    };
    /**
     * 翻页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    // 表头配置
    columns = [{
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        width:'20%'
    }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },{
        title: '启用状态',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render:(text: number) => (this.formatIsEnabled(text)),
        width:'20%'
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render:(text:string, record:any, index:number) => (
            <Link to={`${Routes.默认角色管理编辑.link}${CommonUtils.stringify({id: record.id})}`}>
                <button className=" gym-button-xxs gym-button-white">编辑</button>
            </Link>
        ),
        width:100
    }];
    // 搜索配置
    searchConfig:any = [
        {
            label: '角色名称',
            required: false,
            type: 'text',
            placeholder: '角色名称',
            name: 'roleName'
        },{
            label: '备注',
            required: false,
            type: 'text',
            placeholder: '备注',
            name: 'remark'
        },

    ];
    render(){
        //props数据初始化
        const {dataSource, totalSize, pageNo, pageSize} = this.state;
        return(
            <div id={`gym-role-list`}>
                <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                <Link to={Routes.默认角色管理新增.path} className='gym-general-course-manage-create'>
                    <button  className='gym-button-xs gym-button-default mb20 ml30'>+ 新建</button>
                </Link>
                <TablePagination
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey={'id'}
                    pageNo={pageNo}
                    totalSize={totalSize}
                    pageSize={pageSize}
                    handleChangePage={this.handleChangePage}
                />

            </div>
        )
    }
}

export {DefaultRoleManagementList}
