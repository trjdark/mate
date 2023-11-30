import React from 'react';
import {BreadCrumb} from '@/ui/component/breadcrumb';
import {SearchForm} from "../../../../component/searchForm";
import  {PageTitle} from "@/ui/component/pageTitle";
import {Message} from "@/ui/component/message/message";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {getBlackList,delBlackList} from "@redux-actions/setting/blackListActions";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import { ConfirmCheck } from '@/ui/component/confirmCheck';


class InactiveMemberReminderManage extends React.Component<any,any>{
    private breadCrumbRoutes: Array<any> = [
        {name: '设置', path: '', link: '#', id: ''},
        {name: '运营管理', path: '', link: '#', id: ''},
        {name: '非活跃会员不提醒设置', path: '', link: '#',}
    ];
    constructor(props:any){
        super(props);
        this.state={
            currentCenterId:User.currentCenterId,
            pageNo:1,
            pageSize:10,
            totalNo: 1,
            totalSize:10,
            dataSource: [],
            selectedRowKeys: [],
        };
    }
    componentDidMount(){
        this.getData();
    }

    /**
     * 搜索
     * @param json
     */
    onSearch = (values:any) => {
        this.setState({
            ...values,
            pageNo:1
        }, this.getData)
    };
    /**
     * 选择框
     */
    selectRow = record => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
    };
    /**
     * 选择条件改变
     */
    onSelectedRowKeysChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    /**
     * 分页
     * @param page
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.getData);
    };
    /**
     * 获取数据
     */
    getData = () => {
        const {pageNo, pageSize, currentCenterId,totalNo,totalSize, babyName, tel} = this.state;
        getBlackList({
            pageNo, pageSize, currentCenterId,
            babyName, tel,totalNo,totalSize,
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize,
            })
        })
    };
     /**
     * 从黑名单中移除
     * @param record
     */
    handleCancelBlackList = (record) => {
        const param = {
            ids:[record.id],
            currentCenterId:User.currentCenterId
        }
        delBlackList(param)
        .then(()=>{
            this.onSearch({pageNo: this.state.pageNo})
            Message.success("移除成功！");
        })
        this.setState({
            selectedRowKeys: [],
        })
    };
     /**
     * 批量从黑名单中移除
     */
      handleCancelBlackLists = () => {
        const {selectedRowKeys} = this.state;
        if(selectedRowKeys.length === 0) {
            Message.error("至少需要选择一条数据！");
            return;
        };
        const param = {
            ids:selectedRowKeys,
            currentCenterId:User.currentCenterId
        }
        delBlackList(param)
        .then(()=>{
            this.onSearch({pageNo: this.state.pageNo});
            Message.success("移除成功！");
        })
        this.setState({
            selectedRowKeys: [],
        })
    };
    /**
     * 搜索配置
     */
    searchConfig:any = [
        {
            label: '手机号码',
            required: false,
            type: 'text',
            placeholder: '手机号',
            name: 'tel'
        },{
            label: '宝宝姓名',
            required: false,
            type: 'text',
            placeholder: '宝宝姓名' ,
            name: 'babyName'
        }
    ];
    /**
     * 表头配置
     */
    columns = [{
        title: '宝宝姓名',
        dataIndex: 'babyName',
        width:200
    },{
        title: '宝宝姓月龄',
        dataIndex: 'monthAge',
        width:100
    },{
        title: '联系人',
        dataIndex: 'contactName',
        width:100
    },{
        title: '手机号码',
        dataIndex: 'contactTel',
        width:150
    },{
        title: '操作',
        dataIndex: 'actions',
        width: 80,
        render: (text, record) => (
            <ConfirmCheck
                contentText={"确定移出黑名单？"}
                button={
                    <button
                        className='gym-button-xs gym-button-default'
                        >移除
                    </button>
                }
                item={record}
                ensure={this.handleCancelBlackList}
            />
        )
    },];
    render(){
        const {pageNo, pageSize, dataSource, totalSize,selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange
        };
        return(
            <div id='gym-inactivemember-manage'>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <PageTitle className='gym-inactivemember-tip' title={`选择不需要发送非活跃会员提醒的宝宝`}/>
                    <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                    <Link to={`${Routes.非活跃会员提醒新增.path}`}>
                        <button  className='gym-button-xs gym-button-default mb20 ml30'>+ 新建</button>
                    </Link>
                    <ConfirmCheck
                        contentText={"确定移出黑名单？"}
                        button={
                            <button
                                className='gym-button-xs gym-button-default mb20 ml30'
                                >批量移除
                            </button>
                        }
                        item={{}}
                        ensure={this.handleCancelBlackLists}
                    />
                    <TablePagination
                        rowSelection={rowSelection}
                        onRow={record => ({
                            onClick: () => {
                                this.selectRow(record);
                            }
                        })}
                        columns={this.columns}
                        rowKey={'id'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                </div>
            </div>
        )
    }
}

export {InactiveMemberReminderManage}
