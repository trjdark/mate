 /**
 * desc: 角色管理
 * User: colin.lu
 * Date: 2018/8/5
 * Time: 上午10:00
 */

import React from 'react';
import {SearchForm} from "../../../../component/searchForm";
import {getRoles} from "@redux-actions/setting/roleActions";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";

class RoleManagementList extends React.Component<any, any>{
    constructor(props:any){
        super(props);
        this.state = {
            currentCenterId:User.currentCenterId,
            pageNo:1,
            pageSize:10,
            roleName: '',
            remark: '',
            dataSource: [],
            totalSize: 0
        }
    }
    componentDidMount(){
        this.handleSearch();
    };
    /**
     * 搜索
     * @param values
     */
    onSearch = (values:any) => {
        this.setState({
            ...values,
            pageNo:1,
        }, this.handleSearch);
    };
    formatIsEnabled = (status:number) => {
        switch (status){
            case 0:
                return '失效';
            case 1:
                return '启用';
        }
    };
    /**
     * 获取数据列表
     * @param body
     */
    handleSearch = () => {
        const {pageNo, pageSize, roleName, remark, currentCenterId} = this.state
        getRoles({pageNo, pageSize, roleName, remark, currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            });
    };
    /**
     * 分页搜索
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    // 搜索设置
    searchConfig:any = [
        {
            label: '角色名称',
            required: false,
            type: 'text',
            placeholder: '请输入角色名称',
            name: 'roleName'
        },{
            label: '备注',
            required: false,
            type: 'text',
            placeholder: '请输入备注',
            name: 'remark'
        },

    ];
    // 表头配置
    columns = [{
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        width:200
    }, {
        title: '所属中心',
        dataIndex: 'centerName',
        key: 'centerName',
        width:150

    }, {
        title: '默认角色',
        dataIndex: 'defaultRoleName',
        key: 'defaultRoleName',
        width:150

    },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:380
    }, {
        title: '启用状态',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        width:150,
        render:(text: number) => (this.formatIsEnabled(text))
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width:150,
        render:(text:string, record:any) => (
            <Link to={`${Routes.中心角色管理编辑.link}${CommonUtils.stringify({id: record.id})}`}>
                <button className=" gym-button-xxs gym-button-white">查看</button>
            </Link>
        )
    }];
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;

        return(
            <div id={`gym-role-list`}>
                <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                {/* Todo 取消新建功能 */}
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

export {RoleManagementList}
