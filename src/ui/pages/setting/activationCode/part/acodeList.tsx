/**
 * desc: 激活码管理列表
 * User: Vicky.Yu
 * Date: 2020/6.30
 * Time: 15:30
 */

import React from 'react';
import {form} from "../../../../../common/decorator/form";
import { getUnconsumptionCode, getconsumptionCode, gettotalCode, getcodeList } from "@redux-actions/setting/acCodeActions";
import {Link} from "react-router-dom";
import { BreadCrumb } from "@/ui/component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {User} from "../../../../../common/beans/user";
import {TablePagination} from "../../../../component/tablePagination/index";
import {SearchForm} from "../../../../component/searchForm/index";


@form()

class AcodeList extends React.Component<any, any>{
    // 面包屑
    private routes: Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'setting'
        }, {
            name: '运营管理',
            path: '',
            link: '#',
            id: 'operation'
        }, {
            name: '激活码管理',
            path: '',
            link: '#',
            id: 'activationCode'
        }
    ];
    constructor(props:any){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            holidayName: '',
            startDate: '',
            endDate: '',
            dataSource: [],
            noConsumption:0, // 未消耗数
            consumption:0,  // 已消耗数
            total: 0, // 总消耗数
            totalSize: 0,
            sortName: '',
            sortOrder: '',
            columns: [],
        }
    }
    componentDidMount(){
        const { pageNo, pageSize, startDate, endDate, centerCode, sortOrder, sortName} = this.state;
        const param  = {currentCenterId: User.currentCenterId};
        Promise.all([
            getUnconsumptionCode(param),
            getconsumptionCode(param),
            gettotalCode(param),
            getcodeList({
                pageNo, pageSize, startDate, endDate, centerCode, sortOrder, sortName,
                currentCenterId: User.currentCenterId
            }),
        ]).then((res:any) => {
            const [dataOne, dataTwo, dataThree, dataFour] = res;
            this.setState({
                noConsumption: dataOne.noConsumption,
                consumption: dataTwo.consumption,
                total: dataThree.total,
                dataSource: dataFour.list,
                totalSize: dataFour.totalSize,
                columns: this.setColumnsConfig(sortOrder, sortName),
            });
        });
    }
    /**
     * 搜索
     * @param values
     */
    onSearch = (values) => {
        const {date=[]} = values;
        const params = {
            centerCode: values.centerCode,
            startDate:date[0] ? date[0].startOf('day').valueOf() : null,
            endDate:date[1] ? date[1].endOf('day').valueOf() : null,
            pageNo:1,
            pageSize:this.state.pageSize,
        };
        this.setState(params, this.handleSearch);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = () => {
        const { pageNo, pageSize, startDate, endDate, centerCode, sortOrder, sortName} = this.state;
        getcodeList({ pageNo, pageSize, centerCode, startDate, endDate, sortOrder, sortName, currentCenterId: User.currentCenterId})
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            })
    };
    /**
     * 排序
     */
    handleSort = (pagination, filters, sorter)=>{
        const sortInfo = {
            sortName: sorter.columnKey ? sorter.columnKey : '',
            sortOrder: sorter.order ? sorter.order : '',
        };
        this.setState({
            sortName: sortInfo.sortName,
            sortOrder: sortInfo.sortOrder,
            columns: this.setColumnsConfig(sortInfo.sortName, sortInfo.sortOrder)
        }, this.handleSearch);
    };
    // 搜索配置
    searchConfig:any = [
        {
            label: '选择日期',
            required: false,
            type: 'rangePicker',
            placeholder: '选择日期',
            name: 'date'
        },
        {
            label: '中心号',
            required: false,
            type: 'text',
            placeholder: '中心号',
            name: 'centerCode'
        }
    ];
    /**
     * 设置表头
     */
    setColumnsConfig = (sortName, sortOrder) => {
        return [{
            title: '中心号',
            dataIndex: 'centerCode',
            key: 'centerCode',
            render: (text: string, record: any) => (
                <Link to={`${Routes.激活码详情.link}${CommonUtils.stringify({ id: record.centerCode })}`}>
                    {text}
                </Link>
            )
        }, {
            title: '消耗数',
            dataIndex: 'consumption',
            key: 'consumption',
            sorter: true,
            sortOrder: sortOrder
        }];
    };
    render(){
        const {
            pageNo, pageSize, dataSource, totalSize, noConsumption, total, consumption,
            columns
        } = this.state;
        return(
            <div>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap gym-holiday'>
                    <div className='gym-acode-manage'>
                        <div className='gym-acode-count'>
                            <span className="title">总共上传：</span><span className="number">{total}</span>
                            <span className="title">已消耗：</span><span className="number">{consumption}</span>
                            <span className="title">未消耗：</span><span className={`number ${noConsumption < 1000 ? "error" : ""}`}>{noConsumption}</span>
                            <span>
                                <Link to={Routes.导入激活码.path}><button className='gym-button-sm gym-button-default mlr15'>导入激活码</button></Link>
                            </span>
                        </div>
                        <SearchForm items={this.searchConfig} onSearch={this.onSearch}/>
                        <TablePagination
                            className="gym-acode-manage-table"
                            columns={columns}
                            rowKey={'id'}
                            dataSource={dataSource}
                            totalSize={totalSize}
                            pageSize={pageSize}
                            handleFilterTableChange={this.handleSort}
                            handleChangePage={this.handleChangePage}
                            pageNo={pageNo}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export { AcodeList}
