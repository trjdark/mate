/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/2/25
 * Time: 下午3:38
 */
import React from 'react';
import {SettingRoutes} from "@/router/enum/settingRoutes";
import {BreadCrumb} from '@/ui/component/breadcrumb';
import {SearchForm} from '@/ui/component/searchForm';
import {TablePagination} from '@/ui/component/tablePagination';
import {Link} from 'react-router-dom';
import {User} from "@/common/beans/user";
import {message} from "antd";
import moment from 'moment';
import {CommonUtils} from "@/common/utils/commonUtils";
import {getCenterPerformanceList} from "@redux-actions/setting/performanceIncomeActions";
import {Routes} from "@/router/enum/routes";

class PerformanceIncomeList extends React.Component<any, any> {
    centerAchievementItem:Array<any> =  [    // 查询表单数据
        {
            type: 'months',
            label: '选择年月',
            name: {
                start: 'beginDate',
                end: 'endDate'
            },
        }
    ];
    centerAchievementColumns = [     // 表头数据
        {
            title: '年月',
            dataIndex: 'date',
            render: (text) => {
                return text ? moment(text).format('YYYY-MM') : '';
            }
        },
        {
            title: '月目标预定量',
            dataIndex: 'targetSales',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: (text, record) => {
                const params = CommonUtils.stringify({id: record.id});
                return (
                    <div>
                        <Link to={`${SettingRoutes.业绩指标详情.link}${params}`}>
                            <button className="gym-button-xxs gym-button-white">编辑</button>
                        </Link>
                    </div>
                )
            }
        }
    ];
    private breadCrumbRoutes: Array<any> = [
        {name: '设置', path: '', link: '#', id: ''},
        {name: '运营管理', path: '', link: '#', id: ''},
        {name: '约课指标设置', path: '', link: '#',}
    ];
    constructor(props){
        super(props)
        this.state = {
            dataSource: [],     // 列表数据
            beginDate: undefined,   // 起始时间
            endDate: undefined,     // 终止时间
            totalSize: 0,
            pageNo: 1,          // 页数
            pageSize: 10,       // 每页请求条数
        }
    }
    componentDidMount() {
        this.handleSearch();
    }
    // 查询
    onSearch = (values) => {
        this.setState({...values,}, this.handleSearch);
    };
    // 重置
    onReset = (values) => {
        this.setState({...values,}, this.handleSearch);
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({...pageInfo,}, this.handleSearch);
    }
    // 查询
    handleSearch = () => {
        let {pageNo, pageSize, beginDate, endDate} = this.state;
        beginDate = beginDate ? beginDate.valueOf() : beginDate;
        endDate = endDate ? endDate.valueOf() : endDate;
        if (beginDate > endDate) {
            // 开始时间大于结束时间报错
            message.error('开始时间不能大于结束时间');
            return;
        }
        if(beginDate && !endDate){
            message.error('请选择结束时间');
            return;
        }
        if(!beginDate && endDate){
            message.error('请选择开始时间');
            return;
        }
        const params = {
            currentCenterId: User.currentCenterId,
            beginDate,
            endDate,
            pageNo, pageSize,
        };
        getCenterPerformanceList(params).then(res => {
            const {pageNo, pageSize, totalSize, list} = res;
            this.setState({
                dataSource: list,
                pageNo, pageSize, totalSize,
            })
        });
    };
    render() {
        const { dataSource, totalSize, pageNo, pageSize} = this.state;
        return (
            <div className="center-achievement">
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap">
                    <SearchForm
                        items={this.centerAchievementItem}
                        onSearch={this.onSearch}
                        onReset={this.onReset}
                    />

                    {/* 新建 */}
                    <Link to={`${Routes.业绩指标详情.link}`}>
                        <button className="gym-button-default gym-button-xs market-list-add mb20">新建</button>
                    </Link>

                    {/* table表格 */}
                    <TablePagination
                        columns={this.centerAchievementColumns}
                        rowKey={item => item.id}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}

                    />
                </div>
            </div>
        )
    }
}

export {PerformanceIncomeList}
