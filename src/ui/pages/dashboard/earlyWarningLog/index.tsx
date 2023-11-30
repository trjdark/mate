/**
 * desc: 预警日志
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/2
 * Time: 下午3:22
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {queryEarlyWarningList} from "@redux-actions/report/earlyWarning";
import moment from 'moment';
import {User} from "@/common/beans/user";

class EarlyWarningLog extends Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            pageSize: 10,
            pageNo:1,
            warningDate: moment(new Date()),
            dateSource: [],
            totalSize: 0
        }
    }
    breadCrumbRoutes = [
        {
            name: '仪表盘'
        }, {
            name: '预警日志'
        },
    ];
    searchConfig:Array<any> = [
        {
            type: 'datesPicker',
            label: '预警日期',
            name: 'warningDate',
            initialValue: moment(new Date())
        },
    ];
    columns =  [
        {
            title: '预警指标',
            dataIndex: 'warningType',
        },
        {
            title: '年月',
            dataIndex: 'warningYearMonth',
        },{
            title: '预警数',
            dataIndex: 'warningNum',
            render:(text:string, record:any) => `${text}${record.unit}`
        },{
            title: '预警日期',
            dataIndex: 'warningDate',
            render:(date:number) => moment(date).format("YYYY-MM-DD")
        },
    ];

    componentDidMount(){
        this.getLogList();
    }

    /**
     * 获取信息
     */
    getLogList = () => {
        const param = {
            currentCenterId: User.currentCenterId,
            userId: User.userId,
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            warningDate: this.state.warningDate.valueOf()
        };
        queryEarlyWarningList(param)
            .then((res:any) => {
                this.setState({
                    dateSource: res.list,
                    totalSize:res.totalSize
                })
            })
    };
    /**
     * 搜索
     * @param date
     */
    onSearch = (date:any) => {
        this.setState(Object.assign({},date, {pageNo:1}), this.getLogList)
    };
    /**
     * 翻页
     * @param pageInfo
     */
    handlePage = (pageInfo) => {
        this.setState(pageInfo, this.getLogList)
    };
    render(){
        const {pageNo, pageSize, dateSource, totalSize} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className="page-wrap">
                    <div className="">
                            <SearchForm
                                items={this.searchConfig}
                                onSearch={this.onSearch}
                            />
                    </div>

                    <div>
                        <TablePagination
                            dataSource={dateSource}
                            pageSize={pageSize}
                            pageNo={pageNo}
                            totalSize={totalSize}
                            columns={this.columns}
                            handleChangePage={this.handlePage}
                            rowKey="id"
                        />
                    </div>
                </div>
            </Fragment>

        )
    }
}

export {EarlyWarningLog}
