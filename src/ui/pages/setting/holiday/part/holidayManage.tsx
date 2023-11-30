/**
 * desc: 节假日列表
 * Date: 2018/8/15
 * Time: 下午4:13
 */

import React from 'react';
import {form} from "../../../../../common/decorator/form";
import {getHolidayList} from "@redux-actions/setting/holidayActions";
import {Link} from "react-router-dom";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination";
import {SearchForm} from "../../../../component/searchForm";


@form()

class HolidayManage extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            holidayName: '',
            startDate: '',
            endDate: '',
            currentCenterId:User.currentCenterId,
            dataSource: [],
            totalSize: 0,
        }
    }
    componentDidMount(){
        this.handleSearch()
    }
    /**
     * 搜索
     * @param values
     */
    onSearch = (values) => {
        const {date=[]} = values;
        const params={
            holidayName:values.holidayName,
            startDate:date[0] && date[0].format('YYYY-MM-DD'),
            endDate:date[1] && date[1].format('YYYY-MM-DD'),
            pageNo:1,
            pageSize:this.state.pageSize,
        };
        this.setState(params, this.handleSearch);
    };

    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.handleSearch);

    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = () => {
        const {pageNo, pageSize, holidayName, startDate, endDate, currentCenterId} = this.state;
        getHolidayList({pageNo, pageSize, holidayName, startDate, endDate, currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            })
    };
    onReset = () => {
        this.setState({
            startDate: '',
            endDate: '',
        });
        this.props.form.resetFields();
    };
    formatIsEnabled = (status:number) => {
        switch (status){
            case 0:
                return '失效';
            case 1:
                return '启用';
        }
    };
    formatDate =(start,end)=>{
        const startDate = CommonUtils.transferDate(start);
        const endDate = CommonUtils.transferDate(end);
        return (<span>{startDate} ~ {endDate}</span>)
    };
    // 搜索配置
    searchConfig:any = [
        {
            label: '节假日名称',
            required: false,
            type: 'text',
            placeholder: '节假日名称',
            name: 'holidayName'
        },
        {
            label: '选择日期',
            required: false,
            type: 'rangePicker',
            placeholder: '选择日期',
            name: 'date'
        },
    ];
    // 表头配置
    columns = [{
        title: '节假日名称',
        dataIndex: 'holidayName',
    }, {
        title: '节假日日期',
        dataIndex: 'holidayDate',
        render:(text:string, record:any) => (this.formatDate(record.startDate,record.endDate))
    }, {
        title: '中心名称',
        dataIndex: 'centerName',
    }, {
        title: '状态',
        dataIndex: 'isEnabled',
        key: 'isEnabled',
        render:(text: number) => (this.formatIsEnabled(text))
    }, {
        title: '操作',
        dataIndex: 'action',
        width:100,
        render:(text:string, record:any) => (
            <Link to={`${Routes.节假日修改.link}${CommonUtils.stringify({id: record.id})}`}>
                <button className=" gym-button-xxs gym-button-white">编辑</button>
            </Link>
        )
    }];
    render(){
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return(
            <div className='gym-holiday-manage'>
                <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                <Link className='gym-holiday-manage-create' to={Routes.节假日添加.path}>
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

export {HolidayManage}
